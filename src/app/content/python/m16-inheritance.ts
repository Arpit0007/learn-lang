import { Lesson } from '../../shared/content';

export const M16_INHERITANCE: Lesson = {
  "slug": "m16-inheritance",
  "title": "M16 Inheritance, composition, and dunders",
  "nav": "Inheritance & dunders",
  "num": "M16",
  "eyebrow": "Level 2 · Week 7 · ~2 sessions · PCC ch.9 and beyond",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "Inheritance means a new class gets everything from an older one — “is a”."
        },
        {
          "kind": "text",
          "text": "Composition means your object simply keeps another object inside it — “has a”."
        },
        {
          "kind": "text",
          "text": "Composition is usually the better choice. It is easier to change and much easier to test."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "figure",
      "svg": "<svg viewBox=\"0 0 540 210\" role=\"img\" aria-label=\"Inheritance draws a child class under a parent; composition draws an object holding another object as an attribute.\">\n      <defs><marker id=\"a-m16\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto-start-reverse\"><polygon points=\"0,1 9,5 0,9\" fill=\"currentColor\"></polygon></marker></defs>\n      <text x=\"0\" y=\"14\" class=\"dg-s\">INHERITANCE — \"IS A\"</text>\n      <rect x=\"40\" y=\"26\" width=\"140\" height=\"34\" rx=\"4\" class=\"dg-box\"></rect>\n      <text x=\"110\" y=\"48\" class=\"dg-t\" text-anchor=\"middle\">Car</text>\n      <line x1=\"110\" y1=\"92\" x2=\"110\" y2=\"64\" class=\"dg-l\" marker-end=\"url(#a-m16)\"></line>\n      <rect x=\"20\" y=\"94\" width=\"180\" height=\"34\" rx=\"4\" class=\"dg-fill\"></rect>\n      <text x=\"110\" y=\"116\" class=\"dg-t\" text-anchor=\"middle\">ElectricCar</text>\n      <text x=\"110\" y=\"152\" class=\"dg-s\" text-anchor=\"middle\">gets everything Car has,</text>\n      <text x=\"110\" y=\"168\" class=\"dg-s\" text-anchor=\"middle\">forever, whether it wants it or not</text>\n\n      <line x1=\"270\" y1=\"10\" x2=\"270\" y2=\"190\" class=\"dg-d\"></line>\n\n      <text x=\"300\" y=\"14\" class=\"dg-s\">COMPOSITION — \"HAS A\"</text>\n      <rect x=\"320\" y=\"26\" width=\"180\" height=\"34\" rx=\"4\" class=\"dg-fill\"></rect>\n      <text x=\"410\" y=\"48\" class=\"dg-t\" text-anchor=\"middle\">ElectricCar</text>\n      <line x1=\"410\" y1=\"64\" x2=\"410\" y2=\"90\" class=\"dg-l\" marker-end=\"url(#a-m16)\"></line>\n      <text x=\"470\" y=\"82\" class=\"dg-s\" text-anchor=\"middle\">self.battery</text>\n      <rect x=\"340\" y=\"94\" width=\"140\" height=\"34\" rx=\"4\" class=\"dg-ok\"></rect>\n      <text x=\"410\" y=\"116\" class=\"dg-t\" text-anchor=\"middle\">Battery</text>\n      <text x=\"410\" y=\"152\" class=\"dg-s\" text-anchor=\"middle\">just keeps one inside it —</text>\n      <text x=\"410\" y=\"168\" class=\"dg-s\" text-anchor=\"middle\">swap it for a fake in a test</text>\n    </svg>",
      "caption": "The arrow is the whole difference. Inheritance is a permanent link to a parent's insides; composition is a replaceable part held in an attribute, which is what makes it easy to test and easy to change later."
    },
    {
      "kind": "text",
      "text": "Inheritance says a subclass **is a** kind of its parent and gets its attributes and methods. `super().__init__(...)` runs the parent's initialiser. Overriding a method means redefining it in the child."
    },
    {
      "kind": "text",
      "text": "The more important lesson is that inheritance is usually the wrong tool. **Composition** — holding another object as an attribute — is more flexible and does not couple you to a parent's internals. Prefer \"has a\" to \"is a\" unless the subtype genuinely substitutes for the parent everywhere."
    },
    {
      "kind": "example",
      "code": "class Battery:\n    \"\"\"A separate concern, held by composition rather than inherited.\"\"\"\n    def __init__(self, capacity=75):\n        self.capacity = capacity\n\n    def range_km(self):\n        return round(self.capacity * 5.4)\n\n\nclass Car:\n    def __init__(self, make, model):\n        self.make, self.model = make, model\n\n    def fuel(self):\n        return \"petrol\"\n\n    def __str__(self):\n        return f\"{self.make} {self.model}\".title()\n\n\nclass ElectricCar(Car):                       # is-a Car\n    def __init__(self, make, model, capacity=75):\n        super().__init__(make, model)          # run the parent's __init__\n        self.battery = Battery(capacity)       # has-a Battery\n\n    def fuel(self):                            # override\n        return \"electricity\"\n\n    def __str__(self):\n        return f\"{super().__str__()} (EV, {self.battery.range_km()} km)\"\n\n\nfor vehicle in [Car(\"audi\", \"a4\"), ElectricCar(\"tata\", \"nexon\", 40)]:\n    print(f\"{vehicle} runs on {vehicle.fuel()}\")\n\nev = ElectricCar(\"tesla\", \"model 3\")\nprint(isinstance(ev, Car), type(ev).__mro__[:3])",
      "label": "inheritance.py",
      "output": "Audi A4 runs on petrol\nTata Nexon (EV, 216 km) runs on electricity\nTrue (<class '__main__.ElectricCar'>, <class '__main__.Car'>, <class 'object'>)"
    },
    {
      "kind": "heading",
      "level": 3,
      "text": "The dunders worth knowing"
    },
    {
      "kind": "table",
      "head": [
        "Method",
        "Triggered by",
        "Why you'd write it"
      ],
      "rows": [
        [
          "`__init__`",
          "`Thing()`",
          "Set up instance state."
        ],
        [
          "`__repr__`",
          "REPL, debugger, `repr()`",
          "Unambiguous developer view. Write this one always."
        ],
        [
          "`__str__`",
          "`print()`, `str()`",
          "Human-facing text. Falls back to `__repr__`."
        ],
        [
          "`__eq__`",
          "`==`",
          "Value equality. Define `__hash__` alongside it."
        ],
        [
          "`__len__`",
          "`len()`, truthiness",
          "Makes your object behave like a container."
        ],
        [
          "`__iter__`",
          "`for`, unpacking",
          "Makes it iterable — Module 23."
        ],
        [
          "`__enter__`/`__exit__`",
          "`with`",
          "Guaranteed cleanup — Module 25."
        ],
        [
          "`__call__`",
          "`obj()`",
          "Makes an instance callable like a function."
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "Override `__init__` without calling the parent's and the parent's attributes are never created — every later access raises `AttributeError`, often far from the class you edited. Also prefer the zero-argument `super()` over naming the parent explicitly: `super()` follows the method-resolution order, so it keeps working under multiple inheritance and when the hierarchy is rearranged, whereas `Parent.__init__(self, ...)` hardcodes an assumption."
        }
      ],
      "title": "Trap · forgetting `super().__init__()`"
    },
    {
      "kind": "quiz",
      "question": "You define `__eq__` on a class and then put instances in a set. What happens?",
      "options": [
        "It works — sets only need equality",
        "Duplicates are silently kept",
        "`TypeError: unhashable type`",
        "The set falls back to identity comparison"
      ],
      "answer": 2,
      "why": "**It raises.** Defining `__eq__` sets `__hash__` to `None`, making instances unhashable — Python's way of stopping you from creating objects that are equal but hash differently, which would break every hash table they touch. Either define `__hash__` to match (usually `hash((self.a, self.b))` over the same fields `__eq__` uses), or let `@dataclass(frozen=True)` generate both — Module 17."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 16.1",
      "title": "Turn inheritance into composition",
      "blocks": [
        {
          "kind": "text",
          "text": "This hierarchy abuses inheritance — a `Report` is not a kind of `EmailSender`. Refactor it so the report *has* a sender, then show that you can swap the sender for a fake without touching `Report`."
        },
        {
          "kind": "example",
          "code": "class EmailSender:\n    def send(self, to, body):\n        print(f\"SMTP -> {to}: {body[:20]}...\")\n\nclass Report(EmailSender):          # \"is-a\" is wrong here\n    def __init__(self, title):\n        self.title = title\n    def deliver(self, to):\n        self.send(to, f\"{self.title} ready\")",
          "label": "before.py"
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "class EmailSender:\n    def send(self, to, body):\n        print(f\"  SMTP -> {to}: {body}\")\n\nclass FakeSender:\n    \"\"\"Same shape, no network. No base class needed - duck typing.\"\"\"\n    def __init__(self):\n        self.sent = []\n    def send(self, to, body):\n        self.sent.append((to, body))\n\nclass Report:\n    def __init__(self, title, sender):      # injected, not inherited\n        self.title = title\n        self.sender = sender\n\n    def deliver(self, to):\n        self.sender.send(to, f\"{self.title} ready\")\n\n\nReport(\"Q3 numbers\", EmailSender()).deliver(\"arpit@fiery.com\")\n\nfake = FakeSender()\nReport(\"Q3 numbers\", fake).deliver(\"test@example.com\")\nprint(fake.sent)",
              "label": "after.py",
              "output": "  SMTP -> arpit@fiery.com: Q3 numbers ready\n[('test@example.com', 'Q3 numbers ready')]"
            },
            {
              "kind": "text",
              "text": "Three things improved at once: `Report` no longer exposes a `send()` method it never meant to publish, the sender is swappable at runtime, and the test needs no mocking library. That testability argument is the one to make in an interview.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q16",
      "title": "Inheritance or composition?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** Composition by default; inheritance only when the subclass is a genuine *substitute* for the parent — the Liskov test: any code working with the parent must keep working when handed the child."
        },
        {
          "kind": "text",
          "text": "The cost of inheritance is a hard, permanent coupling to the parent's implementation, not just its interface. Change a parent's internal method and every subclass can break, which is the \"fragile base class\" problem. Deep hierarchies also scatter behaviour, so answering \"what does this method actually do?\" means reading five files."
        },
        {
          "kind": "text",
          "text": "Composition instead holds a collaborator as an attribute and delegates to it. It is swappable, testable with a fake, and can change at runtime. In Python, where duck typing means you rarely need a shared base class to satisfy a type, the case for inheritance is narrower still — `Protocol` in Module 26 covers the interface use, and mixins remain the one place a shallow inheritance tree still pays."
        }
      ]
    }
  ]
};
