/**
 * Shows values the way psql prints them. PGlite would otherwise turn dates and
 * timestamps into JS Dates (shifted by the browser's time zone), booleans into
 * true/false, and arrays/JSON into JS objects. These type OIDs are kept as
 * PostgreSQL's own text instead.
 */
const RAW_TYPES = [
  16,                         // boolean      → t / f
  114, 3802,                  // json, jsonb  → as stored
  1082, 1083, 1114, 1184, 1186, 1266, // date, time, timestamp, timestamptz, interval, timetz
  1000, 1005, 1007, 1009, 1015, 1016, 1021, 1022, 1028, 1182, 1183, 1185, 1187, 1231, 1270, 2951, 3807, // arrays
  2950,                       // uuid
  869, 650, 829,              // inet, cidr, macaddr
  3614, 3615,                 // tsvector, tsquery
  3904, 3906, 3908, 3910, 3912, 3926, // ranges
] as const;

const identity = (value: string) => value;

/** PGlite `parsers` option: these types stay as PostgreSQL text. */
export const RAW_TEXT_PARSERS: Record<number, (value: string) => string> =
  Object.fromEntries(RAW_TYPES.map((oid) => [oid, identity]));

/** One cell as display text; `null` stays null so the UI can show NULL distinctly. */
export function formatCell(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'bigint') return String(value);
  if (typeof value === 'boolean') return value ? 't' : 'f';
  if (value instanceof Uint8Array) return '\\x' + Array.from(value, (b) => b.toString(16).padStart(2, '0')).join('');
  if (value instanceof Date) return value.toISOString();
  try { return JSON.stringify(value); } catch { return String(value); }
}
