import { Lesson } from '../../shared/content';

export const M15_FETCH: Lesson = {
  "slug": "m15-fetch",
  "title": "M15 APIs, `fetch` and error handling",
  "nav": "APIs & errors",
  "num": "M15",
  "eyebrow": "Level 5 · Week 11 · ~3 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "An **API** here means an HTTP endpoint that returns data, usually JSON. `fetch` is the built-in way to call one. It returns a promise for a `Response` object; getting the data out is a second async step."
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "The `fetch` examples below are marked read-only, because they call real servers on the internet. Copy them into your own project to run them — the simulated version further down is runnable so you can practise the promise handling."
        }
      ],
      "title": "Note"
    },
    {
      "kind": "example",
      "code": "async function getUser(username) {\n  const response = await fetch(`https://api.github.com/users/${username}`);\n\n  // CRITICAL: fetch does NOT reject on 404 or 500. Only on network failure.\n  // You must check `ok` yourself.\n  if (!response.ok) {\n    throw new Error(`HTTP ${response.status} — ${response.statusText}`);\n  }\n\n  const data = await response.json();     // parsing the body is also async\n  return { name: data.name, repos: data.public_repos };\n}\n\n// Sending data\nasync function createPost(payload) {\n  const response = await fetch(\"https://api.example.com/posts\", {\n    method: \"POST\",\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify(payload),        // the body must be a string\n  });\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}\n\n// Timeouts and cancellation\nasync function getWithTimeout(url, ms = 5000) {\n  const controller = new AbortController();\n  const timer = setTimeout(() => controller.abort(), ms);\n  try {\n    const res = await fetch(url, { signal: controller.signal });\n    return await res.json();\n  } catch (err) {\n    if (err.name === \"AbortError\") throw new Error(`Timed out after ${ms}ms`);\n    throw err;\n  } finally {\n    clearTimeout(timer);\n  }\n}",
      "label": "fetch.js",
      "run": "none"
    },
    {
      "kind": "example",
      "code": "// A simulated API so you can practise the shape without a network.\nfunction fakeFetch(url) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (url.includes(\"missing\")) resolve({ ok: false, status: 404 });\n      else if (url.includes(\"offline\")) reject(new TypeError(\"Failed to fetch\"));\n      else resolve({ ok: true, status: 200, json: async () => ({ id: 1, name: \"Arpit\" }) });\n    }, 60);\n  });\n}\n\nasync function loadUser(url) {\n  try {\n    const res = await fakeFetch(url);\n    if (!res.ok) throw new Error(`Request failed with ${res.status}`);\n    const data = await res.json();\n    return { ok: true, data };\n  } catch (err) {\n    // Distinguish \"the server said no\" from \"we never reached the server\"\n    const kind = err instanceof TypeError ? \"network\" : \"http\";\n    console.log(`[${kind}] ${err.message}`);\n    return { ok: false, error: err.message };\n  }\n}\n\n(async () => {\n  console.log(await loadUser(\"/api/user/1\"));\n  console.log(await loadUser(\"/api/missing\"));\n  console.log(await loadUser(\"/api/offline\"));\n})();",
      "label": "api-pattern.js"
    },
    {
      "kind": "example",
      "code": "// try / catch / finally, and throwing your own errors\nclass HttpError extends Error {\n  constructor(status, message) {\n    super(message);\n    this.name = \"HttpError\";\n    this.status = status;\n  }\n}\n\nfunction parseConfig(text) {\n  try {\n    const config = JSON.parse(text);\n    if (!config.apiKey) throw new HttpError(400, \"apiKey is required\");\n    return config;\n  } catch (err) {\n    if (err instanceof SyntaxError) {\n      // Add context, keep the original as the cause (ES2022)\n      throw new Error(\"Config is not valid JSON\", { cause: err });\n    }\n    throw err;                 // not ours to handle — let it through\n  } finally {\n    console.log(\"parse attempt finished\");   // runs on success AND failure\n  }\n}\n\nconsole.log(parseConfig('{\"apiKey\":\"abc\"}'));\n\nfor (const bad of [\"{oops}\", '{\"noKey\":1}']) {\n  try {\n    parseConfig(bad);\n  } catch (err) {\n    console.log(`${err.name}: ${err.message}`, err.cause ? `(cause: ${err.cause.name})` : \"\");\n  }\n}\n\n// An unhandled rejection is a silent failure — always catch, somewhere:\n// window.addEventListener(\"unhandledrejection\", e => report(e.reason));",
      "label": "errors.js"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "**1.** Assuming `fetch` rejects on a 404 — it doesn't; check `response.ok`. **2.** `catch (e) {}` — an empty catch turns a crash into a mystery. **3.** A `try/catch` around a promise you never `await` — the rejection escapes; the `catch` only sees synchronous throws. **4.** Catching everything at the top level and showing \"Something went wrong\" — catch where you can actually do something about it, and let the rest bubble."
        }
      ],
      "title": "Trap · Four error-handling mistakes"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 15.1",
      "title": "Fetch with a cache",
      "blocks": [
        {
          "kind": "text",
          "text": "Wrap `fakeFetch` in a function that caches successful responses by URL, and returns the cached value on repeat calls. Bonus: make concurrent calls for the same URL share one in-flight request rather than firing two."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "function fakeFetch(url) {\n  return new Promise(resolve => {\n    console.log(\"  …real request for\", url);\n    setTimeout(() => resolve({ ok: true, json: async () => ({ url, at: Date.now() }) }), 80);\n  });\n}\n\nconst inFlight = new Map();   // url -> the PROMISE, not the value\n\nfunction cachedFetch(url) {\n  if (inFlight.has(url)) {\n    console.log(\"  (reusing cached/in-flight promise for\", url + \")\");\n    return inFlight.get(url);\n  }\n\n  const promise = fakeFetch(url)\n    .then(res => res.json())\n    .catch(err => {\n      inFlight.delete(url);    // don't cache failures — allow a retry\n      throw err;\n    });\n\n  inFlight.set(url, promise);\n  return promise;\n}\n\n(async () => {\n  // Two concurrent calls -> ONE real request\n  const [a, b] = await Promise.all([cachedFetch(\"/api/x\"), cachedFetch(\"/api/x\")]);\n  console.log(a.url === b.url, a.at === b.at);   // true true — same result object\n\n  // A later call -> still cached\n  console.log(await cachedFetch(\"/api/x\"));\n})();",
              "label": "solution-15-1.js"
            },
            {
              "kind": "text",
              "text": "The key insight, and the reason this is asked: cache the *promise*, not the resolved value. Caching the value can't help calls that arrive while the first request is still in flight — which is exactly the stampede you're trying to prevent.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q16",
      "title": "How do you handle errors in async code?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** With `async/await`, `try/catch` works normally — but only around an `await`ed promise; an un-awaited promise's rejection escapes the block entirely. With raw promises, `.catch()` at the end of a chain handles rejections from every earlier step, and returning a value from `.catch` resumes the chain as a fulfilment."
        },
        {
          "kind": "text",
          "text": "Beyond the syntax: distinguish expected failures (a 404, a validation error) from bugs; use custom `Error` subclasses so callers can branch on type rather than parse messages; attach `{ cause }` when re-throwing so the original stack survives; catch at the layer that can actually recover; and install last-resort handlers — `window.onerror` plus `unhandledrejection` in the browser, `process.on('unhandledRejection')` in Node — to report what slipped through."
        }
      ]
    }
  ]
};
