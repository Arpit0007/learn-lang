import { Lesson } from '../../shared/content';

export const M15_CLASSES: Lesson = {
  "slug": "m15-classes",
  "title": "M15 Classes",
  "nav": "Classes",
  "num": "M15",
  "eyebrow": "Level 2 · Week 7 · ~4 sessions · PCC ch.9",
  "blocks": [
    {
      "kind": "callout",
      "tone": "plain",
      "blocks": [
        {
          "kind": "text",
          "text": "A class is a blueprint. An object is one thing built from that blueprint."
        },
        {
          "kind": "text",
          "text": "`__init__` runs automatically when you make a new object. `self` means “this particular object”."
        },
        {
          "kind": "text",
          "text": "Put changing data in `__init__`, not in the class body, or every object will share it."
        }
      ],
      "title": "In simple words"
    },
    {
      "kind": "text",
      "text": "A class is a template for objects that bundle **data** (attributes) with **behaviour** (methods). An **instance** is one object built from that template."
    },
    {
      "kind": "text",
      "text": "`__init__` runs automatically on creation. `self` is the instance itself, passed as the first argument to every method — Python passes it explicitly where other languages hide it, which is why you write `self` in definitions but not in calls."
    },
    {
      "kind": "example",
      "code": "class Car:\n    \"\"\"A simple car.\"\"\"\n\n    wheels = 4                       # CLASS attribute: shared by all instances\n\n    def __init__(self, make, model, year):\n        self.make = make             # INSTANCE attributes: one per object\n        self.model = model\n        self.year = year\n        self.odometer = 0            # a sensible default, not a parameter\n\n    def description(self):\n        return f\"{self.year} {self.make} {self.model}\".title()\n\n    def read_odometer(self):\n        return f\"{self.odometer} km on the clock\"\n\n    def update_odometer(self, km):\n        \"\"\"Reject rollbacks - a method can defend its own invariants.\"\"\"\n        if km < self.odometer:\n            raise ValueError(\"cannot roll back an odometer\")\n        self.odometer = km\n\n    def __repr__(self):\n        \"\"\"What the REPL and debuggers show. Always worth writing.\"\"\"\n        return f\"Car({self.make!r}, {self.model!r}, {self.year})\"\n\n\nmy_car = Car(\"audi\", \"a4\", 2024)\nprint(my_car.description())\nmy_car.update_odometer(1500)\nprint(my_car.read_odometer())\nprint(my_car, Car.wheels, my_car.wheels)",
      "label": "classes.py",
      "output": "2024 Audi A4\n1500 km on the clock\nCar('audi', 'a4', 2024) 4 4"
    },
    {
      "kind": "callout",
      "tone": "trap",
      "blocks": [
        {
          "kind": "text",
          "text": "`class Team: members = []` gives *every* instance the same list, so `a.members.append(x)` shows up in `b.members`. It is the mutable-default bug from Module 13 wearing a different hat, and the fix is the same: create mutable state in `__init__` as `self.members = []`. Class attributes are for genuinely shared, immutable things — constants, counters you manage deliberately, defaults that never change."
        }
      ],
      "title": "Trap · a mutable class attribute"
    },
    {
      "kind": "quiz",
      "question": "What is `self`?",
      "options": [
        "A reserved keyword referring to the class",
        "An ordinary parameter holding the instance, named by convention",
        "A global set by the interpreter",
        "A pointer to the parent class"
      ],
      "answer": 1,
      "why": "**An ordinary parameter.** `self` is not a keyword — you could legally name it `this` or `banana` and the code would run, though every reviewer would object. When you call `obj.method(x)`, Python rewrites it as `Class.method(obj, x)`, which is exactly why the first parameter exists. Forgetting it gives `TypeError: method() takes 0 positional arguments but 1 was given` — the \"extra\" argument is the instance."
    },
    {
      "kind": "reveal",
      "tag": "Exercise 15.1",
      "title": "Restaurant, with an invariant",
      "blocks": [
        {
          "kind": "text",
          "text": "Write a `Restaurant` class with a name, cuisine, and `number_served` defaulting to 0. Add a method to set the count that refuses to decrease it, a method to increment it, and a `__repr__`."
        },
        {
          "kind": "reveal",
          "tag": "Solution",
          "title": "Show me",
          "blocks": [
            {
              "kind": "example",
              "code": "class Restaurant:\n    def __init__(self, name, cuisine):\n        self.name = name\n        self.cuisine = cuisine\n        self.number_served = 0\n\n    def describe(self):\n        return f\"{self.name.title()} serves {self.cuisine}\"\n\n    def set_number_served(self, count):\n        if count < self.number_served:\n            raise ValueError(\"customer count cannot go down\")\n        self.number_served = count\n\n    def increment_number_served(self, extra=1):\n        self.number_served += extra\n\n    def __repr__(self):\n        return f\"Restaurant({self.name!r}, {self.cuisine!r}, served={self.number_served})\"\n\n\nr = Restaurant(\"dosa corner\", \"south indian\")\nprint(r.describe())\nr.set_number_served(40)\nr.increment_number_served(7)\nprint(r)",
              "label": "solution-15-1.py",
              "output": "Dosa Corner serves south indian\nRestaurant('dosa corner', 'south indian', served=47)"
            },
            {
              "kind": "text",
              "text": "The point of putting the check inside the method is that no caller can bypass it — that is what \"encapsulation\" actually buys you, as opposed to just wrapping data in a class.",
              "style": "small"
            }
          ]
        }
      ]
    },
    {
      "kind": "reveal",
      "tag": "Interview Q15",
      "title": "Class attribute vs instance attribute?",
      "blocks": [
        {
          "kind": "text",
          "text": "**Answer.** A class attribute is defined in the class body and stored on the class, so it is shared by all instances. An instance attribute is assigned on `self`, usually in `__init__`, and belongs to that one object."
        },
        {
          "kind": "text",
          "text": "Lookup order is what makes this subtle: attribute access checks the instance first, then the class. So reading `obj.x` falls back to the class value, but *writing* `obj.x = 5` creates an instance attribute that shadows it — the class attribute is unchanged and other instances still see the old value. That asymmetry is why mutable class attributes are dangerous: `obj.items.append(1)` is a read followed by a mutation, so it never creates the shadowing copy and every instance sees it."
        }
      ]
    }
  ]
};
