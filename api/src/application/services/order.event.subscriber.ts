import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject, filter, share, takeUntil, catchError, of } from 'rxjs';
import { OrderEvent, OrderEventType } from '../../domain/order.event';
import { OrderEventPort } from '../../domain/ports/order.event.port';

export interface SubscriptionFilter {
  orderId?: string;
  eventTypes?: OrderEventType[];
  fromDate?: Date;
}

@Injectable()
export class OrderEventSubscriber implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventSubscriber.name);
  private readonly eventsSubject = new Subject<OrderEvent>();
  private readonly destroy$ = new Subject<void>();
  private isInitialized = false;
  private kafkaPort: OrderEventPort;
  private activeSubscriptions = 0;

  constructor(private readonly kafkaConsumer: OrderEventPort) {
    this.kafkaPort = kafkaConsumer;
  }

  async onModuleInit(): Promise<void> {
    this.isInitialized = true;
    this.logger.log('OrderEventSubscriber inicializado correctamente');
    this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    this.isInitialized = false;
    this.destroy$.next();
    this.destroy$.complete();
    this.eventsSubject.complete();
    this.logger.log('OrderEventSubscriber detenido');
  }

  private startConsuming(): void {
    const consumeMethod = (this.kafkaPort as any).consume;
    if (!consumeMethod || typeof consumeMethod !== 'function') {
      this.logger.warn('El puerto de Kafka no implementa consume()');
      return;
    }

    consumeMethod.call(this.kafkaPort)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error(`Error en el consumo de Kafka: ${errorMessage}`);
          return of(null as unknown as OrderEvent);
        }),
        filter((event): event is OrderEvent => event !== null),
      )
      .subscribe({
        next: (event) => {
          this.handleIncomingEvent(event);
        },
        error: (error) => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error(`Error en el flujo de consumo: ${errorMessage}`);
        },
      });
  }

  private handleIncomingEvent(event: OrderEvent): void {
    const eventId = (event as any).id || (event as any).eventId || 'unknown';
    const eventType = (event as any).type || (event as any).eventType || 'UNKNOWN';
    this.logger.debug(`Evento recibido: ${eventId} - Tipo: ${eventType}`);
    this.eventsSubject.next(event);
  }

  subscribe(filter?: SubscriptionFilter): Observable<OrderEvent> {
    this.activeSubscriptions++;
    this.logger.debug(`Nueva suscripción activa. Total: ${this.activeSubscriptions}`);

    let stream = this.eventsSubject.asObservable().pipe(
      share(),
    );

    if (filter) {
      if (filter.orderId) {
        stream = stream.pipe(
          filter((event) => (event as any).orderId === filter.orderId),
        );
      }

      if (filter.eventTypes && filter.eventTypes.length > 0) {
        stream = stream.pipe(
          filter((event) => filter.eventTypes!.includes((event as any).type)),
        );
      }

      if (filter.fromDate) {
        stream = stream.pipe(
          filter((event) => (event as any).timestamp >= filter.fromDate!),
        );
      }
    }

    return stream;
  }

  subscribeToOrderCreated(): Observable<OrderEvent> {
    return this.subscribe({ eventTypes: [OrderEventType.ORDER_CREATED] });
  }

  subscribeToOrderUpdated(): Observable<OrderEvent> {
    return this.subscribe({ eventTypes: [OrderEventType.ORDER_UPDATED] });
  }

  subscribeToOrderCancelled(): Observable<OrderEvent> {
    return this.subscribe({ eventTypes: [OrderEventType.ORDER_CANCELLED] });
  }

  subscribeToOrderCompleted(): Observable<OrderEvent> {
    return this.subscribe({ eventTypes: [OrderEventType.ORDER_COMPLETED] });
  }

  subscribeByOrderId(orderId: string): Observable<OrderEvent> {
    return this.subscribe({ orderId });
  }

  getEventStream(): Observable<OrderEvent> {
    return this.eventsSubject.asObservable();
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  getActiveSubscriptions(): number {
    return this.activeSubscriptions;
  }
}