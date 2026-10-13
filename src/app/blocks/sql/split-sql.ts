/**
 * Splits a SQL script into statements the way psql does: a `;` ends a
 * statement only outside strings ('…', E'…'), quoted identifiers ("…"),
 * dollar-quoted bodies ($$…$$, $tag$…$tag$) and comments (--…, nested /* … *\/).
 * Statements that are empty or contain only comments are dropped.
 */
export function splitSql(script: string): string[] {
  const out: string[] = [];
  let start = 0;
  let i = 0;
  const n = script.length;

  const push = (end: number) => {
    const text = script.slice(start, end).trim();
    if (text && stripComments(text).trim()) out.push(text);
  };

  while (i < n) {
    const c = script[i];
    const next = script[i + 1];

    if (c === '-' && next === '-') {                      // line comment
      const nl = script.indexOf('\n', i);
      i = nl < 0 ? n : nl + 1;
    } else if (c === '/' && next === '*') {               // block comment (nests in PostgreSQL)
      let depth = 1;
      i += 2;
      while (i < n && depth > 0) {
        if (script[i] === '/' && script[i + 1] === '*') { depth++; i += 2; }
        else if (script[i] === '*' && script[i + 1] === '/') { depth--; i += 2; }
        else i++;
      }
    } else if (c === "'") {                               // string; E'…' also allows backslash escapes
      const escapes = i > 0 && /[eE]/.test(script[i - 1]) && (i < 2 || !/[A-Za-z0-9_]/.test(script[i - 2]));
      i++;
      while (i < n) {
        if (escapes && script[i] === '\\') { i += 2; continue; }
        if (script[i] === "'") {
          if (script[i + 1] === "'") { i += 2; continue; } // '' is an escaped quote
          i++;
          break;
        }
        i++;
      }
    } else if (c === '"') {                               // quoted identifier ("" escapes a quote)
      i++;
      while (i < n) {
        if (script[i] === '"') {
          if (script[i + 1] === '"') { i += 2; continue; }
          i++;
          break;
        }
        i++;
      }
    } else if (c === '$') {                               // dollar quote, but not a $1 parameter
      const m = /^\$([A-Za-z_][A-Za-z0-9_]*)?\$/.exec(script.slice(i));
      if (m && !(i > 0 && /[A-Za-z0-9_]/.test(script[i - 1]))) {
        const tag = m[0];
        const end = script.indexOf(tag, i + tag.length);
        i = end < 0 ? n : end + tag.length;
      } else {
        i++;
      }
    } else if (c === ';') {
      push(i);
      i++;
      start = i;
    } else {
      i++;
    }
  }
  push(n);
  return out;
}

/** Removes comments (used only to decide whether a statement is empty). */
function stripComments(text: string): string {
  return text.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
}
