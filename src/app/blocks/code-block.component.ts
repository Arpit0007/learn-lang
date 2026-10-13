import {
  ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, computed, inject, input, signal, viewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Block, Course } from '../shared/content';
import { CodeEditorComponent } from './code-editor.component';
import { RunMessage, buildJsSrcdoc } from './build-js-srcdoc';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../core/services/theme.service';
import { LessonContext } from './lesson-context';
import { SqlOutputComponent } from './sql/sql-output.component';
import { SqlRunnerService } from './sql/sql-runner.service';
import type { StatementResult } from './sql/run-sql';

type Example = Extract<Block, { kind: 'example' }>;
interface Line { level: 'log' | 'warn' | 'err' | 'muted'; text: string }

const NO_OUTPUT = '(no output — add a console.log to see values)';
const newRunId = () => Math.random().toString(36).slice(2);

/**
 * A code example with the Ladder's header bar. Inline JavaScript runs in a sandboxed iframe;
 * inline SQL runs in PostgreSQL (PGlite) in a worker, on a fresh copy of the course database.
 */
@Component({
  selector: 'll-code-block',
  standalone: true,
  imports: [CodeEditorComponent, RouterLink, SqlOutputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-block.component.html',
})
export class CodeBlockComponent implements OnDestroy {
  readonly block = input.required<Example>();
  readonly course = input.required<Course>();

  private readonly sanitizer = inject(DomSanitizer);
  private readonly theme = inject(ThemeService);
  private readonly frameRef = viewChild<ElementRef<HTMLIFrameElement>>('frame');

  protected readonly lang = computed(() => this.block().lang ?? this.course().exampleLang);
  private readonly context = inject(LessonContext, { optional: true });
  private readonly mode = computed(() => this.block().run ?? this.course().exampleRun);
  protected readonly runnable = computed(() => this.mode() === 'inline');
  protected readonly tryItLink = computed(() => (this.mode() === 'tryit' ? this.context?.tryItLink(this.block()) ?? null : null));
  protected readonly code = signal('');
  protected readonly editing = signal(false);
  protected readonly running = signal(false);
  protected readonly ran = signal(false);
  protected readonly lines = signal<Line[]>([]);
  protected readonly frame = signal<{ runId: string; doc: SafeHtml } | null>(null);
  protected readonly frameHeight = signal(120);
  protected readonly copyLabel = signal('Copy');
  /** Stored output revealed by "Show output" (predict first, then check). */
  protected readonly showOutput = signal(false);
  private timers: ReturnType<typeof setTimeout>[] = [];

  // ---- SQL ----
  private readonly sql = inject(SqlRunnerService);
  protected readonly isSql = computed(() => this.lang() === 'sql');
  protected readonly sqlResults = signal<StatementResult[] | null>(null);
  protected readonly sqlMessage = signal<{ level: 'muted' | 'err'; text: string } | null>(null);
  private sqlRunId: string | null = null;

  ngOnInit(): void {
    this.code.set(this.block().code);
    // DOM demos show their sandbox before the first run, as in the Ladder.
    if (this.block().demoHtml && this.runnable()) this.load(newRunId(), '');
  }

  run(): void {
    if (this.isSql()) { this.runSql(); return; }
    this.clearTimers();
    this.lines.set([]);
    this.ran.set(true);
    this.running.set(true);
    this.load(newRunId(), this.code());
    // Safety net: never leave the button stuck if the code never settles.
    this.timers.push(setTimeout(() => this.running.set(false), 10_000));
  }

  reset(): void {
    if (this.sqlRunId) this.stopSql();
    this.code.set(this.block().code);
    this.editing.set(false);
    this.ran.set(false);
    this.lines.set([]);
    this.sqlResults.set(null);
    this.sqlMessage.set(null);
    this.clearTimers();
    if (this.block().demoHtml) this.load(newRunId(), '');
    else this.frame.set(null);
  }

  stopSql(): void {
    if (this.sqlRunId) this.sql.stop(this.sqlRunId);
  }

  private runSql(): void {
    this.ran.set(true);
    this.running.set(true);
    this.sqlResults.set(null);
    // The first run in a visit downloads and starts PostgreSQL; later runs are instant.
    this.sqlMessage.set(this.sql.starting() ? { level: 'muted', text: 'Starting PostgreSQL… (the first run downloads about 4 MB)' } : null);
    const { runId, done } = this.sql.run({ seed: this.course().setup ?? '', setup: this.block().setup, code: this.code() });
    this.sqlRunId = runId;
    const slow = setTimeout(() => {
      if (this.sqlRunId === runId && !this.sqlResults()) this.sqlMessage.set({ level: 'muted', text: 'Starting PostgreSQL… (the first run downloads about 4 MB)' });
    }, 400);
    void done.then((outcome) => {
      clearTimeout(slow);
      if (this.sqlRunId !== runId) return;
      this.sqlRunId = null;
      this.running.set(false);
      if (outcome.kind === 'results') {
        this.sqlMessage.set(outcome.results.length ? null : { level: 'muted', text: '(nothing to run)' });
        this.sqlResults.set(outcome.results);
      } else if (outcome.kind === 'stopped') {
        this.sqlMessage.set({
          level: 'err',
          text: outcome.reason === 'timeout' ? 'Stopped: the query ran for more than 15 seconds.' : 'Stopped.',
        });
      } else {
        this.sqlMessage.set({ level: 'err', text: `PostgreSQL could not run: ${outcome.message}` });
      }
    });
  }

  copy(): void {
    navigator.clipboard?.writeText(this.code()).then(
      () => this.flashCopy('Copied'),
      () => this.flashCopy('Press Ctrl+C'),
    );
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent<RunMessage>): void {
    const msg = event.data;
    const current = this.frame();
    if (!current || msg?.source !== 'll-run' || msg.runId !== current.runId) return;
    if (event.source !== this.frameRef()?.nativeElement.contentWindow) return;

    if (msg.type === 'resize' && msg.height) this.frameHeight.set(Math.min(Math.max(msg.height, 40), 600));
    else if (msg.type === 'line' && this.ran()) this.lines.update((ls) => [...ls, { level: msg.level ?? 'log', text: msg.text ?? '' }]);
    else if (msg.type === 'done' && this.ran()) {
      this.running.set(false);
      this.timers.push(setTimeout(() => {
        if (!this.lines().length) this.lines.set([{ level: 'muted', text: NO_OUTPUT }]);
      }, 700));
    }
  }

  private load(runId: string, code: string): void {
    const doc = buildJsSrcdoc(code, runId, { demoHtml: this.block().demoHtml, dark: this.theme.isDark() });
    this.frame.set({ runId, doc: this.sanitizer.bypassSecurityTrustHtml(doc) });
  }

  private flashCopy(label: string): void {
    this.copyLabel.set(label);
    this.timers.push(setTimeout(() => this.copyLabel.set('Copy'), 1200));
  }

  private clearTimers(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  ngOnDestroy(): void {
    this.clearTimers();
    if (this.sqlRunId) this.stopSql();
  }
}
