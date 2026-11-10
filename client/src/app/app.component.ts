import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <mat-icon>local_shipping</mat-icon>
      <span class="app-title">Order Tracking</span>
      <span class="spacer"></span>
      <button mat-icon-button aria-label="Notifications">
        <mat-icon>notifications</mat-icon>
      </button>
      <button mat-icon-button aria-label="User menu">
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>
    <main class="app-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .app-title {
      margin-left: 12px;
      font-weight: 500;
      font-size: 1.25rem;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .app-content {
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
      padding: 24px;
    }
  `]
})
export class AppComponent {
  title = 'Order Tracking Client';

  constructor() {
    console.log('Order Tracking Client initialized');
  }
}