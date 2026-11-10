import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { Observable, Subject, interval, merge, of, EMPTY } from 'rxjs';
import { takeUntil, map, catchError, tap, retry, delay } from 'rxjs/operators';
import { OrderEvent, OrderEventType } from '@domain/order.event';
import { OrderEventPort } from '@domain/ports/order.event.port';
import { EventEmitterService } from './event.emitter.service';

export interface OrderEventDTO {
  orderId: string;
  eventType: OrderEventType;
  payload?: Record<string, any>;
  timestamp?: string;
}

export interface PublishResult {
  success: boolean;
  eventId?: string;
  message?: string;
  timestamp: Date;
}

export interface StreamEvent {
  type: 'order-event' | 'heartbeat' | 'error';
  data: OrderEvent | { heartbeat: number } | { error: string };
  timestamp: Date;
}

@Injectable()
export class OrderEventService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventService.name);
  private readonly destroy$ = new Subject<void>();
  private eventsSubject = new Subject<OrderEvent>();
  private connectedClients = 0;
  private eventBuffer: OrderEvent[] = [];
  private maxBufferSize = 1000;
  private processingActive = false;
  private eventHistory: OrderEvent[] = [];

  constructor(
    @Inject('OrderEventPort') private readonly orderEventPort: OrderEventPort,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  async onModuleInit() {
    this.logger.log('Inicializando OrderEventService');
    this.startEventConsumption();
    this.startHeartbeat();
  }

  async onModuleDestroy() {
    this.logger.log('Deteniendo OrderEventService');
    this.destroy$.next();
    this.destroy$.complete();
    await this.flushBuffer();
  }

  async publishEvent(dto: OrderEventDTO): Promise<PublishResult> {
    const eventId = this.generateEventId();
    const timestamp = dto.timestamp ? new Date(dto.timestamp) : new Date();

    const event = new OrderEvent({
      id: eventId,
      orderId: dto.orderId,
      eventType: dto.eventType,
      payload: dto.payload || {},
      timestamp,
    });

    try {
      this.validateEvent(event);
      await this.orderEventPort.publish(event);
      this.eventHistory.push(event);
      this.eventEmitter.emit('event.published', event);
      this.logger.log(`Evento publicado: ${eventId} para orden ${dto.orderId}`);

      return {
        success: true,
        eventId,
        message: `Evento ${event.eventType} publicado exitosamente`,
        timestamp: new Date(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error al publicar evento: ${errorMessage}`, error);
      this.eventEmitter.emit('event.publish-failed', { event, error: errorMessage });

      return {
        success: false,
        eventId,
        message: `Error al publicar evento: ${errorMessage}`,
        timestamp: new Date(),
      };
    }
  }

  getOrderEvents(): Observable<StreamEvent> {
    this.connectedClients++;
    this.logger.log(`Cliente conectado a SSE. Total clientes: ${this.connectedClients}`);

    const heartbeat$ = interval(5000).pipe(
      map(() => ({
        type: 'heartbeat' as const,
        data: { heartbeat: Date.now() },
        timestamp: new Date(),
      })),
    );

    const events$ = this.eventsSubject.asObservable().pipe(
      map((event) => ({
        type: 'order-event' as const,
        data: event,
        timestamp: new Date(),
      })),
      catchError((error) => {
        this.logger.error('Error en stream de eventos:', error);
        return of({
          type: 'error' as const,
          data: { error: error instanceof Error ? error.message : 'Error desconocido' },
          timestamp: new Date(),
        });
      }),
      takeUntil(this.destroy$),
    );

    return merge(heartbeat$, events$).pipe(
      tap(() => {
        if (this.eventBuffer.length > 0 && !this.processingActive) {
          this.processBuffer();
        }
      }),
    );
  }

  private startEventConsumption() {
    this.orderEventPort.consume()
      .pipe(
        takeUntil(this.destroy$),
        tap((event) => {
          this.logger.debug(`Evento recibido de Kafka: ${event.id}`);
          this.handleIncomingEvent(event);
        }),
        retry({
          count: 3,
          delay: (error, retryCount) => {
            this.logger.warn(`Reintentando consumo de eventos. Intento ${retryCount}`);
            return of(null).pipe(delay(1000 * retryCount));
          },
        }),
        catchError((error) => {
          this.logger.error('Error fatal en consumo de eventos:', error);
          this.eventEmitter.emit('consumer.error', { error: error instanceof Error ? error.message : 'Error desconocido' });
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private startHeartbeat() {
    interval(30000)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.logger.debug('Heartbeat del servicio de eventos');
        }),
      )
      .subscribe();
  }

  private handleIncomingEvent(event: OrderEvent) {
    if (this.connectedClients > 0) {
      this.eventsSubject.next(event);
    } else {
      this.bufferEvent(event);
    }
    this.eventEmitter.emit('event.received', event);
  }

  private bufferEvent(event: OrderEvent) {
    if (this.eventBuffer.length >= this.maxBufferSize) {
      this.eventBuffer.shift();
    }
    this.eventBuffer.push(event);
    this.logger.debug(`Evento bufferizado. Buffer size: ${this.eventBuffer.length}`);
  }

  private async processBuffer() {
    this.processingActive = true;
    const eventsToProcess = [...this.eventBuffer];
    this.eventBuffer = [];

    for (const event of eventsToProcess) {
      this.eventsSubject.next(event);
    }

    this.processingActive = false;
  }

  private async flushBuffer() {
    if (this.eventBuffer.length > 0) {
      this.logger.log(`Vaciando buffer de ${this.eventBuffer.length} eventos`);
      await this.processBuffer();
    }
  }

  private validateEvent(event: OrderEvent): void {
    if (!event.orderId || event.orderId.trim() === '') {
      throw new Error('El orderId es obligatorio');
    }
    if (!event.eventType) {
      throw new Error('El eventType es obligatorio');
    }
    if (!Object.values(OrderEventType).includes(event.eventType)) {
      throw new Error(`Tipo de evento inválido: ${event.eventType}`);
    }
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  async initialize(): Promise<void> {
    this.logger.log('Inicializando servicio de eventos de órdenes');
    this.processingActive = false;
    this.eventBuffer = [];
    this.connectedClients = 0;
  }

  async shutdown(): Promise<void> {
    this.logger.log('Cerrando servicio de eventos de órdenes');
    await this.flushBuffer();
    this.eventsSubject.complete();
  }

  getConnectedClients(): number {
    return this.connectedClients;
  }

  getBufferSize(): number {
    return this.eventBuffer.length;
  }

  getEventHistory(): OrderEvent[] {
    return [...this.eventHistory];
  }

  clearHistory(): void {
    this.eventHistory = [];
  }
}