// Checks lesson files against the LinguaLeap content rules (used while writing content, and by CI). Run from the repo root:
//   node tools/check-lessons.mjs [--web] [--sql] <lesson.ts> [more lesson files...]
//   --web : HTML/CSS course rules (full documents, no <script>, only example.com URLs, assets exist, safe forms)
//   --sql : PostgreSQL course: runs every SQL example against the course sample database (PGlite)
// Exit code 1 if anything fails.
import { createRequire } from 'node:module';
import { existsSync, readdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(resolve('package.json'));
const esbuild = require('esbuild');

const args = process.argv.slice(2);
const web = args.includes('--web');
const sql = args.includes('--sql');
// Expand "dir/*.ts" ourselves (cmd.exe on Windows does not), and skip files that are not lessons.
const NOT_LESSONS = /(^|[\\/])(index|seed)\.ts$|\.spec\.ts$/;
const files = args.filter((a) => !a.startsWith('--')).flatMap((a) => {
  if (!a.includes('*')) return [a];
  const slash = a.lastIndexOf('/');
  const dir = slash >= 0 ? a.slice(0, slash + 1) : './';
  const pattern = a.slice(slash + 1).split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*');
  const re = new RegExp('^' + pattern + '$');
  return existsSync(dir) ? readdirSync(dir).filter((n) => re.test(n)).map((n) => dir + n) : [];
}).filter((f) => !NOT_LESSONS.test(f));
if (!files.length) { console.error('usage: node check-lessons.mjs [--web] [--sql] <lesson.ts>...'); process.exit(2); }

const GAP = '[___]';
let failures = 0;
const fail = (where, msg) => { failures++; console.log(`  ✗ ${where}: ${msg}`); };

function load(file) {
  const out = esbuild.buildSync({
    entryPoints: [file], bundle: true, write: false, format: 'cjs', platform: 'node', logLevel: 'silent',
  });
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', out.outputFiles[0].text)(mod, mod.exports, require);
  return mod.exports;
}

function walk(blocks, visit) {
  for (const b of blocks) { visit(b); if (b.kind === 'callout' || b.kind === 'reveal') walk(b.blocks, visit); }
}

// Simple rich-text sanity: unescaped markers must pair up.
function richProblems(text) {
  const plain = text.replace(/\\./g, '').replace(/`[^`]*`/g, '');
  const probs = [];
  if ((plain.match(/`/g) || []).length % 2) probs.push('odd number of backticks');
  if ((plain.match(/\*\*/g) || []).length % 2) probs.push('unpaired **');
  if (/<\/?[a-z][a-z0-9-]*[\s>]/i.test(plain)) probs.push('HTML tag outside backticks');
  return probs;
}

let pg = null;
async function sqlBase(seedSql) {
  if (pg) return pg;
  const { PGlite } = await import(pathToFileURL(resolve('node_modules/@electric-sql/pglite/dist/index.js')).href);
  const { RAW_TEXT_PARSERS } = load('src/app/blocks/sql/sql-format.ts');
  const base = await PGlite.create({ parsers: RAW_TEXT_PARSERS });
  await base.exec(seedSql);
  pg = base;
  return pg;
}

for (const file of files) {
  console.log(`\n${basename(file)}`);
  let exports;
  try { exports = load(file); } catch (e) { fail(basename(file), 'does not compile: ' + (e.errors?.[0]?.text ?? e.message)); continue; }
  const lessons = Object.values(exports).filter((v) => v && typeof v === 'object' && 'slug' in v && Array.isArray(v.blocks));
  if (!lessons.length) { fail(basename(file), 'exports no Lesson'); continue; }

  for (const lesson of lessons) {
    const counts = {};
    const all = [];
    walk(lesson.blocks, (b) => { all.push(b); counts[b.kind] = (counts[b.kind] || 0) + 1; });
    const where = (b) => `${lesson.slug} ${b.kind}${b.label ? ' ' + b.label : ''}`;

    if (!lesson.title?.trim()) fail(lesson.slug, 'missing title');
    for (const b of all) {
      const texts = b.kind === 'text' || b.kind === 'heading' ? [b.text] : b.kind === 'list' ? b.items : b.kind === 'table' ? [...b.head, ...b.rows.flat()]
        : b.kind === 'quiz' ? [b.question, b.why, ...b.options] : b.kind === 'callout' ? [b.title ?? ''] : b.kind === 'reveal' ? [b.title] : [];
      for (const t of texts) for (const p of richProblems(t ?? '')) fail(where(b), `${p} in "${String(t).slice(0, 70)}"`);

      if (b.kind === 'example' && !b.code?.trim()) fail(where(b), 'empty code');
      if ((b.kind === 'callout' || b.kind === 'reveal') && !b.blocks.length) fail(where(b), 'no content');
      if (b.kind === 'quiz' && !(Number.isInteger(b.answer) && b.answer >= 0 && b.answer < b.options.length && b.why?.trim())) fail(where(b), 'bad answer index or empty why');
      if (b.kind === 'exercise') {
        const ex = b.exercise;
        if (ex.type === 'fill_code') {
          const gaps = ex.code.split(GAP).length - 1;
          if (gaps < 1 || gaps !== ex.answers.length) fail(where(b), `${gaps} gaps but ${ex.answers.length} answers`);
          ex.answers.forEach((a, i) => { const v = Array.isArray(a) ? a : [a]; if (!v.length || v.some((x) => x !== x.trim() || !x)) fail(where(b), `gap ${i + 1}: answers must be non-empty and trimmed`); });
        } else if (ex.type === 'multiple_choice') {
          if (!ex.options.includes(ex.answer)) fail(where(b), 'answer is not one of the options');
        } else fail(where(b), 'unknown exercise type ' + ex.type);
      }
      if (b.kind === 'example' && web && (b.run ?? 'tryit') !== 'none') {
        if (!/^<!DOCTYPE html>/i.test(b.code.trimStart())) fail(where(b), 'runnable example must start with <!DOCTYPE html>');
        if (/<script/i.test(b.code)) fail(where(b), 'contains <script>');
      }
      if (b.kind === 'example' && web) {
        for (const m of b.code.matchAll(/\/assets\/img\/([\w.-]+)/g)) if (!existsSync(resolve('src/assets/img', m[1]))) fail(where(b), 'missing image ' + m[1]);
        for (const m of b.code.matchAll(/(?:href|src|action|srcset)\s*=\s*"(https?:[^"]*)"/g)) if (!/^https:\/\/example\.com(\/|$)/.test(m[1])) fail(where(b), 'external URL ' + m[1]);
        if (/<form/i.test(b.code) && (b.run ?? 'tryit') !== 'none' && !/preventDefault\(\)/.test(b.code)) fail(where(b), '<form> without onsubmit="event.preventDefault()"');
      }
    }

    // Run SQL examples against the sample database.
    if (sql) {
      const { SEED_SQL } = load('src/app/content/postgresql/seed.ts');
      const { runSql } = load('src/app/blocks/sql/run-sql.ts');
      const base = await sqlBase(SEED_SQL);
      for (const b of all.filter((x) => x.kind === 'example' && (x.lang ?? 'sql') === 'sql' && (x.run ?? 'inline') !== 'none')) {
        const db = await base.clone();
        const result = await runSql(db, (b.setup ? b.setup + ';\n' : '') + b.code, { setupStatements: b.setup ? countStatements(load, b.setup) : 0 });
        await db.close();
        const err = result.find((r) => r.error);
        if (err && !b.expectError) fail(where(b), `SQL error in statement ${err.index}: ${err.error.message}`);
        if (!err && b.expectError) fail(where(b), 'expectError is set but the SQL ran without an error');
        console.log(`  · ${b.label ?? '(example)'}${b.expectError ? ' [expects error]' : ''}`);
        for (const r of result) {
          if (r.error) console.log(`      ERROR: ${r.error.message}`);
          else if (r.fields.length) console.log(`      ${r.fields.join(' | ')}  →  ${r.rows.length} row(s)` + r.rows.slice(0, 4).map((row) => '\n        ' + row.map((v) => v ?? 'NULL').join(' | ')).join('') + (r.rows.length > 4 ? '\n        …' : ''));
          else console.log(`      ${r.summary}`);
          for (const n of r.notices) console.log(`      NOTICE: ${n}`);
        }
      }
    }
    console.log('  ' + Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', '));
  }
}

function countStatements(loadFn, text) {
  const { splitSql } = loadFn('src/app/blocks/sql/split-sql.ts');
  return splitSql(text).length;
}

console.log(failures ? `\n${failures} problem(s) found.` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
