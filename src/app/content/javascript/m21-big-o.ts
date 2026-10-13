import { Lesson } from '../../shared/content';

export const M21_BIG_O: Lesson = {
  "slug": "m21-big-o",
  "title": "M21 Big-O and the patterns interviews test",
  "nav": "Big-O & algorithms",
  "num": "M21",
  "eyebrow": "Level 7 · read in Week 12–13 · ~3 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Big-O describes how work grows as input grows — not seconds, but shape. You need it for two reasons: interviews ask directly, and it's the difference between code that's fine at 100 rows and code that hangs at 100,000."
    },
    {
      "kind": "table",
      "head": [
        "Notation",
        "Name",
        "Steps at n = 1,000",
        "Typical example"
      ],
      "rows": [
        [
          "`O(1)`",
          "Constant",
          "1",
          "`arr[i]`, `map.get(k)`, `obj.key`, `push`, `pop`"
        ],
        [
          "`O(log n)`",
          "Logarithmic",
          "~10",
          "Binary search on sorted data"
        ],
        [
          "`O(n)`",
          "Linear",
          "1,000",
          "`map`, `filter`, `includes`, `indexOf`, one loop"
        ],
        [
          "`O(n log n)`",
          "Linearithmic",
          "~10,000",
          "`sort()` — the practical floor for comparison sorting"
        ],
        [
          "`O(n²)`",
          "Quadratic",
          "1,000,000",
          "Nested loops; `includes` *inside* a loop"
        ],
        [
          "`O(2ⁿ)`",
          "Exponential",
          "unusable",
          "Naive recursive Fibonacci, brute-force subsets"
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Big-O isn't \"how many seconds\". It's \"what happens when the list gets ten times bigger\". If the work also gets ten times bigger, that's `O(n)` and you're fine. If it gets a *hundred* times bigger, that's `O(n²)` — and one day it will freeze somebody's browser."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "example",
      "code": "const n = 4000;\nconst list = Array.from({ length: n }, (_, i) => i);\nconst lookups = list.slice(0, 2000);\n\n// O(n²): includes() scans the whole array on EVERY iteration\nconsole.time(\"array includes  O(n^2)\");\nlet hitsA = 0;\nfor (const value of lookups) if (list.includes(value)) hitsA++;\nconsole.timeEnd(\"array includes  O(n^2)\");\n\n// O(n): build a Set once (O(n)), then each lookup is O(1)\nconsole.time(\"set has         O(n)\");\nconst set = new Set(list);\nlet hitsB = 0;\nfor (const value of lookups) if (set.has(value)) hitsB++;\nconsole.timeEnd(\"set has         O(n)\");\n\nconsole.log(hitsA === hitsB, \"same answer, very different cost\");\nconsole.log(\"Raise n to 40,000 and the first one becomes unusable while the second barely moves.\");",
      "label": "complexity.js"
    },
    {
      "kind": "text",
      "text": "**The one heuristic that covers most cases:** a loop inside a loop over the same data is `O(n²)`, and hidden loops count — `includes`, `indexOf`, `find` and `filter` inside a loop are all quietly quadratic. The fix is almost always the same: *trade memory for time* by building a `Set` or `Map` first."
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "Three patterns that solve most interview problems"
    },
    {
      "kind": "example",
      "code": "// PATTERN 1 — Frequency counter: replace nested comparison with a map.\nfunction isAnagram(a, b) {\n  if (a.length !== b.length) return false;\n  const counts = new Map();\n  for (const ch of a) counts.set(ch, (counts.get(ch) ?? 0) + 1);\n  for (const ch of b) {\n    if (!counts.get(ch)) return false;\n    counts.set(ch, counts.get(ch) - 1);\n  }\n  return true;\n}\nconsole.log(isAnagram(\"listen\", \"silent\"), isAnagram(\"hello\", \"world\"));\n\n// The same idea solves Two Sum in O(n) instead of O(n^2):\nfunction twoSum(nums, target) {\n  const seen = new Map();                 // value -> index\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return null;\n}\nconsole.log(twoSum([2, 7, 11, 15], 26));\n\n// PATTERN 2 — Two pointers: one pass from both ends of SORTED data.\nfunction isPalindrome(text) {\n  const s = text.toLowerCase().replace(/[^a-z0-9]/g, \"\");\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    if (s[left] !== s[right]) return false;\n    left++; right--;\n  }\n  return true;\n}\nconsole.log(isPalindrome(\"A man, a plan, a canal: Panama\"), isPalindrome(\"ladder\"));\n\n// PATTERN 3 — Sliding window: a moving range instead of re-scanning.\nfunction longestUniqueSubstring(s) {\n  const lastSeen = new Map();\n  let start = 0, best = 0, bestStr = \"\";\n  for (let end = 0; end < s.length; end++) {\n    const ch = s[end];\n    if (lastSeen.has(ch) && lastSeen.get(ch) >= start) start = lastSeen.get(ch) + 1;\n    lastSeen.set(ch, end);\n    if (end - start + 1 > best) { best = end - start + 1; bestStr = s.slice(start, end + 1); }\n  }\n  return { length: best, substring: bestStr };\n}\nconsole.log(longestUniqueSubstring(\"abcabcbb\"), longestUniqueSubstring(\"javascript\"));",
      "label": "patterns-algo.js"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "State it without being asked: \"this is `O(n)` time and `O(n)` space because of the map.\" Say the brute-force answer first, give its complexity, then improve it — showing the path is worth more than jumping to the optimal solution silently. And mention space, not just time; candidates who only discuss time look half-trained."
        }
      ],
      "title": "How to talk about complexity in an interview"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 21.1",
      "title": "Complexity call",
      "blocks": [
        {
          "kind": "text",
          "text": "Give the time complexity of each, then check."
        },
        {
          "kind": "list",
          "ordered": true,
          "items": [
            "`arr.map(x => x * 2).filter(x => x > 10)`",
            "`arr.forEach(a => arr.forEach(b => compare(a, b)))`",
            "`[...new Set(arr)]`",
            "`arr.sort((a, b) => a - b)[0]`",
            "`ids.filter(id => bigArray.includes(id))`"
          ]
        },
        {
          "kind": "reveal",
          "tag": "Answers",
          "title": "Show me",
          "blocks": [
            {
              "kind": "list",
              "ordered": true,
              "items": [
                "`O(n)` — two separate passes is still linear; constants don't count.",
                "`O(n²)` — the classic nested scan.",
                "`O(n)` — Set construction and spreading are each linear.",
                "`O(n log n)` — and it's the wrong tool: finding a minimum is `O(n)` with `Math.min(...arr)` or a single loop. Sorting to get one element is a common review comment.",
                "`O(n × m)` — the quadratic trap. Build `new Set(bigArray)` once and it drops to `O(n + m)`."
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q48",
      "title": "What's the complexity of the array methods you use daily?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** `push`/`pop` are amortised `O(1)`; `shift`/`unshift` are `O(n)` because every remaining element is re-indexed — which is why a queue built on `shift` degrades badly. `map`, `filter`, `forEach`, `reduce`, `includes`, `indexOf`, `find` and `join` are `O(n)`. `slice` is `O(k)` for the copied section; `splice` is `O(n)`. `sort` is `O(n log n)` — V8 uses TimSort, which is stable. `concat` and spread copy, so they're `O(n)`, which makes `reduce((acc, x) => [...acc, x], [])` accidentally `O(n²)`."
        },
        {
          "kind": "text",
          "text": "Set and Map lookups, insertions and deletions are effectively `O(1)`, which is why converting an array to a Set before repeated membership checks is the standard optimisation."
        }
      ]
    }
  ]
};
