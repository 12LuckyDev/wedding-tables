import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '**',
    loadComponent: () =>
      import('./components/wedding/wedding.component').then(
        (c) => c.WeddingComponent
      ),
  },
];
