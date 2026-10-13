import { ApplicationConfig } from '@angular/core';
import {
  provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      APP_ROUTES,
      withComponentInputBinding(),
      // Lesson pages receive :course from the parent route as an input too.
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      // New lesson -> top of page; Back -> where the reader was.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideAnimationsAsync(),
  ],
};
