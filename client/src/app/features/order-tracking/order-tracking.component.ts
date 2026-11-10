import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { OrderEventService } from '../../../services/order-event.service';
import { OrderEvent } from '../../shared/models/order-event.model';
import { OrderEventCardComponent } from '../../shared/order-event-card/order-event-card.component';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    OrderEventCardComponent
  ],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  events = signal<OrderEvent[]>([]);
  isLoading = signal<boolean>(false);
  connectionStatus = signal<'connected' | 'disconnected' | 'connecting'>('disconnected');
  lastUpdate = signal<Date | null>(null);
  
  eventCount = computed(() => this.events().length);
  hasEvents = computed(() => this.events().length > 0);
  
  private eventSource: EventSource | null = null;

  constructor(
    private orderEventService: OrderEventService,
    private snackBar: MatSnackBar
  ) {
    effect(() => {
      const count = this.eventCount();
      console.log(`[OrderTracking] Event count updated: ${count}`);
    });
  }

  ngOnInit(): void {
    this.connectToEventStream();
  }

  ngOnDestroy(): void {
    this.disconnectFromEventStream();
    this.destroy$.next();
    this.destroy$.complete();
  }

  connectToEventStream(): void {
    if (this.connectionStatus() === 'connected' || this.connectionStatus() === 'connecting') {
      return;
    }

    this.connectionStatus.set('connecting');
    this.isLoading.set(true);

    this.orderEventService.consumeOrderEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event) => this.handleNewEvent(event),
        error: (err) => this.handleConnectionError(err),
        complete: () => this.handleConnectionComplete()
      });
  }

  disconnectFromEventStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.connectionStatus.set('disconnected');
  }

  private handleNewEvent(event: OrderEvent): void {
    this.isLoading.set(false);
    this.connectionStatus.set('connected');
    this.lastUpdate.set(new Date());
    
    const currentEvents = this.events();
    const updatedEvents = [event, ...currentEvents].slice(0, 50);
    this.events.set(updatedEvents);
    
    this.snackBar.open(
      `Nuevo evento: ${event.eventType}`,
      'Cerrar',
      { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' }
    );
  }

  private handleConnectionError(error: any): void {
    console.error('[OrderTracking] Connection error:', error);
    this.connectionStatus.set('disconnected');
    this.isLoading.set(false);
    
    this.snackBar.open(
      'Error de conexión. Reconectando...',
      'Reintentar',
      { duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' }
    ).onAction().subscribe(() => {
      this.connectToEventStream();
    });
  }

  private handleConnectionComplete(): void {
    this.connectionStatus.set('disconnected');
    this.isLoading.set(false);
    console.log('[OrderTracking] Event stream connection closed');
  }

  clearEvents(): void {
    this.events.set([]);
    this.snackBar.open('Eventos limpiados', 'OK', { duration: 2000 });
  }

  reconnect(): void {
    this.disconnectFromEventStream();
    setTimeout(() => this.connectToEventStream(), 500);
  }
}