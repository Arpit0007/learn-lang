/**
 * Parser for the content text format: **bold**, *italic*, `code`,
 * [link](https://…), and backslash escapes (\* \` \[ \] \\) for literal characters.
 */
type Segment =
  | { type: 'text'; text: string }
  | { type: 'code'; text: string }
  | { type: 'strong' | 'em'; children: Segment[] }
  | { type: 'link'; href: string; children: Segment[] };

export function parseRich(input: string): Segment[] {
  return new Parser(input).parse(null).segments;
}

class Parser {
  private i = 0;
  constructor(private readonly s: string) {}

  /** Parses until `stop` (or end). `closed` says whether the stop marker was found. */
  parse(stop: '**' | '*' | ']' | null): { segments: Segment[]; closed: boolean } {
    const out: Segment[] = [];
    let text = '';
    const flush = () => { if (text) { push(out, { type: 'text', text }); text = ''; } };

    while (this.i < this.s.length) {
      const c = this.s[this.i];
      if (c === '\\' && this.i + 1 < this.s.length) { text += this.s[this.i + 1]; this.i += 2; continue; }

      const marker = c === '*' ? (this.s[this.i + 1] === '*' ? '**' : '*') : c === ']' ? ']' : null;
      if (marker && marker === stop) { this.i += marker.length; flush(); return { segments: out, closed: true }; }

      if (c === '`') {
        const code = this.readCode();
        if (code !== null) { flush(); out.push({ type: 'code', text: code }); continue; }
        text += c; this.i++; continue;
      }
      if (c === '*') {
        const m = this.s[this.i + 1] === '*' ? '**' : '*';
        const start = this.i;
        this.i += m.length;
        const inner = this.parse(m);
        if (inner.closed && inner.segments.length) { flush(); out.push({ type: m === '**' ? 'strong' : 'em', children: inner.segments }); }
        else { this.i = start + m.length; text += m; }
        continue;
      }
      if (c === '[') {
        const start = this.i;
        this.i++;
        const inner = this.parse(']');
        const href = inner.closed ? this.readHref() : null;
        if (href !== null) { flush(); out.push({ type: 'link', href, children: inner.segments }); }
        else { this.i = start + 1; text += '['; }
        continue;
      }
      text += c;
      this.i++;
    }
    flush();
    return { segments: out, closed: stop === null };
  }

  /** Reads `code` starting at a backtick; returns null if it is never closed. */
  private readCode(): string | null {
    let j = this.i + 1;
    let code = '';
    while (j < this.s.length) {
      const c = this.s[j];
      if (c === '\\' && j + 1 < this.s.length) { code += this.s[j + 1]; j += 2; continue; }
      if (c === '`') { this.i = j + 1; return code; }
      code += c;
      j++;
    }
    return null;
  }

  /** Reads "(href)" directly after a closing bracket, allowing balanced parentheses inside; null if absent. */
  private readHref(): string | null {
    if (this.s[this.i] !== '(') return null;
    let depth = 0;
    for (let j = this.i; j < this.s.length; j++) {
      if (this.s[j] === '(') depth++;
      else if (this.s[j] === ')' && --depth === 0) {
        const href = this.s.slice(this.i + 1, j);
        this.i = j + 1;
        return href;
      }
    }
    return null;
  }
}

function push(out: Segment[], seg: Segment): void {
  const last = out[out.length - 1];
  if (seg.type === 'text' && last?.type === 'text') last.text += seg.text;
  else out.push(seg);
}

/** Only http(s) and mailto links are rendered as links. */
export function safeHref(href: string): string | null {
  return /^(https?:|mailto:)/i.test(href) ? href : null;
}
