import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { OrderEvent } from '@domain/order.event';
import { OrderEventPort } from '@domain/ports/order.event.port';

@Injectable()
export class KafkaProducerAdapter implements OrderEventPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerAdapter.name);
  private kafka: Kafka;
  private producer: Producer;
  private readonly topic = 'order-events';

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID', 'order-events-api'),
      brokers: this.parseBrokers(),
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.producer.connect();
      this.logger.log('Productor Kafka conectado exitosamente');
    } catch (error) {
      this.logger.error('Error al conectar el productor Kafka', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
    this.logger.log('Productor Kafka desconectado');
  }

  async publish(event: OrderEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topic,
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify({
            orderId: event.orderId,
            eventType: event.eventType,
            timestamp: event.timestamp,
            payload: event.payload,
          }),
          headers: {
            'content-type': 'application/json',
            'event-id': event.id,
          },
        },
      ],
    };

    try {
      await this.producer.send(record);
      this.logger.debug(`Evento publicado: ${event.eventType} para orden ${event.orderId}`);
    } catch (error) {
      this.logger.error(`Error al publicar evento para orden ${event.orderId}`, error);
      throw error;
    }
  }

  private parseBrokers(): string[] {
    const brokersEnv = this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
    return brokersEnv.split(',').map((b) => b.trim());
  }
}