import { Lesson } from '../../shared/content';

export const M20_JSON_CSV: Lesson = {
  "slug": "m20-json-csv",
  "title": "M20 JSON, CSV, and storing data",
  "nav": "JSON & CSV",
  "num": "M20",
  "eyebrow": "Level 3 · Week 10 · ~3 sessions · PCC ch.10 & ch.16",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "JSON is the normal way to save and share structured data. CSV is for simple tables."
        },
        {
          "kind": "text",
          "text": "Everything you read out of a CSV comes back as **text** — even numbers and `True`. Convert each column yourself."
        },
        {
          "kind": "text",
          "text": "JSON has no date and no set, so convert those before saving."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "**JSON** is the default interchange format: text, nested, and maps cleanly onto Python's dicts and lists. `json.dump`/`load` work on files; `dumps`/`loads` work on strings — the `s` is for string."
    },
    {
      "kind": "text",
      "text": "**CSV** is flat tabular text. Never parse it with `split(\",\")`: real CSV has quoted fields containing commas and newlines, and the `csv` module handles them. `DictReader` gives you dicts keyed by the header row, which beats remembering that column 4 is the email."
    },
    {
      "kind": "example",
      "code": "import csv, json\nfrom pathlib import Path\n\ntasks = [\n    {\"title\": \"learn dicts\", \"done\": True,  \"tags\": [\"py\"]},\n    {\"title\": \"learn json\",  \"done\": False, \"tags\": []},\n]\n\n# --- JSON round trip ---\np = Path(\"tasks.json\")\np.write_text(json.dumps(tasks, indent=2), encoding=\"utf-8\")\nloaded = json.loads(p.read_text(encoding=\"utf-8\"))\nprint(loaded[0][\"title\"], loaded == tasks)\n\n# JSON has no date, tuple or set type - convert at the boundary\nfrom datetime import date\nprint(json.dumps({\"when\": date(2026, 9, 9)}, default=str))\n\n# --- CSV with a header ---\nc = Path(\"tasks.csv\")\nwith open(c, \"w\", newline=\"\", encoding=\"utf-8\") as f:\n    writer = csv.DictWriter(f, fieldnames=[\"title\", \"done\"])\n    writer.writeheader()\n    for t in tasks:\n        writer.writerow({\"title\": t[\"title\"], \"done\": t[\"done\"]})\n\nwith open(c, newline=\"\", encoding=\"utf-8\") as f:\n    for row in csv.DictReader(f):\n        print(row[\"title\"], \"->\", row[\"done\"], type(row[\"done\"]).__name__)",
      "label": "storing.py",
      "output": "learn dicts True\n{\"when\": \"2026-09-09\"}\nlearn dicts -> True str\nlearn json -> False str"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Every value from a CSV reader is a `str` — the `True` above came back as the four-character string `\"True\"`, and `bool(\"False\")` is `True`, which is a genuinely nasty bug. Convert every column explicitly as you read it. Separately, always pass `newline=\"\"` when opening a file for the `csv` module: without it, on Windows you get a blank line between every row, because the module handles line endings itself and the file layer does it again."
        }
      ],
      "title": "Trap · CSV gives you strings, and `newline=\"\"` is not optional"
    },
    {
      "kind": "quiz",
      "question": "What happens to a Python `set` when you `json.dumps` it?",
      "options": [
        "It becomes a JSON array",
        "It becomes a JSON object with null values",
        "`TypeError: Object of type set is not JSON serializable`",
        "It is silently dropped"
      ],
      "answer": 2,
      "why": "**It raises.** JSON has six types — string, number, boolean, null, array, object — and no set, tuple-vs-list distinction, date or Decimal. Tuples happen to serialise as arrays, but sets, dates and Decimals raise unless you pass `default=` or convert first. Round-tripping is therefore lossy: a tuple goes out as an array and comes back a list. Convert deliberately at the boundary rather than discovering it later."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 20.1",
      "title": "CSV in, typed records out, JSON back",
      "blocks": [
        {
          "kind": "text",
          "text": "Read a CSV where every value arrives as a string, convert each column to its real type, skip rows that fail validation while reporting them, and write the clean records out as JSON."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "import csv, json\nfrom dataclasses import dataclass, asdict\nfrom datetime import date\nfrom pathlib import Path\n\n@dataclass\nclass Sale:\n    sku: str\n    qty: int\n    price: float\n    sold_on: date\n\ndef parse(row, line_no):\n    \"\"\"Raise ValueError with context the caller can report.\"\"\"\n    try:\n        return Sale(\n            sku=row[\"sku\"].strip().upper(),\n            qty=int(row[\"qty\"]),\n            price=float(row[\"price\"]),\n            sold_on=date.fromisoformat(row[\"sold_on\"]),\n        )\n    except (ValueError, KeyError) as err:\n        raise ValueError(f\"line {line_no}: {err}\") from err\n\ngood, bad = [], []\nwith open(\"sales.csv\", newline=\"\", encoding=\"utf-8\") as f:\n    for n, row in enumerate(csv.DictReader(f), start=2):   # 2 = after header\n        try:\n            good.append(parse(row, n))\n        except ValueError as err:\n            bad.append(str(err))\n\nPath(\"sales.json\").write_text(\n    json.dumps([asdict(s) for s in good], indent=2, default=str),\n    encoding=\"utf-8\",\n)\nprint(f\"{len(good)} clean, {len(bad)} rejected\")\nfor problem in bad:\n    print(\"  \", problem)",
              "label": "solution-20-1.py",
              "output": "3 clean, 2 rejected\n   line 4: invalid literal for int() with base 10: 'two'\n   line 6: Invalid isoformat string: '09/09/2026'"
            },
            {
              "kind": "text",
              "text": "`default=str` is what lets `json.dumps` handle the `date` — JSON has no date type. `raise ... from err` keeps the original exception in the traceback, so you can still see the real cause. And rejecting rows *with their line numbers* rather than crashing is what separates a script from a tool someone else can use.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q20",
      "title": "Would you use `pickle` to store data?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Only for a cache or intermediate artefact that my own trusted code writes and reads, never for anything that crosses a trust boundary or needs to last."
        },
        {
          "kind": "text",
          "text": "Two reasons. **Security**: unpickling executes arbitrary code by design, so loading a pickle from an untrusted source is remote code execution — the docs say so plainly. **Fragility**: pickles are Python-specific, version-sensitive, and tied to your class definitions, so renaming or moving a class breaks every pickle you saved."
        },
        {
          "kind": "text",
          "text": "For persistence I use JSON for structured data, CSV or Parquet for tabular, and SQLite when it needs querying — all of which are readable by other tools and by a future version of my own program."
        }
      ]
    }
  ]
};
