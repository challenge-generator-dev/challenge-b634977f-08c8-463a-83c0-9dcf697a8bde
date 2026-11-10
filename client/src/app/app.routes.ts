import { Routes } from '@angular/router';
import { OrderTrackingComponent } from './features/order-tracking/order-tracking.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrderTrackingComponent,
    title: 'Seguimiento de Órdenes'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];