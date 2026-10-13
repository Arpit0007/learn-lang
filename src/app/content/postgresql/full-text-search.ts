import { Lesson } from '../../shared/content';

/** Hidden setup: six short blog posts from the shop. */
const ARTICLES = `CREATE TABLE articles (
  id    integer PRIMARY KEY,
  title text NOT NULL,
  body  text NOT NULL
);

INSERT INTO articles (id, title, body) VALUES
  (1, 'Running shoes for beginners', 'Running is easier in good shoes. Run in them at home first. Running outside comes later.'),
  (2, 'Our new coffee mugs', 'The new mugs keep coffee hot for longer. Perfect for a slow Sunday brunch.'),
  (3, 'How to start running', 'Start slowly. Run for one minute, then walk for two, then run again. Every runner was a beginner once.'),
  (4, 'Caring for your headphones', 'Wipe the ear pads with a soft cloth. Never run them under water.'),
  (5, 'Gifts for book lovers', 'A good book, a soft towel and a cup of hot coffee make a perfect gift.'),
  (6, 'Why we sell wooden toys', 'Wooden toys last for years. Children love building blocks and puzzles.');`;

/** The search column from the last section. */
const SEARCH_COLUMN = `ALTER TABLE articles
ADD COLUMN search tsvector
GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;`;

export const FULL_TEXT_SEARCH: Lesson = {
  slug: 'full-text-search',
  title: 'Full-Text Search',
  nav: 'Full-text search',
  blocks: [
    {
      kind: 'text',
      text: "Almost every website has a search box. Type \"running\", and you expect to find every article about running. **Full-text search** is PostgreSQL's own search engine for text like this. It works with **words**, not just with letters.",
    },
    {
      kind: 'text',
      text: "This lesson uses a small demo table called `articles`: six short blog posts from the shop, each with an `id`, a `title` and a `body`. It is created for you before each example.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Why LIKE is not enough',
    },
    {
      kind: 'text',
      text: "The first idea is `LIKE '%run%'`: find the letters \"run\" anywhere in the text. Run it, and read the results closely.",
    },
    {
      kind: 'example',
      label: 'like-search.sql',
      setup: ARTICLES,
      code: `SELECT id, title, body
FROM articles
WHERE body LIKE '%run%'
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "There are three problems:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "It found article 2, about coffee mugs, because of the word \"brunch\". `LIKE` looks for letters, not words.",
        "It missed article 1, which is all about running, because there \"Running\" and \"Run\" start with a capital R. `LIKE` cares about upper and lower case. (`ILIKE` doesn't, but it still finds \"brunch\".)",
        "It can't tell you which article matches **best**. And on a big table it is slow: it must read every row, because a normal index can't help with `'%run%'`.",
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Words, not letters',
    },
    {
      kind: 'text',
      text: "Full-text search works in two steps. `to_tsvector` turns a text into a sorted list of word roots, called **lexemes**. `to_tsquery` turns the words you search for into the same kind of roots. The first argument, `'english'`, is the language. It decides the rules for finding the roots.",
    },
    {
      kind: 'example',
      label: 'tsvector.sql',
      code: `SELECT to_tsvector('english', 'The cats were running and jumping') AS vector;

SELECT to_tsquery('english', 'running & shoes') AS query;`,
    },
    {
      kind: 'text',
      text: "Look at what happened. Small, common words like \"the\", \"were\" and \"and\" are gone. They are **stop words**: they are in almost every text, so they don't help a search. \"cats\" became `cat`, \"running\" became `run`, and \"jumping\" became `jump`. Cutting words down to their root like this is called **stemming**. The numbers show where each word was in the text. In the query, `&` means AND: both words must be there.",
    },
    {
      kind: 'text',
      text: "The `@@` operator checks if a vector **matches** a query. Now search the articles for `run`:",
    },
    {
      kind: 'example',
      label: 'match.sql',
      setup: ARTICLES,
      code: `SELECT id, title
FROM articles
WHERE to_tsvector('english', body) @@ to_tsquery('english', 'run')
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "This time, article 1 is found, because the root of \"Running\" is `run`. Article 2 is gone, because \"brunch\" is a different word. Article 4 is found too, because it says \"never run them under water\". Full-text search knows words, not what a text is about.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Search box text and the best match first',
    },
    {
      kind: 'text',
      text: "`to_tsquery` needs an operator between words. Give it `'running shoes'`, with only a space, and it stops with a syntax error. For text that people type into a search box, use one of these instead:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "`plainto_tsquery` puts AND between all the words.",
        "`websearch_to_tsquery` understands the style of web search engines: words in double quotes, like `\"hot coffee\"`, must appear together, `or` means either word, and a minus means NOT, like `-mugs`.",
      ],
    },
    {
      kind: 'example',
      label: 'search-box.sql',
      setup: ARTICLES,
      code: `SELECT plainto_tsquery('english', 'running shoes') AS plain,
       websearch_to_tsquery('english', 'coffee -mugs') AS websearch;

SELECT id, title
FROM articles
WHERE to_tsvector('english', body) @@ websearch_to_tsquery('english', 'coffee -mugs')
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "The first result shows the two queries. `!` means NOT. Did you notice `coffe`? A root doesn't have to be a real word. Coffee is in articles 2 and 5, but article 2 also talks about mugs, so only article 5 is left.",
    },
    {
      kind: 'text',
      text: "To show the **best match first**, sort by `ts_rank`. It gives each matching row a score. For example, a row that uses the search word more often gets a higher score.",
    },
    {
      kind: 'example',
      label: 'rank.sql',
      setup: ARTICLES,
      code: `SELECT id,
       title,
       ts_rank(to_tsvector('english', body), to_tsquery('english', 'run')) AS rank
FROM articles
WHERE to_tsvector('english', body) @@ to_tsquery('english', 'run')
ORDER BY rank DESC;`,
    },
    {
      kind: 'text',
      text: "The body of article 1 uses \"run\" or \"running\" three times, article 3 twice, and article 4 once, so that is their order. The scores are small numbers, and only their order matters.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Make it fast with a GIN index',
    },
    {
      kind: 'text',
      text: "So far, PostgreSQL ran `to_tsvector` on every row, for every search. On a big table, that is slow. The fix has two parts:",
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        "A **generated column** that stores the vector. PostgreSQL works out its value by itself, and keeps it up to date whenever the row changes. `STORED` means the value is saved in the table, so it can have an index.",
        "A **GIN index** on that column. GIN is a type of index for values that hold many items, such as the words in a vector. It lets `@@` find the matching rows without reading every row.",
      ],
    },
    {
      kind: 'example',
      label: 'search-column.sql',
      setup: ARTICLES,
      code: `${SEARCH_COLUMN}

CREATE INDEX articles_search_idx
ON articles USING GIN (search);

INSERT INTO articles (id, title, body)
VALUES (7, 'Wooden puzzles are back', 'Our new puzzles are made by hand from wood.');

SELECT id, title
FROM articles
WHERE search @@ websearch_to_tsquery('english', 'wooden puzzles')
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "The `search` column covers the title and the body together. Article 7 was added after the column, and it is found anyway: nobody had to fill in `search` by hand. On a tiny table like this one, reading every row is quick anyway. The index pays off when there are thousands of articles.",
    },
    {
      kind: 'callout',
      tone: 'key',
      title: 'Always name the language',
      blocks: [
        {
          kind: 'text',
          text: "Write `to_tsvector('english', ...)`, not just `to_tsvector(...)`. Without a language, PostgreSQL uses a server setting, and that setting could change. A generated column must always give the same result, so there the language is required: without it, PostgreSQL stops with \"generation expression is not immutable\".",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Find the articles whose body is about coffee. Fill in the function that makes the vector, and the match operator.',
        code: `SELECT title
FROM articles
WHERE [___]('english', body) [___] to_tsquery('english', 'coffee');`,
        answers: ['to_tsvector', '@@'],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'You use full-text search to look for `run`. Which word in an article will match too?',
        options: ['running', 'brunch', 'prune', 'truncate'],
        answer: 'running',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Search for hot coffee',
      blocks: [
        {
          kind: 'text',
          text: "Add the `search` column from the last example. Then find the articles about **hot coffee**, best match first, with `websearch_to_tsquery` and `ts_rank`. Next, put the two words in double quotes, `'\"hot coffee\"'`, and run it again. What changes?",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'hot-coffee.sql',
              setup: ARTICLES,
              code: `${SEARCH_COLUMN}

SELECT id,
       title,
       ts_rank(search, websearch_to_tsquery('english', 'hot coffee')) AS rank
FROM articles
WHERE search @@ websearch_to_tsquery('english', 'hot coffee')
ORDER BY rank DESC;

SELECT id,
       title
FROM articles
WHERE search @@ websearch_to_tsquery('english', '"hot coffee"')
ORDER BY id;`,
            },
            {
              kind: 'text',
              text: "Without quotes, both articles 2 and 5 match, and article 2 comes first, because it says \"coffee\" twice. With quotes, only article 5 is left: it says \"hot coffee\", while article 2 says \"coffee hot\".",
            },
          ],
        },
      ],
    },
  ],
};
