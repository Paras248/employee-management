import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  {
    path: 'employees',
    loadComponent: () =>
      import('./components/employee/employee-list/employee-list').then(
        (m) => m.EmployeeListComponent
      ),
  },
  { path: '**', redirectTo: '/employees' },
];
