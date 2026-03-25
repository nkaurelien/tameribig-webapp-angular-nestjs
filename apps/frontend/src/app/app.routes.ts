import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

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
      // Routes publiques
      {
        path: 'home',
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'explorer',
        loadChildren: () =>
          import('./features/explorer/explorer.routes').then(
            (m) => m.EXPLORER_ROUTES,
          ),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./features/search/search.routes').then(
            (m) => m.SEARCH_ROUTES,
          ),
      },
      {
        path: 'topics',
        loadChildren: () =>
          import('./features/topics/topics.routes').then(
            (m) => m.TOPICS_ROUTES,
          ),
      },
      // Routes protégées
      {
        path: 'console',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/console/console.routes').then(
            (m) => m.CONSOLE_ROUTES,
          ),
      },
      {
        path: 'info',
        loadChildren: () =>
          import('./features/info/info.routes').then((m) => m.INFO_ROUTES),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '404' },
];
