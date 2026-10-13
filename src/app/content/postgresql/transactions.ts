import { Lesson } from '../../shared/content';

/** Hidden setup: two bank accounts. The CHECK stops a balance from going below zero. */
const ACCOUNTS = `CREATE TABLE accounts (
  id      integer PRIMARY KEY,
  owner   text NOT NULL,
  balance numeric(10, 2) NOT NULL CHECK (balance >= 0)
);

INSERT INTO accounts (id, owner, balance) VALUES
  (1, 'Aisha', 100.00),
  (2, 'Ben', 50.00);`;

export const TRANSACTIONS: Lesson = {
  slug: 'transactions',
  title: 'Transactions',
  nav: 'Transactions',
  blocks: [
    {
      kind: 'text',
      text: "Aisha wants to send Ben 30 dollars. In the database, that is two changes: take 30 from Aisha's balance, and add 30 to Ben's. What if the power goes off between the two changes? Aisha has lost 30, and Ben never got it.",
    },
    {
      kind: 'text',
      text: "A **transaction** solves this. It groups several changes into one unit of work: either **all** of them happen, or **none** of them do. This lesson uses a demo table, `accounts`, created for you before each example. Aisha starts with 100.00 and Ben with 50.00, and a `CHECK` rule stops any balance from going below zero.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'BEGIN, COMMIT and ROLLBACK',
    },
    {
      kind: 'text',
      text: "`BEGIN` starts a transaction. The changes after it are not final yet. `COMMIT` makes all of them final, together.",
    },
    {
      kind: 'example',
      label: 'transfer.sql',
      setup: ACCOUNTS,
      code: `SELECT *
FROM accounts
ORDER BY id;

BEGIN;

UPDATE accounts
SET balance = balance - 30
WHERE owner = 'Aisha';

UPDATE accounts
SET balance = balance + 30
WHERE owner = 'Ben';

COMMIT;

SELECT *
FROM accounts
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Aisha now has 70.00 and Ben has 80.00. Until the `COMMIT`, other people using the database could not see either change. After it, they see both changes at the same moment.",
    },
    {
      kind: 'text',
      text: "`ROLLBACK` does the opposite: it throws away every change since `BEGIN`. Use it when something went wrong, or when you only want to try something out.",
    },
    {
      kind: 'example',
      label: 'rollback.sql',
      setup: ACCOUNTS,
      code: `BEGIN;

UPDATE accounts
SET balance = 0
WHERE owner = 'Aisha';

SELECT *
FROM accounts
ORDER BY id;

ROLLBACK;

SELECT *
FROM accounts
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Inside the transaction, Aisha's balance was 0.00. After `ROLLBACK` it is back to 100.00, as if the `UPDATE` never happened.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Good to know',
      blocks: [
        {
          kind: 'text',
          text: "Without `BEGIN`, every statement is its own small transaction, and it is saved as soon as it finishes. This is called **autocommit**. All the earlier lessons worked this way.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'An error cancels the transaction',
    },
    {
      kind: 'text',
      text: "Now try to send 500, which Aisha doesn't have. The first `UPDATE` gives Ben 500. The second `UPDATE` would leave Aisha below zero, so the `CHECK` rule makes it fail.",
    },
    {
      kind: 'example',
      label: 'failed-transfer.sql',
      setup: ACCOUNTS,
      expectError: true,
      code: `BEGIN;

UPDATE accounts
SET balance = balance + 500
WHERE owner = 'Ben';

UPDATE accounts
SET balance = balance - 500
WHERE owner = 'Aisha';

COMMIT;`,
    },
    {
      kind: 'text',
      text: "On this page, a run stops at the first error. In psql, the command-line tool for PostgreSQL, you could keep typing. Press **Show output** to see what psql would print for each line:",
    },
    {
      kind: 'example',
      lang: 'text',
      run: 'none',
      label: 'psql-session.txt',
      code: `BEGIN;
UPDATE accounts SET balance = balance + 500 WHERE owner = 'Ben';
UPDATE accounts SET balance = balance - 500 WHERE owner = 'Aisha';
SELECT * FROM accounts;
COMMIT;`,
      output: `BEGIN
UPDATE 1
ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"
DETAIL:  Failing row contains (1, Aisha, -400.00).
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK`,
    },
    {
      kind: 'text',
      text: "After an error, the transaction is **aborted** (broken). PostgreSQL ignores every command until the transaction ends, and even `COMMIT` acts as `ROLLBACK`. So Ben does not keep the 500: the whole transfer is undone, and both balances are the same as before. All or nothing.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Savepoints',
    },
    {
      kind: 'text',
      text: "Sometimes you want to undo only **part** of a transaction. `SAVEPOINT name` marks a point inside it. `ROLLBACK TO SAVEPOINT name` undoes everything after that point and keeps everything before it. The transaction stays open, so you can carry on and `COMMIT`.",
    },
    {
      kind: 'example',
      label: 'savepoint.sql',
      setup: ACCOUNTS,
      code: `BEGIN;

UPDATE accounts
SET balance = balance - 30
WHERE owner = 'Aisha';

UPDATE accounts
SET balance = balance + 30
WHERE owner = 'Ben';

SAVEPOINT transfer_done;

UPDATE accounts
SET balance = balance - 5
WHERE owner = 'Ben';

ROLLBACK TO SAVEPOINT transfer_done;

COMMIT;

SELECT *
FROM accounts
ORDER BY id;`,
    },
    {
      kind: 'text',
      text: "Taking a fee of 5 from Ben was a mistake, so we went back to the savepoint. The transfer before it was kept: Aisha has 70.00 and Ben has 80.00. In psql, `ROLLBACK TO SAVEPOINT` can also rescue a transaction after an error: the work before the savepoint stays, and you can go on.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'ACID, isolation and locks',
    },
    {
      kind: 'text',
      text: "People describe what transactions promise with four letters, **ACID**:",
    },
    {
      kind: 'table',
      head: ['Letter', 'Name', 'In simple words'],
      rows: [
        ['A', 'Atomicity', 'All or nothing. A transaction never stops halfway.'],
        ['C', 'Consistency', 'Your rules, like `CHECK` and foreign keys, are true before and after every transaction.'],
        ['I', 'Isolation', "Transactions that run at the same time don't see each other's unfinished work."],
        ['D', 'Durability', 'After `COMMIT`, the change is safe, even if the power goes off one second later.'],
      ],
    },
    {
      kind: 'text',
      text: "Many people can use one database at the same time. Each of them has a **session**, which is their own connection to the database. How much a transaction sees of the work of other sessions depends on its **isolation level**:",
    },
    {
      kind: 'table',
      head: ['Isolation level', 'What a transaction sees'],
      rows: [
        ['Read committed (the default)', 'Each statement sees the data that was committed before **that statement** started. So two `SELECT`s in one transaction can give different results, if another session commits in between.'],
        ['Repeatable read', 'The whole transaction sees the data as it was at its **first** statement. Changes that other sessions commit later stay hidden.'],
        ['Serializable', 'The strictest level. The result is the same as if the transactions had run one after another. PostgreSQL may stop one of them with an error, and then you run it again.'],
      ],
    },
    {
      kind: 'text',
      text: "You choose the level when you start the transaction. `SHOW transaction_isolation` tells you the level you are in:",
    },
    {
      kind: 'example',
      label: 'isolation-level.sql',
      setup: ACCOUNTS,
      code: `BEGIN ISOLATION LEVEL REPEATABLE READ;

SHOW transaction_isolation;

SELECT sum(balance) AS total
FROM accounts;

COMMIT;

SHOW transaction_isolation;`,
    },
    {
      kind: 'text',
      text: "Inside the transaction the level is `repeatable read`. After `COMMIT`, you are back to the default, `read committed`.",
    },
    {
      kind: 'text',
      text: "**Locks** stop two sessions from changing the same row at the same time. When a transaction changes a row, it locks that row until the transaction ends. If a second session tries to change the same row, it has to **wait**:",
    },
    {
      kind: 'table',
      head: ['Step', 'Session A', 'Session B'],
      rows: [
        ['1', '`BEGIN;`', ''],
        ['2', '`UPDATE accounts SET balance = balance - 30 WHERE id = 1;`', ''],
        ['3', '', '`UPDATE accounts SET balance = balance + 10 WHERE id = 1;` waits for A'],
        ['4', '`COMMIT;`', ''],
        ['5', '', "The waiting `UPDATE` runs now, on A's new balance: 70.00 + 10"],
      ],
    },
    {
      kind: 'text',
      text: "A plain `SELECT` never waits for these locks: it just sees the last committed data. If you read a row because you plan to change it, write `SELECT ... FOR UPDATE`. It locks the row right away, so nobody can change it before you do.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Only one session on this page',
      blocks: [
        {
          kind: 'text',
          text: "This page has only one session, so you can't watch two transactions at the same time here, or see one wait for the other. To try it, open two psql windows on your own computer, connect both to the same database, and type the steps from the table above.",
        },
      ],
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'Move 20 from Aisha to Ben, so that both changes happen or neither does. Fill in the first and the last statement.',
        code: `[___];

UPDATE accounts
SET balance = balance - 20
WHERE owner = 'Aisha';

UPDATE accounts
SET balance = balance + 20
WHERE owner = 'Ben';

[___];`,
        answers: [
          ['BEGIN', 'begin', 'START TRANSACTION', 'start transaction'],
          ['COMMIT', 'commit', 'END', 'end'],
        ],
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'A transaction has three `UPDATE` statements. The second one fails. What happens to the change made by the first one?',
        options: [
          'It is undone as well',
          'It is kept',
          'It is kept, but only for the first table',
          'It is saved when the third statement runs',
        ],
        answer: 'It is undone as well',
      },
    },
    {
      kind: 'reveal',
      tag: 'Try it',
      title: 'Ben pays Aisha back',
      blocks: [
        {
          kind: 'text',
          text: "Ben sends Aisha 20. Write the transaction, and then show both balances.",
        },
        {
          kind: 'reveal',
          tag: 'Solution',
          title: 'Show me',
          blocks: [
            {
              kind: 'example',
              label: 'pay-back.sql',
              setup: ACCOUNTS,
              code: `BEGIN;

UPDATE accounts
SET balance = balance - 20
WHERE owner = 'Ben';

UPDATE accounts
SET balance = balance + 20
WHERE owner = 'Aisha';

COMMIT;

SELECT *
FROM accounts
ORDER BY id;`,
            },
            {
              kind: 'text',
              text: "Aisha now has 120.00 and Ben has 30.00. Together they still have 150.00, the same as before. A transfer moves money, but it never makes or loses any.",
            },
          ],
        },
      ],
    },
  ],
};
