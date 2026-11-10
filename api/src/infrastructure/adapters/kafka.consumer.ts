import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { OrderEvent, OrderEventType } from '@domain/order.event';
import { OrderEventPort } from '@domain/ports/order.event.port';

@Injectable()
export class KafkaConsumerAdapter implements OrderEventPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerAdapter.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly topic = 'order-events';
  private readonly eventSubject = new Subject<OrderEvent>();

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID', 'order-events-api'),
      brokers: this.parseBrokers(),
    });
    this.consumer = this.kafka.consumer({
      groupId: this.configService.get<string>('KAFKA_GROUP_ID', 'order-events-consumer-group'),
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });
      this.logger.log('Consumidor Kafka iniciado y escuchando eventos');
    } catch (error) {
      this.logger.error('Error al iniciar el consumidor Kafka', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
    this.eventSubject.complete();
    this.logger.log('Consumidor Kafka desconectado');
  }

  async publish(event: OrderEvent): Promise<void> {
    this.logger.warn('El consumidor no implementa publicación directa');
  }

  consume(): Observable<OrderEvent> {
    return this.eventSubject.asObservable().pipe(
      map((event) => {
        this.logger.debug(`Evento procesado para orden: ${event.orderId}`);
        return event;
      }),
      catchError((error) => {
        this.logger.error('Error en el flujo de eventos', error);
        return of(null as unknown as OrderEvent);
      }),
    );
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    if (!message.value) {
      this.logger.warn('Mensaje sin valor recibido, ignorando');
      return;
    }

    try {
      const parsed = JSON.parse(message.value.toString());
      const event: OrderEvent = new OrderEvent(
        parsed.orderId,
        parsed.eventType as OrderEventType,
        parsed.payload,
      );
      event.id = message.headers?.['event-id'] as string || event.id;
      event.timestamp = parsed.timestamp || event.timestamp;

      this.eventSubject.next(event);
      this.logger.debug(`Evento procesado y emitido: ${event.eventType}`);
    } catch (error) {
      this.logger.error('Error al procesar mensaje de Kafka', error);
    }
  }

  private parseBrokers(): string[] {
    const brokersEnv = this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
    return brokersEnv.split(',').map((b) => b.trim());
  }
}