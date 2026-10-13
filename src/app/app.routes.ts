import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    // Full-screen editor, outside the course layout (no sidebar).
    path: ':course/:lesson/try/:n',
    loadComponent: () => import('./features/try-it/try-it-page.component').then((m) => m.TryItPageComponent),
  },
  {
    // Unknown course slugs render "Page not found" inside the layout.
    path: ':course',
    loadComponent: () => import('./features/course/course-layout.component').then((m) => m.CourseLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/course/lesson-page.component').then((m) => m.LessonPageComponent) },
      { path: ':lesson', loadComponent: () => import('./features/course/lesson-page.component').then((m) => m.LessonPageComponent) },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
