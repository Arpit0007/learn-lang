import { Lesson } from '../../shared/content';

export const INSTALL: Lesson = {
  slug: 'install',
  title: 'Install PostgreSQL and Connect',
  nav: 'Install & connect',
  blocks: [
    {
      kind: 'text',
      text: "Every example in this course runs right here in your browser. **You do not need to install anything to follow the lessons.** Come back to this page when you want PostgreSQL on your own computer, for your own projects.",
    },
    {
      kind: 'text',
      text: "PostgreSQL has two parts. The **server** is the program that stores the data and runs your SQL. A **client** is the program you type SQL into. It sends your SQL to the server and shows you the answer. PostgreSQL comes with a client called `psql`, which runs in a **terminal**: the window where you type commands.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Install PostgreSQL',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "**Windows:** download the Windows installer from the official website, postgresql.org, and run it. Keep the suggested choices. The installer asks you to choose a password for the `postgres` user. Remember it, because you need it to connect. The installer also adds **SQL Shell (psql)** and **pgAdmin** to the Start menu.",
        "**macOS:** the easiest way is **Postgres.app**, which you install like any other Mac app. If you use **Homebrew**, a tool that installs programs from the terminal, run the commands below.",
        "**Linux:** use the package manager of your Linux system. On Ubuntu and Debian, run the commands below. The server starts by itself after the install.",
      ],
    },
    {
      kind: 'example',
      lang: 'text',
      run: 'none',
      label: 'terminal (macOS with Homebrew)',
      code: `brew install postgresql@18
brew services start postgresql@18`,
      output: `…
==> Successfully started \`postgresql@18\` (label: homebrew.mxcl.postgresql@18)`,
    },
    {
      kind: 'text',
      text: "Homebrew prints a lot while it installs. The last line tells you that the server is running. If the terminal later says `psql: command not found`, look at the end of the install messages: Homebrew shows a command that adds PostgreSQL to your `PATH`, the list of folders where the terminal looks for programs.",
    },
    {
      kind: 'example',
      lang: 'text',
      run: 'none',
      label: 'terminal (Ubuntu or Debian)',
      code: `sudo apt update
sudo apt install postgresql
pg_lsclusters`,
      output: `…
Ver Cluster Port Status Owner    Data directory              Log file
18  main    5432 online postgres /var/lib/postgresql/18/main /var/log/postgresql/postgresql-18-main.log`,
    },
    {
      kind: 'text',
      text: "`sudo` runs a command as the administrator, so it asks for your password. `pg_lsclusters` lists the PostgreSQL servers on the computer, and `online` means the server is running. The first number is the version. It depends on your Linux version, and any recent version is fine for learning.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Or run it with Docker',
    },
    {
      kind: 'text',
      text: "**Docker** runs programs in **containers**: closed boxes that do not change the rest of your computer. If you already use Docker, one command downloads and starts a PostgreSQL 18 server:",
    },
    {
      kind: 'example',
      lang: 'text',
      run: 'none',
      label: 'terminal (Docker)',
      code: `docker run --name my-postgres -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:18`,
      output: `Unable to find image 'postgres:18' locally
18: Pulling from library/postgres
…
Status: Downloaded newer image for postgres:18
44c5ab6a3e896aa91e71a496e14adc42293c409c5302935a31cbd62fb8133320`,
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "`--name my-postgres` gives the container a name.",
        "`-e POSTGRES_PASSWORD=secret` sets the password of the `postgres` user. Choose your own.",
        "`-p 5432:5432` lets programs on your computer reach the server on port 5432, the usual port for PostgreSQL.",
        "`-d` runs the container in the background.",
        "`postgres:18` is the image to run: PostgreSQL version 18.",
      ],
    },
    {
      kind: 'text',
      text: "Docker downloads PostgreSQL only the first time. The long number on the last line is the ID of your new container. If PostgreSQL is also installed on your computer, port 5432 is already taken. Then use `-p 5433:5432`, and connect to port 5433 instead.",
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Connect with psql',
    },
    {
      kind: 'text',
      text: "How you start `psql` depends on how you installed PostgreSQL:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "**Windows:** open **SQL Shell (psql)** from the Start menu. It asks for the server, database, port and user name, each with a suggested value in square brackets, like `[localhost]`. Press Enter to accept each one, then type your password.",
        "**macOS with Postgres.app:** double-click a database in the app's window. psql opens in a terminal, already connected.",
        "**macOS with Homebrew:** run `psql postgres`. Homebrew makes your own Mac user name the main user, so you need no password.",
        "**Linux:** run `sudo -u postgres psql`. This starts `psql` as the system user called `postgres`.",
        "**Docker:** run `docker exec -it my-postgres psql -U postgres`.",
        "**In general:** `psql -U postgres` connects as the user `postgres`. `-U` means \"user\".",
      ],
    },
    {
      kind: 'example',
      lang: 'text',
      run: 'none',
      label: 'terminal',
      code: `psql -U postgres`,
      output: `Password for user postgres:
psql (18.6)
Type "help" for help.

postgres=#`,
    },
    {
      kind: 'text',
      text: "The number after `psql` is your version, so it may be a little different. On Windows you may also see a warning about the \"console code page\". You can ignore it for now. When you see the **prompt** `postgres=#`, psql is ready. The first word of the prompt is the database you are connected to. Now you can type SQL. End each statement with `;` and press Enter.",
    },
    {
      kind: 'callout',
      tone: 'trap',
      title: 'Nothing happens?',
      blocks: [
        {
          kind: 'text',
          text: "If you press Enter and the prompt changes to `postgres-#`, psql is waiting for the end of your statement. You forgot the semicolon. Type `;` and press Enter.",
        },
      ],
    },
    {
      kind: 'text',
      text: "Commands that start with a backslash (`\\\\`) are **meta-commands**. They are not SQL. psql runs them itself, to show you information about your databases. Here are the ones you need most:",
    },
    {
      kind: 'table',
      head: ['Command', 'What it does'],
      rows: [
        ['`\\\\l`', 'lists all the databases'],
        ['`\\\\c shop`', 'connects to the database called `shop`'],
        ['`\\\\dt`', 'lists the tables in the database you are connected to'],
        ['`\\\\d customers`', 'describes the `customers` table: its columns, their types and their rules'],
        ['`\\\\?`', 'shows help for all the meta-commands'],
        ['`\\\\q`', 'quits psql'],
      ],
    },
    {
      kind: 'text',
      text: "Here is how you make a new database, connect to it and look for tables. Type the lines one by one at the `postgres=#` prompt:",
    },
    {
      kind: 'example',
      lang: 'text',
      run: 'none',
      label: 'psql',
      code: `CREATE DATABASE shop;
\\c shop
\\dt`,
      output: `CREATE DATABASE
You are now connected to database "shop" as user "postgres".
Did not find any tables.`,
    },
    {
      kind: 'text',
      text: "`CREATE DATABASE` makes a new, empty database. After `\\\\c shop`, the prompt changes to `shop=#`. The new database has no tables yet, so `\\\\dt` finds none. Once a database has tables, `\\\\dt` lists them, and `\\\\d` describes one. This is what they show for the shop database of this course:",
    },
    {
      kind: 'example',
      lang: 'text',
      run: 'none',
      label: 'psql',
      code: `\\dt
\\d customers`,
      output: `             List of tables
 Schema |    Name     | Type  |  Owner
--------+-------------+-------+----------
 public | categories  | table | postgres
 public | customers   | table | postgres
 public | employees   | table | postgres
 public | order_items | table | postgres
 public | orders      | table | postgres
 public | products    | table | postgres
(6 rows)

                            Table "public.customers"
   Column   |  Type   | Collation | Nullable |             Default
------------+---------+-----------+----------+----------------------------------
 id         | integer |           | not null | generated by default as identity
 first_name | text    |           | not null |
 last_name  | text    |           | not null |
 email      | text    |           | not null |
 city       | text    |           |          |
 country    | text    |           | not null |
 joined_on  | date    |           | not null |
Indexes:
    "customers_pkey" PRIMARY KEY, btree (id)
    "customers_email_key" UNIQUE CONSTRAINT, btree (email)
Referenced by:
    TABLE "orders" CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customers(id)`,
    },
    {
      kind: 'text',
      text: "In the `Nullable` column, `not null` marks the columns that must always have a value. Only `city` may be empty. That is why two customers can have no city. The lines at the bottom list more rules of the table. For example, `UNIQUE` on `email` means that no two customers can have the same email address.",
    },
    {
      kind: 'callout',
      tone: 'plain',
      title: 'Meta-commands only work in psql',
      blocks: [
        {
          kind: 'text',
          text: "Commands like `\\\\dt` belong to psql, not to SQL. The examples on this site run SQL only, so meta-commands do not work there. Type `\\\\q` to leave psql when you are done.",
        },
      ],
    },
    {
      kind: 'heading',
      level: 3,
      text: 'Graphical tools',
    },
    {
      kind: 'text',
      text: "If you prefer clicking to typing, you can use a program with windows and buttons, called a **GUI** (graphical user interface). It shows your tables and lets you write and run SQL. Popular choices are:",
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        "**pgAdmin:** free, and made for PostgreSQL. The Windows installer includes it.",
        "**DBeaver:** free, and works with many kinds of databases.",
        "**DataGrip** and **TablePlus:** two other popular tools that work with many databases.",
        "**Visual Studio Code:** the code editor has extensions for PostgreSQL.",
      ],
    },
    {
      kind: 'text',
      text: "To connect, a GUI asks for the same details as psql:",
    },
    {
      kind: 'table',
      head: ['Setting', 'Value'],
      rows: [
        ['Host', '`localhost`, which means "this computer"'],
        ['Port', '`5432`'],
        ['User', '`postgres`'],
        ['Password', 'the password you chose when you installed PostgreSQL'],
        ['Database', '`postgres`, or a database you made, like `shop`'],
      ],
    },
    {
      kind: 'text',
      text: "To learn more, see the [psql page](https://www.postgresql.org/docs/current/app-psql.html) of the PostgreSQL documentation.",
      style: 'small',
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'Do you need to install PostgreSQL to run the examples in this course?',
        options: [
          'No, they run in your browser',
          'Yes, on every computer',
          'Only on Windows',
          'Only for the exercises',
        ],
        answer: 'No, they run in your browser',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'multiple_choice',
        prompt: 'In psql, which command lists the tables in the database you are connected to?',
        options: ['`\\\\dt`', '`\\\\l`', '`\\\\q`', '`SHOW TABLES;`'],
        answer: '`\\\\dt`',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        type: 'fill_code',
        prompt: 'In psql, connect to the database `shop`, then describe its `customers` table. Fill in the two meta-commands.',
        code: `[___] shop
[___] customers`,
        answers: [['\\c', '\\connect'], ['\\d', '\\d+']],
      },
    },
  ],
};
