import { Component } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div style="display: flex; height: 100vh;">
      <nav style="width: 220px; background: #f8f9fa; padding: 2rem 1rem; box-shadow: 2px 0 8px #0001;">
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 1rem;">
            <a routerLink="/operadora" routerLinkActive="active" style="text-decoration: none; color: #333; font-weight: 500;">Operadora</a>
          </li>
          <li style="margin-bottom: 1rem;">
            <a routerLink="/dashboard" routerLinkActive="active" style="text-decoration: none; color: #333; font-weight: 500;">Dashboard</a>
          </li>
          <!-- Adicione mais itens de navegação aqui -->
        </ul>
      </nav>
      <main style="flex: 1; padding: 2rem; overflow-y: auto;">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {}
