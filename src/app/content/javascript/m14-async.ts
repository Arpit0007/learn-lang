import { Lesson } from '../../shared/content';

export const M14_ASYNC: Lesson = {
  "slug": "m14-async",
  "title": "M14 Asynchronous JavaScript and the event loop",
  "nav": "Async & event loop",
  "num": "M14",
  "eyebrow": "Level 5 · Week 10 · ~6 sessions",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "title": "Level 5 · Weeks 10–11 · Async and modern JavaScript",
      "blocks": [
        {
          "kind": "text",
          "text": "JavaScript runs your code on a single thread, yet somehow handles network requests, timers and clicks without freezing. This level explains the machinery that makes that possible, and the syntax you use to work with it."
        }
      ]
    },
    {
      "kind": "text",
      "text": "Some work takes time: fetching data, reading a file, waiting five seconds. JavaScript has **one** thread for your code, so it cannot sit and wait — if it did, the whole page would freeze. Instead it hands the slow job to the environment (browser or Node), carries on, and runs your callback when the job reports back."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Level 1: callbacks"
    },
    {
      "kind": "example",
      "code": "console.log(\"1 — first\");\n\nsetTimeout(() => {\n  console.log(\"3 — after the timer, even at 0ms\");\n}, 0);\n\nconsole.log(\"2 — second\");\n\n// Order: 1, 2, 3. The callback cannot run until the current code finishes.\n\n// Callbacks get ugly when steps depend on each other — \"callback hell\":\nfunction step(name, ms, next) {\n  setTimeout(() => { console.log(\"done:\", name); next && next(); }, ms);\n}\nstep(\"login\", 100, () => {\n  step(\"fetch profile\", 100, () => {\n    step(\"fetch settings\", 100, () => {\n      console.log(\"everything loaded (three levels deep, and no error handling)\");\n    });\n  });\n});",
      "label": "callbacks.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Level 2: promises"
    },
    {
      "kind": "text",
      "text": "A **promise** is an object representing a value that isn't ready yet. It sits in one of three states: *pending*, then either *fulfilled* (with a value) or *rejected* (with a reason). Once settled it never changes again."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A promise is a receipt. You order food and get the receipt straight away — not the food. Later that receipt turns into either your meal (fulfilled) or an apology (rejected). `await` means \"wait here holding the receipt until it turns into something\", and the rest of the restaurant keeps running while you wait."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "// Creating one: the executor gets resolve and reject\nfunction delay(ms, value) {\n  return new Promise((resolve, reject) => {\n    if (ms < 0) reject(new Error(\"Negative delay\"));\n    setTimeout(() => resolve(value), ms);\n  });\n}\n\n// Consuming: .then for success, .catch for failure, .finally for cleanup\ndelay(100, \"profile\")\n  .then(value => {\n    console.log(\"got:\", value);\n    return delay(100, \"settings\");     // returning a promise FLATTENS the chain\n  })\n  .then(value => console.log(\"got:\", value))\n  .catch(err => console.log(\"failed:\", err.message))   // catches ANY step above\n  .finally(() => console.log(\"chain finished\"));\n\n// Combinators — the reason promises beat callbacks\nconst jobs = [delay(50, \"a\"), delay(80, \"b\"), delay(20, \"c\")];\n\nPromise.all(jobs).then(v => console.log(\"all:\", v));\n// all -> waits for every one; rejects immediately if ANY rejects\n\nPromise.allSettled([delay(10, \"ok\"), Promise.reject(new Error(\"nope\"))])\n  .then(results => console.log(\"allSettled:\", results.map(r => r.status)));\n// allSettled -> never rejects; reports every outcome\n\nPromise.race([delay(30, \"fast\"), delay(300, \"slow\")])\n  .then(v => console.log(\"race winner:\", v));\n// race -> first to SETTLE, win or lose.  any -> first to FULFILL.",
      "label": "promises.js"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Level 3: async / await"
    },
    {
      "kind": "text",
      "text": "Same promises, readable syntax. `async` marks a function as always returning a promise; `await` pauses *inside* that function until a promise settles, without blocking anything else on the page."
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 660 240\" role=\"img\" aria-label=\"Two awaits in sequence take 200ms; the same two started together with Promise.all take 100ms\">\n  <defs><marker id=\"arA\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"></path></marker></defs>\n  <text class=\"lbl\" x=\"16\" y=\"28\">await A; await B;</text>\n  <rect class=\"bad\" x=\"120\" y=\"40\" width=\"200\" height=\"28\" rx=\"4\"></rect><text x=\"220\" y=\"59\" text-anchor=\"middle\">request A · 100ms</text>\n  <rect class=\"bad\" x=\"320\" y=\"40\" width=\"200\" height=\"28\" rx=\"4\"></rect><text x=\"420\" y=\"59\" text-anchor=\"middle\">request B · 100ms</text>\n  <text class=\"mut\" x=\"530\" y=\"59\">total 200ms</text>\n  <text class=\"mut\" x=\"120\" y=\"86\">B has not even started until A comes back</text>\n  <text class=\"lbl\" x=\"16\" y=\"128\">await Promise.all([A, B])</text>\n  <rect class=\"ok\" x=\"120\" y=\"140\" width=\"200\" height=\"28\" rx=\"4\"></rect><text x=\"220\" y=\"159\" text-anchor=\"middle\">request A · 100ms</text>\n  <rect class=\"ok\" x=\"120\" y=\"174\" width=\"200\" height=\"28\" rx=\"4\"></rect><text x=\"220\" y=\"193\" text-anchor=\"middle\">request B · 100ms</text>\n  <text class=\"mut\" x=\"340\" y=\"159\">both start immediately</text>\n  <text class=\"mut\" x=\"340\" y=\"193\">total 100ms</text>\n  <line class=\"faint dash\" x1=\"120\" y1=\"36\" x2=\"120\" y2=\"212\"></line>\n  <line class=\"faint dash\" x1=\"320\" y1=\"36\" x2=\"320\" y2=\"212\"></line>\n  <line class=\"ln\" x1=\"120\" y1=\"222\" x2=\"560\" y2=\"222\" marker-end=\"url(#arA)\"></line>\n  <text class=\"mut\" x=\"112\" y=\"238\">0ms</text>\n  <text class=\"mut\" x=\"306\" y=\"238\">100ms</text>\n  <text class=\"mut\" x=\"506\" y=\"238\">200ms</text>\n  <rect class=\"mv mv-fillA fillbar\" x=\"120\" y=\"40\" width=\"200\" height=\"28\" rx=\"4\"></rect>\n  <rect class=\"mv mv-fillB fillbar\" x=\"320\" y=\"40\" width=\"200\" height=\"28\" rx=\"4\"></rect>\n  <rect class=\"mv mv-fillBoth fillbar\" x=\"120\" y=\"140\" width=\"200\" height=\"28\" rx=\"4\"></rect>\n  <rect class=\"mv mv-fillBoth fillbar\" x=\"120\" y=\"174\" width=\"200\" height=\"28\" rx=\"4\"></rect>\n</svg>",
      "caption": "**Sequential `await` is only correct when the second call needs the first one's result.** When they're independent, starting them together and awaiting both is free speed — and forgetting to is one of the most common review comments on real pull requests.",
      "animated": true
    },
    {
      "kind": "example",
      "code": "function delay(ms, value) {\n  return new Promise(res => setTimeout(() => res(value), ms));\n}\n\nasync function loadDashboard() {\n  try {\n    const user = await delay(100, { id: 1, name: \"Arpit\" });\n    console.log(\"user:\", user.name);\n\n    // SEQUENTIAL — 200ms total. Correct only if the second needs the first.\n    const posts = await delay(100, [\"post-a\", \"post-b\"]);\n    console.log(\"posts:\", posts.length);\n\n    // PARALLEL — 100ms total. Start both, then await both.\n    const [likes, followers] = await Promise.all([\n      delay(100, 42),\n      delay(100, 128),\n    ]);\n    console.log(\"likes:\", likes, \"followers:\", followers);\n\n    return \"dashboard ready\";\n  } catch (err) {\n    console.log(\"something failed:\", err.message);\n    throw err;                       // re-throw if the caller must know\n  } finally {\n    console.log(\"hiding the spinner\");\n  }\n}\n\n// An async function ALWAYS returns a promise:\nloadDashboard().then(result => console.log(result));\nconsole.log(\"this line runs BEFORE the dashboard finishes\");",
      "label": "async-await.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`for (const id of ids) { await fetchUser(id); }` runs requests one after another — ten requests at 200 ms each takes two seconds. If they're independent, start them all and await together: `await Promise.all(ids.map(id => fetchUser(id)))` — 200 ms. Sequential `await` is right only when each step genuinely needs the previous result. And note that `array.forEach(async ...)` does *not* wait at all: `forEach` ignores the returned promises."
        }
      ],
      "title": "Trap · Awaiting in a loop"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The event loop, call stack and queues"
    },
    {
      "kind": "text",
      "text": "The model in five parts:"
    },
    {
      "kind": "list",
      "ordered": false,
      "items": [
        "**Call stack** — where function calls pile up while running. One stack, one thread.",
        "**Web APIs / host** — timers, network, DOM events. These run *outside* your thread.",
        "**Macrotask queue** — finished `setTimeout`, `setInterval`, I/O and event callbacks queue here.",
        "**Microtask queue** — promise callbacks (`.then`, the code after `await`) and `queueMicrotask`. Higher priority.",
        "**Event loop** — when the stack is empty, it drains the *entire* microtask queue, then takes *one* macrotask, then repeats (rendering in between, in a browser)."
      ]
    },
    {
      "kind": "text",
      "text": "That priority rule — all microtasks before the next macrotask — is what the classic ordering puzzle tests."
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Picture one cook with one counter. The cook can only work on what's on the counter, and never walks away mid-dish. Slow orders — a timer, a network request — go to machines at the back, and the cook carries on. When a machine dings, that dish joins a queue; it does *not* interrupt. Only once the counter is completely clear does the cook look at the queues: first the express queue (promises) — *all* of it — and then one single item from the normal queue (timers, clicks). Then round again."
        }
      ],
      "title": "In plain words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 760 495\" role=\"img\" aria-label=\"The event loop: the call stack hands slow work to the host, finished callbacks join two queues, and the loop drains every microtask before taking one macrotask\">\n  <defs><marker id=\"arL\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"currentColor\"></path></marker></defs>\n  <text class=\"lbl\" x=\"40\" y=\"34\">Call stack</text>\n  <rect class=\"box\" x=\"40\" y=\"46\" width=\"240\" height=\"130\" rx=\"6\"></rect>\n  <text class=\"mut\" x=\"160\" y=\"68\" text-anchor=\"middle\">one thread — your code</text>\n  <rect class=\"acc\" x=\"62\" y=\"80\" width=\"196\" height=\"22\" rx=\"3\"></rect><text class=\"accT\" x=\"160\" y=\"96\" text-anchor=\"middle\">parse()</text>\n  <rect class=\"box\" x=\"62\" y=\"106\" width=\"196\" height=\"22\" rx=\"3\"></rect><text x=\"160\" y=\"122\" text-anchor=\"middle\">loadUser()</text>\n  <rect class=\"box\" x=\"62\" y=\"132\" width=\"196\" height=\"22\" rx=\"3\"></rect><text x=\"160\" y=\"148\" text-anchor=\"middle\">main()</text>\n  <text class=\"mut\" x=\"160\" y=\"170\" text-anchor=\"middle\">top frame runs to completion</text>\n  <text class=\"lbl\" x=\"440\" y=\"34\">Host / Web APIs</text>\n  <rect class=\"box\" x=\"440\" y=\"46\" width=\"280\" height=\"130\" rx=\"6\"></rect>\n  <text class=\"mut\" x=\"580\" y=\"88\" text-anchor=\"middle\">timers · fetch · DOM events</text>\n  <text class=\"mut\" x=\"580\" y=\"112\" text-anchor=\"middle\">these wait off your thread</text>\n  <text class=\"mut\" x=\"580\" y=\"142\" text-anchor=\"middle\">nothing here blocks your code</text>\n  <line class=\"ln\" x1=\"286\" y1=\"104\" x2=\"434\" y2=\"104\" marker-end=\"url(#arL)\"></line>\n  <text class=\"mut\" x=\"360\" y=\"96\" text-anchor=\"middle\">hands off slow work</text>\n  <rect class=\"acc\" x=\"40\" y=\"240\" width=\"280\" height=\"76\" rx=\"6\"></rect>\n  <text class=\"lbl accT\" x=\"58\" y=\"266\">Microtask queue</text>\n  <text class=\"mut\" x=\"58\" y=\"288\">.then() · await resumption</text>\n  <text class=\"mut\" x=\"58\" y=\"306\">queueMicrotask</text>\n  <rect class=\"box\" x=\"440\" y=\"240\" width=\"280\" height=\"76\" rx=\"6\"></rect>\n  <text class=\"lbl\" x=\"458\" y=\"266\">Macrotask queue</text>\n  <text class=\"mut\" x=\"458\" y=\"288\">setTimeout · setInterval</text>\n  <text class=\"mut\" x=\"458\" y=\"306\">click handlers · I/O</text>\n  <line class=\"ln\" x1=\"160\" y1=\"180\" x2=\"160\" y2=\"236\" marker-end=\"url(#arL)\"></line>\n  <text class=\"mut\" x=\"170\" y=\"212\">a promise settles</text>\n  <line class=\"ln\" x1=\"580\" y1=\"180\" x2=\"580\" y2=\"236\" marker-end=\"url(#arL)\"></line>\n  <text class=\"mut\" x=\"590\" y=\"212\">the work finishes</text>\n  <rect class=\"box\" x=\"280\" y=\"376\" width=\"200\" height=\"64\" rx=\"6\"></rect>\n  <text class=\"lbl\" x=\"380\" y=\"402\" text-anchor=\"middle\">Event loop</text>\n  <text class=\"mut\" x=\"380\" y=\"422\" text-anchor=\"middle\">runs when the stack is empty</text>\n  <path class=\"lnA\" d=\"M180 320 C 204 352, 248 368, 274 384\" marker-end=\"url(#arL)\"></path>\n  <text class=\"accT\" x=\"112\" y=\"358\">1 · drain ALL</text>\n  <path class=\"ln\" d=\"M580 320 C 556 352, 512 368, 486 384\" marker-end=\"url(#arL)\"></path>\n  <text class=\"mut\" x=\"596\" y=\"352\">2 · then exactly ONE</text>\n  <path class=\"lnA\" d=\"M276 408 L20 408 L20 104 L34 104\" marker-end=\"url(#arL)\"></path>\n  <text class=\"accT\" x=\"30\" y=\"432\">next callback → onto the stack</text>\n  <text class=\"mut\" x=\"40\" y=\"466\">Every microtask runs before the next macrotask — which is why a promise callback</text>\n  <text class=\"mut\" x=\"40\" y=\"484\">always beats setTimeout(fn, 0). A long synchronous frame blocks all of it, rendering included.</text>\n  <circle class=\"mv mv-loopGrey dot\" cx=\"286\" cy=\"104\" r=\"5\"></circle>\n  <circle class=\"mv mv-loopGold dotA\" cx=\"170\" cy=\"316\" r=\"5\"></circle>\n</svg>",
      "caption": "**One cook, one counter, two queues.** Your code runs to completion on the stack; slow work waits elsewhere. When the stack empties, the loop clears the *entire* microtask queue, then takes a single macrotask — and that priority rule is the answer to every output-ordering puzzle in interviews.",
      "animated": true
    },
    {
      "kind": "example",
      "code": "console.log(\"1 sync\");\n\nsetTimeout(() => console.log(\"2 timeout (macrotask)\"), 0);\n\nPromise.resolve().then(() => console.log(\"3 promise (microtask)\"));\n\nqueueMicrotask(() => console.log(\"4 queueMicrotask\"));\n\n(async () => {\n  console.log(\"5 sync inside async — runs immediately\");\n  await null;                          // everything after await is a microtask\n  console.log(\"6 after await (microtask)\");\n})();\n\nconsole.log(\"7 sync\");\n\n// Predict the order before you run it.\n// Answer: 1, 5, 7, 3, 4, 6, 2\n//   sync first (1, 5, 7), then ALL microtasks in queue order (3, 4, 6),\n//   then the first macrotask (2).",
      "label": "event-loop.js"
    },
    {
      "kind": "quiz",
      "question": "A `setTimeout(fn, 0)` and a `Promise.resolve().then(fn2)` are scheduled in that order. Which callback runs first?",
      "options": [
        "The setTimeout — it was scheduled first",
        "The promise callback",
        "Whichever the engine picks; it's non-deterministic",
        "They run at the same time on different threads"
      ],
      "answer": 1,
      "why": "**The promise callback.** Microtasks are drained completely before the event loop takes even one macrotask, regardless of scheduling order. A corollary worth knowing: an endlessly self-queueing microtask starves the macrotask queue and freezes the page — the loop never gets to render."
    },
    {
      "kind": "reveal",
      "tag": "Challenge 14.1",
      "title": "Retry with exponential backoff",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `retry(fn, attempts, baseDelay)` that calls an async `fn`, and on rejection waits and retries — doubling the wait each time — until attempts run out, then rejects with the last error. This is real production code and a common take-home question."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "const sleep = ms => new Promise(res => setTimeout(res, ms));\n\nasync function retry(fn, attempts = 3, baseDelay = 100) {\n  let lastError;\n\n  for (let attempt = 1; attempt <= attempts; attempt++) {\n    try {\n      return await fn(attempt);          // success: leave immediately\n    } catch (err) {\n      lastError = err;\n      if (attempt === attempts) break;   // no delay after the final failure\n      const wait = baseDelay * 2 ** (attempt - 1);   // 100, 200, 400…\n      console.log(`attempt ${attempt} failed (${err.message}) — retrying in ${wait}ms`);\n      await sleep(wait);\n    }\n  }\n  throw new Error(`All ${attempts} attempts failed: ${lastError.message}`);\n}\n\n// A function that fails twice, then succeeds\nlet calls = 0;\nconst flaky = async () => {\n  calls++;\n  if (calls < 3) throw new Error(\"network hiccup\");\n  return `succeeded on call ${calls}`;\n};\n\nretry(flaky, 4, 50)\n  .then(console.log)\n  .catch(err => console.log(\"gave up:\", err.message));",
              "label": "solution-14-1.js"
            },
            {
              "kind": "text",
              "text": "Extras that impress in a review: add jitter (a small random offset) so many clients don't retry in lockstep; only retry idempotent operations; and don't retry 4xx responses — a 404 will still be a 404 in 400 ms.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Challenge 14.2",
      "title": "Promisify a callback API",
      "blocks": [
        {
          "kind": "text",
          "text": "Old Node-style APIs take a callback of the form `(error, result)`. Write `promisify(fn)` that converts such a function into one returning a promise."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "function promisify(fn) {\n  return function (...args) {\n    return new Promise((resolve, reject) => {\n      // append our own callback as the last argument\n      fn.call(this, ...args, (error, result) => {\n        if (error) reject(error);\n        else resolve(result);\n      });\n    });\n  };\n}\n\n// An old-style API:\nfunction readUser(id, callback) {\n  setTimeout(() => {\n    if (id <= 0) return callback(new Error(\"Bad id\"));\n    callback(null, { id, name: \"Arpit\" });\n  }, 50);\n}\n\nconst readUserAsync = promisify(readUser);\n\n(async () => {\n  console.log(await readUserAsync(7));\n  try { await readUserAsync(-1); }\n  catch (e) { console.log(\"rejected with:\", e.message); }\n})();",
              "label": "solution-14-2.js"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q14",
      "title": "Explain the event loop, microtasks and macrotasks",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** JavaScript executes on a single thread with one call stack. Asynchronous work is handed to the host environment; when it completes, a callback is queued rather than run immediately. The event loop's job is: if the call stack is empty, first drain the entire *microtask* queue (promise reactions, `queueMicrotask`, `MutationObserver`), then take exactly one *macrotask* (timers, I/O, UI events), then — in a browser — allow rendering, and repeat."
        },
        {
          "kind": "text",
          "text": "Consequences worth stating: promise callbacks always beat `setTimeout(…, 0)`; `setTimeout` guarantees a *minimum* delay, not an exact one, and is clamped to ~4 ms after five nested timers; long synchronous work blocks everything including rendering; and a microtask that queues another microtask forever will starve the loop entirely."
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q15",
      "title": "What are the promise combinators and when do you use each?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `Promise.all` — resolves with an array of all values, rejects as soon as any input rejects (fail fast; use when you need everything). `Promise.allSettled` — never rejects, resolves with `{status, value|reason}` for each (use when partial success is acceptable, like a dashboard of independent widgets). `Promise.race` — settles with the first promise to settle either way (use for timeouts: race the real work against a rejecting timer). `Promise.any` — resolves with the first *fulfilment*, rejecting only if all fail, with an `AggregateError` (use for redundant mirrors or endpoints)."
        }
      ]
    }
  ]
};
