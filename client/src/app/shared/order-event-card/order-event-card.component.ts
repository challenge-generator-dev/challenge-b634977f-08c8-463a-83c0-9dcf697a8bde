import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface OrderEvent {
  id: string;
  orderId: string;
  eventType: 'CREATED' | 'UPDATED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  timestamp: string;
  data: Record<string, unknown>;
  source: string;
}

@Component({
  selector: 'app-order-event-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-event-card.component.html',
  styleUrls: ['./order-event-card.component.scss']
})
export class OrderEventCardComponent {
  @Input({ required: true }) event!: OrderEvent;

  get eventTypeLabel(): string {
    const labels: Record<string, string> = {
      'CREATED': 'Creada',
      'UPDATED': 'Actualizada',
      'PROCESSING': 'Procesando',
      'SHIPPED': 'Enviada',
      'DELIVERED': 'Entregada',
      'CANCELLED': 'Cancelada'
    };
    return labels[this.event.eventType] || this.event.eventType;
  }

  get eventTypeIcon(): string {
    const icons: Record<string, string> = {
      'CREATED': 'add_circle',
      'UPDATED': 'edit',
      'PROCESSING': 'sync',
      'SHIPPED': 'local_shipping',
      'DELIVERED': 'check_circle',
      'CANCELLED': 'cancel'
    };
    return icons[this.event.eventType] || 'info';
  }

  get eventTypeColor(): string {
    const colors: Record<string, string> = {
      'CREATED': 'primary',
      'UPDATED': 'accent',
      'PROCESSING': 'accent',
      'SHIPPED': 'primary',
      'DELIVERED': 'primary',
      'CANCELLED': 'warn'
    };
    return colors[this.event.eventType] || 'primary';
  }

  get formattedTimestamp(): string {
    const date = new Date(this.event.timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getSourceLabel(source: string): string {
    const sources: Record<string, string> = {
      'order-service': 'Servicio de Órdenes',
      'notification-service': 'Servicio de Notificaciones',
      'payment-service': 'Servicio de Pagos',
      'shipping-service': 'Servicio de Envíos'
    };
    return sources[source] || source;
  }

  trackByKey(index: number, item: { key: string }): string {
    return item.key;
  }

  getDataKeys(): Array<{ key: string }> {
    return Object.keys(this.event.data || {}).map(key => ({ key }));
  }
}