import { Course } from '../../shared/content';
import { HOW_TO_USE } from './how-to-use';
import { ROADMAP } from './roadmap';
import { STUDY_PLAN } from './study-plan';
import { M1_WHAT_IS_NESTJS } from './m1-what-is-nestjs';
import { M2_CLI_STRUCTURE } from './m2-cli-structure';
import { M3_BOOTSTRAP } from './m3-bootstrap';
import { M4_MODULES } from './m4-modules';
import { M5_CONTROLLERS } from './m5-controllers';
import { M6_PROVIDERS_DI } from './m6-providers-di';
import { M7_DTOS_VALIDATION } from './m7-dtos-validation';
import { M8_EXCEPTIONS } from './m8-exceptions';
import { M9_REQUEST_PIPELINE } from './m9-request-pipeline';
import { M10_GUARDS } from './m10-guards';
import { M11_INTERCEPTORS } from './m11-interceptors';
import { M12_PIPES } from './m12-pipes';
import { M13_CUSTOM_DECORATORS } from './m13-custom-decorators';
import { M14_TYPEORM } from './m14-typeorm';
import { M15_MIGRATIONS_RELATIONS } from './m15-migrations-relations';
import { M16_TRANSACTIONS_PERFORMANCE } from './m16-transactions-performance';
import { M17_AUTH_JWT } from './m17-auth-jwt';
import { M18_REFRESH_RBAC } from './m18-refresh-rbac';
import { M19_CONFIG_ARCHITECTURE } from './m19-config-architecture';
import { M20_INTERNALS_DYNAMIC_MODULES } from './m20-internals-dynamic-modules';
import { M21_FILES_EMAIL_APIS } from './m21-files-email-apis';
import { M22_CACHING_REDIS } from './m22-caching-redis';
import { M23_QUEUES_SCHEDULING } from './m23-queues-scheduling';
import { M24_WEBSOCKETS } from './m24-websockets';
import { M25_TESTING } from './m25-testing';
import { M26_SECURITY } from './m26-security';
import { M27_PERFORMANCE } from './m27-performance';
import { M28_SWAGGER_OBSERVABILITY } from './m28-swagger-observability';
import { M29_DOCKER_CICD_DEPLOY } from './m29-docker-cicd-deploy';
import { M30_MICROSERVICES } from './m30-microservices';
import { PROJECTS } from './projects';
import { INTERVIEW } from './interview';

/**
 * "The NestJS Ladder", for NestJS 11. Modules 1–9 are imported from the author's course artifact;
 * Modules 10–30 and the reference pages continue it in the same shape.
 */
export const NESTJS: Course = {
  slug: 'nestjs',
  menuLabel: 'NestJS',
  title: 'The NestJS Ladder',
  description: 'The NestJS Ladder: backend Node.js for TypeScript and Angular developers. From your first project to databases, login, queues, testing, Docker and microservices.',
  exampleLang: 'typescript',
  exampleRun: 'none',
  groups: [
    { title: "Start here", lessons: [HOW_TO_USE, ROADMAP, STUDY_PLAN] },
    { title: "Level 1 · Fundamentals", lessons: [M1_WHAT_IS_NESTJS, M2_CLI_STRUCTURE, M3_BOOTSTRAP] },
    { title: "Level 2 · The three building blocks", lessons: [M4_MODULES, M5_CONTROLLERS, M6_PROVIDERS_DI] },
    { title: "Level 3 · Contracts and the pipeline", lessons: [M7_DTOS_VALIDATION, M8_EXCEPTIONS, M9_REQUEST_PIPELINE] },
    { title: "Level 4 · The request pipeline", lessons: [M10_GUARDS, M11_INTERCEPTORS, M12_PIPES, M13_CUSTOM_DECORATORS] },
    {
      title: "Level 5 · Data and identity",
      lessons: [M14_TYPEORM, M15_MIGRATIONS_RELATIONS, M16_TRANSACTIONS_PERFORMANCE, M17_AUTH_JWT, M18_REFRESH_RBAC],
    },
    {
      title: "Level 6 · Real systems",
      lessons: [
        M19_CONFIG_ARCHITECTURE, M20_INTERNALS_DYNAMIC_MODULES, M21_FILES_EMAIL_APIS,
        M22_CACHING_REDIS, M23_QUEUES_SCHEDULING, M24_WEBSOCKETS,
      ],
    },
    {
      title: "Level 7 · Craft, scale and ship",
      lessons: [
        M25_TESTING, M26_SECURITY, M27_PERFORMANCE,
        M28_SWAGGER_OBSERVABILITY, M29_DOCKER_CICD_DEPLOY, M30_MICROSERVICES,
      ],
    },
    { title: "Reference", lessons: [PROJECTS, INTERVIEW] },
  ],
};
