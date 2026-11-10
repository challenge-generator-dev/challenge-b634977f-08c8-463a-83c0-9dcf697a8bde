import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map, catchError, retry, takeUntil, tap } from 'rxjs/operators';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEvent {
  eventId: string;
  eventType: 'ORDER_CREATED' | 'ORDER_UPDATED' | 'ORDER_CANCELLED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED';
  orderId: string;
  timestamp: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  source: string;
}

export interface OrderEventDTO {
  eventType: string;
  orderId: string;
  status: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderEventService implements OnDestroy {
  private readonly API_URL = 'http://localhost:3000';
  private readonly ENDPOINT = `${this.API_URL}/orders/events`;

  private eventSource: EventSource | null = null;
  private destroy$ = new Subject<void>();
  private connectionStatus$ = new BehaviorSubject<'connected' | 'disconnected' | 'connecting'>('disconnected');

  private orderEvents = signal<OrderEvent[]>([]);
  private lastEvent = signal<OrderEvent | null>(null);
  private isStreaming = signal<boolean>(false);

  readonly events = computed(() => this.orderEvents());
  readonly latestEvent = computed(() => this.lastEvent());
  readonly streaming = computed(() => this.isStreaming());
  readonly connectionStatus = computed(() => this.connectionStatus$.value);

  constructor(private http: HttpClient) {}

  consumeOrderEvents(): Observable<OrderEvent> {
    this.connectionStatus$.next('connecting');
    this.isStreaming.set(true);

    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(this.ENDPOINT);

    const eventSubject = new Subject<OrderEvent>();

    this.eventSource.onopen = () => {
      this.connectionStatus$.next('connected');
      console.log('[OrderEventService] SSE connection established');
    };

    this.eventSource.onerror = (error) => {
      console.error('[OrderEventService] SSE connection error:', error);
      this.connectionStatus$.next('disconnected');
      this.isStreaming.set(false);
      eventSubject.error(error);
    };

    this.eventSource.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data) as OrderEvent;
        this.handleNewEvent(data);
        eventSubject.next(data);
      } catch (parseError) {
        console.error('[OrderEventService] Failed to parse event data:', parseError);
      }
    });

    return eventSubject.asObservable().pipe(
      takeUntil(this.destroy$)
    );
  }

  private handleNewEvent(event: OrderEvent): void {
    this.orderEvents.update(events => [event, ...events]);
    this.lastEvent.set(event);
  }

  publishOrderEvent(eventDto: OrderEventDTO): Observable<{ accepted: boolean; eventId: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<{ accepted: boolean; eventId: string }>(
      this.ENDPOINT,
      eventDto,
      { headers }
    ).pipe(
      retry({ count: 3, delay: 1000 }),
      tap(response => {
        console.log('[OrderEventService] Event published successfully:', response.eventId);
      }),
      catchError(error => {
        console.error('[OrderEventService] Failed to publish event:', error);
        throw error;
      })
    );
  }

  getOrderEvents(): Observable<OrderEvent[]> {
    return this.http.get<OrderEvent[]>(this.ENDPOINT).pipe(
      catchError(error => {
        console.error('[OrderEventService] Failed to fetch order events:', error);
        return [];
      })
    );
  }

  clearEvents(): void {
    this.orderEvents.set([]);
    this.lastEvent.set(null);
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isStreaming.set(false);
    this.connectionStatus$.next('disconnected');
    console.log('[OrderEventService] SSE connection closed');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}