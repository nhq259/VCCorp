import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './components/admin-layout/admin-layout';
import { ProductsListComponent } from './pages/products-list/products-list';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'products' },
      { path: 'products', component: ProductsListComponent }
    ]
  }
];
