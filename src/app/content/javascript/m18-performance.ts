import { Lesson } from '../../shared/content';

export const M18_PERFORMANCE: Lesson = {
  "slug": "m18-performance",
  "title": "M18 Memory, performance and patterns",
  "nav": "Memory & performance",
  "num": "M18",
  "eyebrow": "Level 6 · Week 12 · ~3 sessions",
  "blocks": [
    {
      "kind": "heading",
      "level": 3,
      "text": "How memory is managed"
    },
    {
      "kind": "text",
      "text": "JavaScript is garbage collected. The collector uses **reachability**: starting from roots (the global object, the current call stack), it marks everything reachable and frees the rest. You never free memory yourself — you only make things unreachable by dropping references."
    },
    {
      "kind": "text",
      "text": "Leaks happen when something stays reachable that you thought was gone. Four common causes:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Forgotten timers.** A `setInterval` that's never cleared keeps its callback — and everything that callback closes over — alive forever.",
        "**Detached DOM nodes.** You removed an element from the page, but a variable or a listener still references it, so the node and its subtree stay in memory.",
        "**Unbounded caches.** A `Map` you only ever add to. Every memoizer needs a size limit or an eviction rule.",
        "**Accidental globals.** In non-strict code, `x = 5` without a declaration creates a global that never goes away."
      ]
    },
    {
      "kind": "example",
      "code": "// A leak, and its fix\nfunction startPolling() {\n  const bigBuffer = new Array(100_000).fill(\"data\");   // captured by the closure\n  const id = setInterval(() => console.log(bigBuffer.length), 1000);\n  return () => clearInterval(id);      // hand back a cleanup function\n}\nconst stop = startPolling();\nstop();                                 // now the interval AND the buffer can be freed\nconsole.log(\"polling stopped and memory released\");\n\n// WeakMap: metadata that disappears with its key\nconst metadata = new WeakMap();\nlet element = { id: \"node-1\" };         // stands in for a DOM node\nmetadata.set(element, { renderedAt: Date.now() });\nconsole.log(metadata.has(element));\nelement = null;                          // the entry becomes collectable automatically\nconsole.log(\"dropped the key — WeakMap entry can now be collected\");\n\n// A bounded cache — the fix for the memoizer in Module 11\nfunction boundedMemo(fn, limit = 100) {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) {\n      const value = cache.get(key);\n      cache.delete(key); cache.set(key, value);   // mark as most recently used\n      return value;\n    }\n    const value = fn(...args);\n    cache.set(key, value);\n    if (cache.size > limit) cache.delete(cache.keys().next().value); // evict oldest\n    return value;\n  };\n}\nconst slow = n => n * n;\nconst fast = boundedMemo(slow, 2);\nconsole.log(fast(2), fast(3), fast(4), fast(2));",
      "label": "memory.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Performance that actually matters"
    },
    {
      "kind": "text",
      "text": "Ignore micro-benchmarks. In real applications, four things dominate:"
    },
    {
      "kind": "list",
      "ordered": true,
      "items": [
        "**Blocking the main thread.** Long synchronous work freezes rendering and input. Break it up, or move it to a Web Worker.",
        "**Layout thrashing.** Alternating DOM writes and reads (`offsetHeight`, `getBoundingClientRect`) forces the browser to recalculate layout each time. Batch reads, then batch writes.",
        "**Too many events.** Scroll, resize, mousemove and keystroke handlers fire constantly. Debounce, throttle, or use `IntersectionObserver`/`ResizeObserver`.",
        "**Shipping too much JavaScript.** Download and parse cost is real. Code-split with dynamic `import()`, and check what your dependencies weigh."
      ]
    },
    {
      "kind": "example",
      "code": "// Measuring, instead of guessing\nconst items = Array.from({ length: 50_000 }, (_, i) => i);\n\nconsole.time(\"chained\");\nconst a = items.filter(n => n % 2 === 0).map(n => n * 2).reduce((s, n) => s + n, 0);\nconsole.timeEnd(\"chained\");     // three passes, two intermediate arrays\n\nconsole.time(\"single pass\");\nlet b = 0;\nfor (const n of items) if (n % 2 === 0) b += n * 2;\nconsole.timeEnd(\"single pass\");\n\nconsole.log(a === b);\n// Both are fast. Chaining is clearer; the loop wins only at large sizes\n// or in a hot path. Measure BEFORE trading readability for speed.\n\n// Layout thrashing — the shape to avoid:\n//   for (const el of els) { el.style.width = el.offsetWidth + 10 + \"px\"; }\n//   (write, read, write, read… a forced reflow every iteration)\n// The fix: read everything first, then write everything.\n//   const widths = els.map(el => el.offsetWidth);\n//   els.forEach((el, i) => { el.style.width = widths[i] + 10 + \"px\"; });\n\n// Yielding to the event loop so the page stays responsive:\nasync function processInChunks(list, chunk = 10_000) {\n  let sum = 0;\n  for (let i = 0; i < list.length; i += chunk) {\n    for (const n of list.slice(i, i + chunk)) sum += n;\n    await new Promise(r => setTimeout(r, 0));   // let rendering and input through\n  }\n  return sum;\n}\nprocessInChunks(items).then(total => console.log(\"chunked total:\", total));",
      "label": "perf.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Patterns worth knowing by name"
    },
    {
      "kind": "example",
      "code": "// 1. Module pattern — private state behind a public API (a closure, formalised)\nconst store = (() => {\n  let items = [];                       // private\n  return {\n    add(item) { items = [...items, item]; return this; },\n    get all() { return [...items]; },    // hand out a copy, not the internals\n    get size() { return items.length; },\n  };\n})();\nstore.add(\"a\").add(\"b\");\nconsole.log(store.all, store.size);\nstore.all.push(\"hack\");                 // mutating the copy changes nothing\nconsole.log(store.size);\n\n// 2. Observer / pub-sub — the backbone of event-driven code\nclass EventBus {\n  #handlers = new Map();\n  on(type, fn) {\n    if (!this.#handlers.has(type)) this.#handlers.set(type, new Set());\n    this.#handlers.get(type).add(fn);\n    return () => this.off(type, fn);      // return an unsubscribe function\n  }\n  off(type, fn) { this.#handlers.get(type)?.delete(fn); }\n  emit(type, payload) {\n    for (const fn of this.#handlers.get(type) ?? []) {\n      try { fn(payload); } catch (e) { console.log(\"handler error:\", e.message); }\n    }\n  }\n}\nconst bus = new EventBus();\nconst unsubscribe = bus.on(\"save\", data => console.log(\"saved:\", data));\nbus.on(\"save\", () => { throw new Error(\"one bad handler\"); });\nbus.emit(\"save\", { id: 1 });            // one handler fails, the other still runs\nunsubscribe();\nbus.emit(\"save\", { id: 2 });            // nothing logged — unsubscribed\n\n// 3. Singleton via a module-scoped instance\nconst config = Object.freeze({ apiUrl: \"/api\", retries: 3 });\nconsole.log(Object.isFrozen(config));",
      "label": "patterns.js"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "`const` by default · `===` always · small functions with one job · descriptive names over comments explaining bad names · handle the error case first and return early · never mutate function arguments · guard every value that came from a network or a user · write the code so the *next* reader (you, in six months) needs no explanation."
        }
      ],
      "title": "Best practices, condensed"
    },
    {
      "kind": "reveal",
      "tag": "Interview Q19",
      "title": "What causes memory leaks in JavaScript, and how do you find them?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A leak is memory that stays reachable but is no longer needed. The common causes: uncleared timers and intervals; event listeners on elements that were removed (detached DOM trees, kept alive by the listener or a stray reference); closures capturing large objects they don't use; unbounded caches and arrays; and accidental globals in non-strict code."
        },
        {
          "kind": "text",
          "text": "To find them: take heap snapshots in Chrome DevTools' Memory panel before and after the suspect interaction, compare with the \"Objects allocated between snapshots\" view, and look for growing detached HTMLElement counts; the Performance panel's memory graph should return to its baseline after a workflow, not step upward. Fixes: return cleanup functions from anything that subscribes, use `AbortController` to remove listeners in one call, and use `WeakMap`/`WeakSet` for metadata keyed on objects you don't own."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q20",
      "title": "How would you optimise a slow web page?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Measure first — Lighthouse and the Performance panel — and identify whether the problem is loading, scripting, rendering or network. Then, in rough order of payoff: reduce and split the JavaScript bundle (dynamic `import()`, drop heavy dependencies); defer non-critical work; eliminate long tasks by chunking or moving them to a Web Worker; debounce or throttle high-frequency handlers; batch DOM reads and writes to avoid forced synchronous layout; use event delegation instead of thousands of listeners; virtualise long lists so only visible rows exist in the DOM; and cache network results, deduplicating in-flight requests."
        },
        {
          "kind": "text",
          "text": "Frame it around the metrics an interviewer expects — Largest Contentful Paint, Interaction to Next Paint, Cumulative Layout Shift — and be explicit that you profile before optimising."
        }
      ]
    }
  ]
};
