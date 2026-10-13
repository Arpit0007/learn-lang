import { Lesson } from '../../shared/content';

export const M23_DATES: Lesson = {
  "slug": "m23-dates",
  "title": "M23 Dates, times and formatting",
  "nav": "Dates & Intl",
  "num": "M23",
  "eyebrow": "Level 7 · read after Module 4 (Week 5) · ~2 sessions",
  "blocks": [
    {
      "kind": "text",
      "text": "Dates are where confident developers quietly lose afternoons. The built-in `Date` is a 1995 design with genuinely surprising behaviour, and almost every bug comes from the same root: confusing a *moment in time* with a *calendar date shown in some timezone*."
    },
    {
      "kind": "example",
      "code": "const now = new Date();\nconsole.log(now.toISOString());        // always UTC — the format to STORE\nconsole.log(now.getFullYear(), now.getMonth(), now.getDate());\n\n// TRAP 1: months are 0-indexed. Days of the month are not. Neither are years.\nconst march14 = new Date(2026, 2, 14);          // 2 = March\nconsole.log(march14.toDateString());\n\n// TRAP 2: parsing. \"YYYY-MM-DD\" is treated as UTC;\n// \"YYYY/MM/DD\" and other formats are treated as LOCAL time.\nconsole.log(new Date(\"2026-03-14\").toISOString());\nconsole.log(new Date(\"2026/03/14\").toString().slice(0, 24));\n// If your date \"shifts by one day\" for some users, this is why.\n\n// TRAP 3: a Date is a single instant (milliseconds since 1970 UTC).\nconsole.log(Date.now());                        // number, good for timing\nconsole.log(+new Date(\"2026-03-14\"));           // unary + gives the same number\n\n// Arithmetic: work in milliseconds, or use setDate which handles rollover\nconst DAY = 24 * 60 * 60 * 1000;\nconst later = new Date(march14.getTime() + 10 * DAY);\nconsole.log(later.toDateString());              // rolls into the next month safely\n\nconst diffDays = (a, b) => Math.round((b - a) / DAY);\nconsole.log(\"days between:\", diffDays(new Date(2026, 0, 1), new Date(2026, 11, 25)));\n\n// Comparison works because Dates coerce to numbers:\nconsole.log(new Date(2026, 0, 1) < new Date(2026, 5, 1));\n// ...but equality does NOT — two Dates are different objects:\nconsole.log(new Date(0) === new Date(0), +new Date(0) === +new Date(0));",
      "label": "dates.js"
    },
    {
      "kind": "example",
      "code": "const when = new Date(\"2026-03-14T09:30:00Z\");\n\n// Never hand-build \"14/03/2026\" — Intl knows every locale's conventions\nconsole.log(new Intl.DateTimeFormat(\"en-IN\", {\n  dateStyle: \"full\", timeStyle: \"short\", timeZone: \"Asia/Kolkata\",\n}).format(when));\n\nconsole.log(new Intl.DateTimeFormat(\"en-US\", { dateStyle: \"medium\" }).format(when));\nconsole.log(when.toLocaleString(\"en-IN\", { timeZone: \"Asia/Kolkata\" }));\n\n// \"3 days ago\" without a library\nconst rtf = new Intl.RelativeTimeFormat(\"en\", { numeric: \"auto\" });\nconsole.log(rtf.format(-3, \"day\"), \"·\", rtf.format(2, \"hour\"), \"·\", rtf.format(-1, \"week\"));\n\nfunction timeAgo(date, from = new Date()) {\n  const seconds = Math.round((date - from) / 1000);\n  const units = [[\"year\", 31536000], [\"month\", 2592000], [\"day\", 86400],\n                 [\"hour\", 3600], [\"minute\", 60], [\"second\", 1]];\n  for (const [unit, size] of units) {\n    if (Math.abs(seconds) >= size || unit === \"second\") {\n      return rtf.format(Math.round(seconds / size), unit);\n    }\n  }\n}\nconsole.log(timeAgo(new Date(Date.now() - 5 * 60 * 1000)));\nconsole.log(timeAgo(new Date(Date.now() + 36 * 60 * 60 * 1000)));\n\n// Numbers, currency and lists get the same treatment\nconsole.log(new Intl.NumberFormat(\"en-IN\", { style: \"currency\", currency: \"INR\" }).format(1234567.5));\nconsole.log(new Intl.NumberFormat(\"en\", { notation: \"compact\" }).format(1234567));\nconsole.log(new Intl.ListFormat(\"en\", { type: \"conjunction\" }).format([\"JS\", \"CSS\", \"HTML\"]));",
      "label": "intl.js"
    },
    {
      "kind": "callout",
      "tone": "key",
      "blocks": [
        {
          "kind": "text",
          "text": "**1. Store UTC** — an ISO string or an epoch number — and convert only when displaying. **2. Format with `Intl`**, passing an explicit `timeZone` whenever the answer must be a particular place rather than the viewer's. **3. Never do calendar maths by adding milliseconds** across daylight-saving boundaries; use `setDate`/`setMonth`, or a library. Watch for `Temporal`, the modern replacement API now landing in browsers — it fixes this whole category, and being able to name it in an interview is a small, cheap signal."
        }
      ],
      "title": "The three rules that prevent every date bug"
    },
    {
      "kind": "reveal",
      "tag": "Exercise 23.1",
      "title": "A tiny date toolkit",
      "blocks": [
        {
          "kind": "text",
          "text": "Write `addDays(date, n)`, `isSameDay(a, b)`, `startOfMonth(date)` and `ageInYears(birthDate)` — the last one must be correct for someone whose birthday hasn't happened yet this year."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "// Copy first — never mutate a Date you were handed\nconst addDays = (date, n) => {\n  const copy = new Date(date);\n  copy.setDate(copy.getDate() + n);   // handles month and year rollover\n  return copy;\n};\n\nconst isSameDay = (a, b) =>\n  a.getFullYear() === b.getFullYear() &&\n  a.getMonth() === b.getMonth() &&\n  a.getDate() === b.getDate();\n\nconst startOfMonth = date => new Date(date.getFullYear(), date.getMonth(), 1);\n\nfunction ageInYears(birth, today = new Date()) {\n  let age = today.getFullYear() - birth.getFullYear();\n  const monthDiff = today.getMonth() - birth.getMonth();\n  // Not had the birthday yet this year? Subtract one.\n  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;\n  return age;\n}\n\nconst base = new Date(2026, 0, 30);            // 30 Jan\nconsole.log(addDays(base, 3).toDateString());  // rolls into February\nconsole.log(isSameDay(base, new Date(2026, 0, 30, 23, 59)));\nconsole.log(startOfMonth(base).toDateString());\nconsole.log(ageInYears(new Date(1996, 11, 25), new Date(2026, 5, 1)));",
              "label": "solution-23-1.js"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q50",
      "title": "How do you handle timezones in a web app?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Store every instant in UTC — an ISO-8601 string or epoch milliseconds — and treat the timezone as a presentation concern. Convert at the edges with `Intl.DateTimeFormat`, passing an explicit IANA zone (`\"Asia/Kolkata\"`) when the correct answer is a specific place, such as a store's opening hours, rather than the viewer's own clock."
        },
        {
          "kind": "text",
          "text": "Distinguish an *instant* (a meeting at 09:30 UTC) from a *calendar date* (a birthday, a holiday) — the second has no time zone and should be stored as a plain `YYYY-MM-DD` string, because turning it into a `Date` is what produces off-by-one-day bugs. Also mention DST: never add 24 hours in milliseconds to move a day, and never assume offsets are whole hours. `Temporal` is the standard API designed to make all of this explicit."
        }
      ]
    }
  ]
};
