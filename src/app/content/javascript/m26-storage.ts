import { Lesson } from '../../shared/content';

export const M26_STORAGE: Lesson = {
  "slug": "m26-storage",
  "title": "M26 Storage and the rest of the browser toolbox",
  "nav": "Storage & Web APIs",
  "num": "M26",
  "eyebrow": "Level 7 · read after Module 10 (Week 7) · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "The DOM is one browser API among many. These are the ones that come up in real projects and in interviews — worth knowing they exist, and worth knowing the traps."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Web Storage"
    },
    {
      "kind": "example",
      "code": "// localStorage persists until cleared. sessionStorage dies with the tab.\n// Both store STRINGS ONLY — everything else needs JSON.\nlocalStorage.setItem(\"theme\", \"dark\");\nconsole.log(localStorage.getItem(\"theme\"));\n\nlocalStorage.setItem(\"user\", JSON.stringify({ name: \"Arpit\", visits: 3 }));\nconsole.log(JSON.parse(localStorage.getItem(\"user\")).name);\n\n// TRAP: this stores the string \"[object Object]\"\nlocalStorage.setItem(\"broken\", { a: 1 });\nconsole.log(localStorage.getItem(\"broken\"));\n\n// Storage can throw — private mode, quota exceeded, blocked cookies.\n// Wrap it. Every real app has a helper like this:\nconst store = {\n  get(key, fallback = null) {\n    try {\n      const raw = localStorage.getItem(key);\n      return raw === null ? fallback : JSON.parse(raw);\n    } catch {\n      return fallback;                 // corrupt JSON or blocked storage\n    }\n  },\n  set(key, value) {\n    try { localStorage.setItem(key, JSON.stringify(value)); return true; }\n    catch { return false; }            // quota exceeded — tell the user, don't crash\n  },\n  remove(key) { try { localStorage.removeItem(key); } catch {} },\n};\n\nstore.set(\"todos\", [{ id: 1, text: \"learn storage\", done: false }]);\nconsole.log(store.get(\"todos\"));\nconsole.log(store.get(\"never-set\", []));      // safe default\n\n[\"theme\", \"user\", \"broken\", \"todos\"].forEach(k => store.remove(k));\nconsole.log(\"cleaned up:\", localStorage.getItem(\"theme\"));\n\n// Limits: ~5MB, synchronous (so it blocks the main thread), per origin,\n// readable by any script on the page — never put tokens or secrets in it.\n// For large or structured data use IndexedDB (async, much bigger).",
      "label": "storage.js"
    },
    {
      "kind": "example",
      "code": "// Never build or parse URLs with string concatenation. Use the URL API.\nconst url = new URL(\"https://shop.example.com/search?q=laptop&page=2#results\");\nconsole.log(url.hostname, url.pathname, url.hash);\nconsole.log(url.searchParams.get(\"q\"), url.searchParams.get(\"page\"));\n\nurl.searchParams.set(\"page\", \"3\");\nurl.searchParams.append(\"sort\", \"price\");\nurl.searchParams.delete(\"q\");\nconsole.log(url.toString());          // encoding handled for you\n\n// Building a query string from an object\nconst params = new URLSearchParams({ q: \"wireless mouse & pad\", limit: 20 });\nconsole.log(params.toString());       // spaces and & correctly encoded\n\n// Reading the current page's query in a real app:\n//   const q = new URLSearchParams(location.search).get(\"q\");\n\n// A relative URL resolved against a base\nconsole.log(new URL(\"../login\", \"https://a.example.com/app/settings/\").href);",
      "label": "urls.js"
    },
    {
      "kind": "example",
      "code": "// IntersectionObserver — \"is this element on screen?\" without scroll handlers.\n// Use for lazy-loading images, infinite scroll, and reveal-on-scroll.\nconst observer = new IntersectionObserver((entries) => {\n  for (const entry of entries) {\n    if (!entry.isIntersecting) continue;\n    entry.target.src = entry.target.dataset.src;   // load the real image\n    observer.unobserve(entry.target);              // one-shot: stop watching\n  }\n}, { rootMargin: \"200px\" });                       // start 200px early\ndocument.querySelectorAll(\"img[data-src]\").forEach(img => observer.observe(img));\n\n// ResizeObserver — react to an element's size, not the window's\nnew ResizeObserver(([entry]) => {\n  entry.target.classList.toggle(\"narrow\", entry.contentRect.width < 400);\n}).observe(document.querySelector(\".panel\"));\n\n// requestAnimationFrame — the correct clock for animation\nfunction tick(timestamp) {\n  box.style.transform = `translateX(${Math.sin(timestamp / 500) * 50}px)`;\n  requestAnimationFrame(tick);\n}\nrequestAnimationFrame(tick);\n\n// History API — change the URL without a page load (this is client-side routing)\nhistory.pushState({ view: \"cart\" }, \"\", \"/cart\");\nwindow.addEventListener(\"popstate\", (e) => render(e.state?.view ?? \"home\"));\n\n// Clipboard, media queries, and one-call listener cleanup\nawait navigator.clipboard.writeText(\"copied!\");\nconst prefersDark = window.matchMedia(\"(prefers-color-scheme: dark)\");\nprefersDark.addEventListener(\"change\", e => applyTheme(e.matches ? \"dark\" : \"light\"));\n\nconst controller = new AbortController();\nwindow.addEventListener(\"scroll\", onScroll, { signal: controller.signal });\nwindow.addEventListener(\"resize\", onResize, { signal: controller.signal });\ncontroller.abort();      // removes BOTH listeners in one call — no leaks\n\n// Web Worker — move CPU-heavy work off the main thread\nconst worker = new Worker(\"./cruncher.js\", { type: \"module\" });\nworker.postMessage({ rows: 500000 });\nworker.onmessage = (e) => console.log(\"result from worker:\", e.data);",
      "label": "browser-apis.js",
      "run": "none"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Storing auth tokens in `localStorage`, where any injected script can read them — use `HttpOnly` cookies. Forgetting `JSON.parse` and comparing `\"false\"` (a truthy string) to `false`. Not wrapping reads in `try/catch`, so one corrupt entry breaks the whole app on load forever. And assuming storage is available: private browsing, blocked third-party contexts and full quotas all make it throw."
        }
      ],
      "title": "Trap · Storage mistakes that reach production"
    },
    {
      "kind": "reveal",
      "tag": "Interview Q53",
      "title": "A page becomes janky while scrolling a long list. What do you do?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Profile first in the Performance panel to see whether time is going to scripting, layout, paint or long tasks. Then the usual causes and fixes: a heavy `scroll` handler doing layout reads — replace it with `IntersectionObserver` or throttle it and batch reads before writes; thousands of DOM nodes — virtualise so only visible rows exist; images without dimensions causing layout shift — set explicit sizes and lazy-load; animating properties that trigger layout (`top`, `width`) instead of `transform` and `opacity`, which the compositor can handle; and long synchronous tasks — chunk them, or move the work to a Web Worker."
        }
      ]
    }
  ]
};
