import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent,
      ),
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      // P2+ routes — placeholders for future migration
      // { path: 'explorer', loadChildren: () => import('./features/explorer/explorer.routes').then(m => m.EXPLORER_ROUTES) },
      // { path: 'search', loadChildren: () => import('./features/search/search.routes').then(m => m.SEARCH_ROUTES) },
      // { path: 'topics', loadChildren: () => import('./features/topics/topics.routes').then(m => m.TOPICS_ROUTES) },
      // { path: 'console', loadChildren: () => import('./features/console/console.routes').then(m => m.CONSOLE_ROUTES) },
      // { path: 'coorporate', loadChildren: () => import('./features/coorporate/coorporate.routes').then(m => m.COORPORATE_ROUTES) },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '404' },
];
