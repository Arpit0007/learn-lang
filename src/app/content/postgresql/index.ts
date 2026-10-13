import { Course } from '../../shared/content';
import { SEED_SQL } from './seed';
import { HOME } from './home';
import { INSTALL } from './install';
import { SELECT } from './select';
import { WHERE } from './where';
import { ORDER_LIMIT } from './order-limit';
import { NULL } from './null';
import { FUNCTIONS } from './functions';
import { DATES } from './dates';
import { CASE } from './case';
import { AGGREGATES } from './aggregates';
import { GROUP_BY } from './group-by';
import { INNER_JOIN } from './inner-join';
import { OUTER_JOINS } from './outer-joins';
import { SELF_CROSS_JOIN } from './self-cross-join';
import { SUBQUERIES } from './subqueries';
import { SET_OPERATIONS } from './set-operations';
import { CREATE_TABLE } from './create-table';
import { INSERT } from './insert';
import { UPDATE_DELETE } from './update-delete';
import { CONSTRAINTS } from './constraints';
import { ALTER_TABLE } from './alter-table';
import { DESIGN } from './design';
import { VIEWS } from './views';
import { CTE } from './cte';
import { WINDOW_FUNCTIONS } from './window-functions';
import { JSON as JSON_LESSON } from './json'; // aliased so it doesn't hide the built-in JSON
import { ARRAYS_ENUMS } from './arrays-enums';
import { FULL_TEXT_SEARCH } from './full-text-search';
import { TRANSACTIONS } from './transactions';
import { FUNCTIONS_PLPGSQL } from './functions-plpgsql';
import { TRIGGERS } from './triggers';
import { USERS_PERMISSIONS } from './users-permissions';
import { INDEXES } from './indexes';
import { PERFORMANCE } from './performance';
import { BACKUP_RESTORE } from './backup-restore';
import { FROM_CODE } from './from-code';
import { PARTITIONING_REPLICATION } from './partitioning-replication';
import { INTERVIEW } from './interview';
import { PROJECTS } from './projects';

/** PostgreSQL from scratch. Every SQL example runs in real PostgreSQL (PGlite) in the browser, on a fresh copy of the shop database. */
export const POSTGRESQL: Course = {
  slug: 'postgresql',
  menuLabel: 'PostgreSQL',
  title: 'PostgreSQL Tutorial',
  description: 'Learn SQL and PostgreSQL from your first SELECT to joins, transactions, indexes and production. Every example runs real PostgreSQL in your browser.',
  exampleLang: 'sql',
  exampleRun: 'inline',
  setup: SEED_SQL,
  groups: [
    { title: 'Start here', lessons: [HOME, INSTALL] },
    { title: 'Level 1 · First queries', lessons: [SELECT, WHERE, ORDER_LIMIT, NULL, FUNCTIONS, DATES, CASE] },
    { title: 'Level 2 · Summarise and combine', lessons: [AGGREGATES, GROUP_BY, INNER_JOIN, OUTER_JOINS, SELF_CROSS_JOIN, SUBQUERIES, SET_OPERATIONS] },
    { title: 'Level 3 · Create and change', lessons: [CREATE_TABLE, INSERT, UPDATE_DELETE, CONSTRAINTS, ALTER_TABLE, DESIGN] },
    { title: 'Level 4 · Powerful queries', lessons: [VIEWS, CTE, WINDOW_FUNCTIONS, JSON_LESSON, ARRAYS_ENUMS, FULL_TEXT_SEARCH] },
    { title: 'Level 5 · Inside the database', lessons: [TRANSACTIONS, FUNCTIONS_PLPGSQL, TRIGGERS, USERS_PERMISSIONS] },
    { title: 'Level 6 · Speed and production', lessons: [INDEXES, PERFORMANCE, BACKUP_RESTORE, FROM_CODE, PARTITIONING_REPLICATION] },
    { title: 'Reference', lessons: [INTERVIEW, PROJECTS] },
  ],
};
