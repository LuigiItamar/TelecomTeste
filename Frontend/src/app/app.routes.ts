import { Routes } from '@angular/router';
import { OperadoraComponent } from './operadora/operadora.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'operadora', component: OperadoraComponent },
];
