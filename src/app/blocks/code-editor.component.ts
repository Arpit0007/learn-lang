import {
  ChangeDetectionStrategy, Component, ElementRef, OnDestroy, afterNextRender, effect, inject, input, output,
} from '@angular/core';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, drawSelection, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { HighlightStyle, bracketMatching, indentOnInput, syntaxHighlighting } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { sql, PostgreSQL } from '@codemirror/lang-sql';
import { tags as t } from '@lezer/highlight';
import { CodeLang } from '../shared/content';

/** Syntax colours from the JavaScript Ladder (code blocks are dark in both themes). */
const ladderHighlight = HighlightStyle.define([
  { tag: [t.keyword, t.bool, t.null, t.self, t.atom, t.special(t.variableName)], color: '#E8A0C8' },
  { tag: [t.string, t.regexp, t.special(t.string)], color: '#9EDA8F' },
  { tag: t.number, color: '#F0C177' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: '#67757F', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#7FC7F0' },
  { tag: [t.className, t.typeName], color: '#F0C177' },
  { tag: [t.tagName, t.angleBracket], color: '#E8A0C8' },
  { tag: t.attributeName, color: '#F0C177' },
  { tag: [t.unit, t.color, t.constant(t.name)], color: '#F0C177' },
  { tag: [t.propertyName, t.variableName], color: '#D9DFE5' },
]);

const ladderTheme = EditorView.theme(
  {
    '&': { backgroundColor: 'transparent', color: '#DCE3E9' },
    '.cm-scroller': { fontFamily: 'var(--mono)', lineHeight: '1.72', padding: '10px 0' },
    '.cm-content': { padding: '4px 16px', caretColor: '#F2C31B' },
    '.cm-gutters': { backgroundColor: 'transparent', color: '#4E5A65', border: 'none' },
    '.cm-activeLine': { backgroundColor: 'rgba(255,255,255,.04)' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': { backgroundColor: 'rgba(242,195,27,.25) !important' },
    '&.cm-focused': { outline: 'none' },
    '.cm-cursor': { borderLeftColor: '#F2C31B' },
  },
  { dark: true },
);

const language = (lang: CodeLang) => {
  switch (lang) {
    case 'html': return html();
    case 'css': return css();
    case 'python': return python();
    case 'sql': return sql({ dialect: PostgreSQL });
    case 'typescript': return javascript({ typescript: true });
    case 'text': return [];
    default: return javascript();
  }
};

/** CodeMirror 6 wrapper: read-only highlighted view, or an editor after Edit. */
@Component({
  selector: 'll-code-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.css',
})
export class CodeEditorComponent implements OnDestroy {
  readonly code = input.required<string>();
  readonly lang = input<CodeLang>('javascript');
  readonly readonly = input(true);
  readonly codeChange = output<string>();

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly editable = new Compartment();
  private view?: EditorView;

  constructor() {
    afterNextRender(() => {
      this.view = new EditorView({
        parent: this.host.nativeElement,
        state: EditorState.create({
          doc: this.code(),
          extensions: [
            ladderTheme,
            syntaxHighlighting(ladderHighlight),
            language(this.lang()),
            history(),
            drawSelection(),
            indentOnInput(),
            bracketMatching(),
            keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
            this.editable.of(this.modeExtensions(this.readonly())),
            EditorView.updateListener.of((u) => { if (u.docChanged) this.codeChange.emit(u.state.doc.toString()); }),
            EditorView.contentAttributes.of({ 'aria-label': 'Code' }),
          ],
        }),
      });
    });

    // Switch read-only <-> editable without rebuilding the editor.
    effect(() => {
      const ro = this.readonly();
      this.view?.dispatch({ effects: this.editable.reconfigure(this.modeExtensions(ro)) });
      if (!ro) this.view?.focus();
    });

    // Replace the document when the input changes from outside (e.g. Reset).
    effect(() => {
      const code = this.code();
      if (this.view && code !== this.view.state.doc.toString()) {
        this.view.dispatch({ changes: { from: 0, to: this.view.state.doc.length, insert: code } });
      }
    });
  }

  private modeExtensions(readOnly: boolean) {
    return readOnly
      ? [EditorState.readOnly.of(true), EditorView.editable.of(false)]
      : [EditorState.readOnly.of(false), EditorView.editable.of(true), lineNumbers(), highlightActiveLine()];
  }

  ngOnDestroy(): void {
    this.view?.destroy();
  }
}
