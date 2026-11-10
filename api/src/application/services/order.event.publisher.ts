import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { OrderEvent, OrderEventType } from '../../domain/order.event';
import { OrderEventPort } from '../../domain/ports/order.event.port';

@Injectable()
export class OrderEventPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventPublisher.name);
  private readonly publishSubject = new Subject<OrderEvent>();
  private isInitialized = false;
  private kafkaPort: OrderEventPort;

  constructor(private readonly kafkaProducer: OrderEventPort) {
    this.kafkaPort = kafkaProducer;
  }

  async onModuleInit(): Promise<void> {
    this.isInitialized = true;
    this.logger.log('OrderEventPublisher inicializado correctamente');
    this.subscribeToInternalEvents();
  }

  async onModuleDestroy(): Promise<void> {
    this.isInitialized = false;
    this.publishSubject.complete();
    this.logger.log('OrderEventPublisher detenido');
  }

  private subscribeToInternalEvents(): void {
    this.publishSubject.subscribe({
      next: async (event) => {
        try {
          await this.kafkaPort.publish(event);
          const eventId = (event as any).id || (event as any).eventId || 'unknown';
          this.logger.debug(`Evento publicado en Kafka: ${eventId}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error(`Error al publicar evento en Kafka: ${errorMessage}`);
        }
      },
      error: (error) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.error(`Error en el flujo de publicación: ${errorMessage}`);
      },
    });
  }

  async publish(event: OrderEvent): Promise<boolean> {
    if (!this.isInitialized) {
      this.logger.warn('Publisher no está inicializado');
      return false;
    }

    this.validateEvent(event);
    this.publishSubject.next(event);
    return true;
  }

  async publishOrderCreated(orderId: string, data: Record<string, unknown>): Promise<boolean> {
    const event = new OrderEvent(
      OrderEventType.ORDER_CREATED,
      orderId,
      data,
      new Date(),
    );
    return this.publish(event);
  }

  async publishOrderUpdated(orderId: string, data: Record<string, unknown>): Promise<boolean> {
    const event = new OrderEvent(
      OrderEventType.ORDER_UPDATED,
      orderId,
      data,
      new Date(),
    );
    return this.publish(event);
  }

  async publishOrderCancelled(orderId: string, data: Record<string, unknown>): Promise<boolean> {
    const event = new OrderEvent(
      OrderEventType.ORDER_CANCELLED,
      orderId,
      data,
      new Date(),
    );
    return this.publish(event);
  }

  async publishOrderCompleted(orderId: string, data: Record<string, unknown>): Promise<boolean> {
    const event = new OrderEvent(
      OrderEventType.ORDER_COMPLETED,
      orderId,
      data,
      new Date(),
    );
    return this.publish(event);
  }

  private validateEvent(event: OrderEvent): void {
    if (!event.orderId || event.orderId.trim() === '') {
      throw new Error('El orderId es obligatorio para publicar un evento');
    }
    if (!event.type) {
      throw new Error('El tipo de evento es obligatorio');
    }
  }

  getPublishStream(): Observable<OrderEvent> {
    return this.publishSubject.asObservable();
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}