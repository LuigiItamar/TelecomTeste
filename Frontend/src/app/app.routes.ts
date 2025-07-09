import { Routes } from '@angular/router';
import { OperadoraComponent } from './operadora/operadora.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContratoComponent } from './contrato/contrato.component';
import { FaturaComponent } from './fatura/fatura.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'operadora', component: OperadoraComponent },
  { path: 'contrato', component: ContratoComponent },
  { path: 'fatura', component: FaturaComponent },
];
