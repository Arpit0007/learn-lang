/** Message posted from a sandboxed example to the lesson page. */
export interface RunMessage {
  source: 'll-run';
  runId: string;
  type: 'line' | 'done' | 'resize';
  level?: 'log' | 'warn' | 'err';
  text?: string;
  height?: number;
}

interface JsSrcdocOptions {
  /** Starting HTML of the `root` element for DOM demos. */
  demoHtml?: string;
  /** Matches the site theme so demo widgets don't flash the wrong colours. */
  dark?: boolean;
}

/** JSON is safe inside <script> once `<` can't start a closing tag. */
const scriptJson = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c');

/**
 * Builds the document for one run of a JavaScript example inside a sandboxed
 * iframe (no allow-same-origin). The bridge mirrors the Ladder's console:
 * same value formatting and console methods, and the code runs as
 * `async () => { … }` with `root` in scope.
 */
export function buildJsSrcdoc(code: string, runId: string, options: JsSrcdocOptions = {}): string {
  const { demoHtml = '', dark = false } = options;
  const c = dark
    ? { bg: '#161C22', ink: '#E6ECF1', soft: '#9DAAB5', line: '#293238', s2: '#1C242B', page: '#0E1216', wash: '#2A2415' }
    : { bg: '#FFFFFF', ink: '#11161B', soft: '#4E5A65', line: '#C8D0D7', s2: '#F1F4F6', page: '#E7EAED', wash: '#FBF0C8' };

  return `<!doctype html><html><head><meta charset="utf-8">
<style>
html,body{margin:0;background:${c.bg};color:${c.ink};color-scheme:${dark ? 'dark' : 'light'}}
#root{font-family:"Bricolage Grotesque","Helvetica Neue",Arial,sans-serif;font-size:14.5px;padding:12px 14px 14px;display:flex;flex-direction:column;gap:8px;align-items:flex-start}
#root:empty{display:none}
#root .card{display:flex;flex-direction:column;gap:8px;align-items:flex-start;width:100%}
#root h4{font-size:16px;margin:0}#root p{margin:0}
#root ul{margin:0;padding-left:20px}#root li{margin:3px 0}
#root li.done{text-decoration:line-through;color:${c.soft}}
#root button{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12px;padding:4px 10px;border-radius:5px;border:1px solid ${c.line};background:${c.s2};color:${c.ink};cursor:pointer}
#root input{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12.5px;padding:5px 9px;border-radius:5px;border:1px solid ${c.line};background:${c.page};color:${c.ink};min-width:180px}
#root form{display:flex;flex-direction:column;gap:8px;align-items:flex-start;width:100%}
#root .highlight{background:${c.wash};padding:0 4px;border-radius:3px}
#root .compact{letter-spacing:-.02em}
</style>
<script>
(function () {
  var RUN_ID = ${scriptJson(runId)};
  function post(msg) { msg.source = 'll-run'; msg.runId = RUN_ID; parent.postMessage(msg, '*'); }

  // Sandboxed frames can't use real storage; give examples an in-memory stand-in.
  function MemoryStorage() { var data = new Map(); return {
    getItem: function (k) { k = String(k); return data.has(k) ? data.get(k) : null; },
    setItem: function (k, v) { data.set(String(k), String(v)); },
    removeItem: function (k) { data.delete(String(k)); },
    clear: function () { data.clear(); },
    key: function (i) { var keys = Array.from(data.keys()); return i < keys.length ? keys[i] : null; },
    get length() { return data.size; }
  }; }
  try { Object.defineProperty(window, 'localStorage', { value: MemoryStorage(), configurable: true }); } catch (e) {}
  try { Object.defineProperty(window, 'sessionStorage', { value: MemoryStorage(), configurable: true }); } catch (e) {}

  function fmt(v, depth) {
    depth = depth || 0;
    if (typeof v === 'string') return depth ? JSON.stringify(v) : v;
    if (v === undefined) return 'undefined';
    if (v === null) return 'null';
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (typeof v === 'bigint') return v + 'n';
    if (typeof v === 'symbol') return v.toString();
    if (typeof v === 'function') return '[Function: ' + (v.name || 'anonymous') + ']';
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (v instanceof Date) return v.toISOString();
    if (depth > 4) return '…';
    if (Array.isArray(v)) return '[' + v.map(function (x) { return fmt(x, depth + 1); }).join(', ') + ']';
    if (v instanceof Map) return 'Map(' + v.size + ') {' + Array.from(v).map(function (p) { return fmt(p[0], depth + 1) + ' => ' + fmt(p[1], depth + 1); }).join(', ') + '}';
    if (v instanceof Set) return 'Set(' + v.size + ') {' + Array.from(v).map(function (x) { return fmt(x, depth + 1); }).join(', ') + '}';
    if (v instanceof Promise) return 'Promise { … }';
    if (typeof Element !== 'undefined' && v instanceof Element) return '<' + v.tagName.toLowerCase() + (v.id ? '#' + v.id : '') + '>';
    try {
      var ctor = v.constructor && v.constructor.name;
      var prefix = ctor && ctor !== 'Object' ? ctor + ' ' : '';
      return prefix + '{ ' + Object.keys(v).map(function (k) { return k + ': ' + fmt(v[k], depth + 1); }).join(', ') + ' }';
    } catch (e) { return String(v); }
  }

  var depth = 0, timers = {}, counters = {};
  function write(level, args) {
    var text = Array.prototype.map.call(args, function (a) { return fmt(a); }).join(' ');
    post({ type: 'line', level: level, text: depth ? '  '.repeat(depth) + text : text });
  }
  var con = {
    log: function () { write('log', arguments); },
    info: function () { write('log', arguments); },
    debug: function () { write('log', arguments); },
    dir: function () { write('log', arguments); },
    table: function () { write('log', arguments); },
    trace: function () { write('log', ['Trace:'].concat([].slice.call(arguments))); },
    warn: function () { write('warn', arguments); },
    error: function () { write('err', arguments); },
    group: function () { write('log', arguments); depth++; },
    groupCollapsed: function () { write('log', arguments); depth++; },
    groupEnd: function () { depth = Math.max(0, depth - 1); },
    count: function (label) { var k = label === undefined ? 'default' : String(label); counters[k] = (counters[k] || 0) + 1; write('log', [k + ': ' + counters[k]]); },
    countReset: function (label) { counters[label === undefined ? 'default' : String(label)] = 0; },
    assert: function (ok) { if (!ok) write('err', ['Assertion failed:'].concat([].slice.call(arguments, 1))); },
    clear: function () {},
    time: function (l) { timers[l] = performance.now(); },
    timeEnd: function (l) { var t = timers[l]; write('log', [l + ': ' + (t === undefined ? 'no such timer' : (performance.now() - t).toFixed(1) + 'ms')]); }
  };
  Object.keys(con).forEach(function (k) { console[k] = con[k]; });

  function errText(e) { return e && e.name ? e.name + ': ' + e.message : String(e); }
  window.addEventListener('error', function (e) { write('err', [e.error ? errText(e.error) : e.message]); });
  window.addEventListener('unhandledrejection', function (e) { write('err', ['Uncaught (in promise) ' + errText(e.reason)]); });

  window.__llRun = function (code) {
    var root = document.getElementById('root');
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () { post({ type: 'resize', height: document.documentElement.scrollHeight }); }).observe(document.body);
    }
    var fn;
    try { fn = new Function('root', 'return (async () => {\\n' + code + '\\n})();'); }
    catch (e) { write('err', [errText(e)]); post({ type: 'done' }); return; }
    Promise.resolve().then(function () { return fn(root); })
      .catch(function (e) { write('err', [errText(e)]); })
      .then(function () { post({ type: 'done' }); });
  };
})();
</script></head><body><div id="root">${demoHtml}</div>
<script>window.__llRun(${scriptJson(code)});</script>
</body></html>`;
}
