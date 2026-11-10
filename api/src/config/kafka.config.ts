import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';

export { Kafka as KafkaConfig } from 'kafkajs';

@Injectable()
export class KafkaConfigService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isProducerConnected = false;
  private isConsumerConnected = false;

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('KAFKA_CLIENT_ID', 'order-events-api');
    const brokers = this.configService.get<string[]>('KAFKA_BROKERS', ['localhost:9092']);
    const ssl = this.configService.get<boolean>('KAFKA_SSL', false);
    const sasl = this.configService.get<boolean>('KAFKA_SASL_ENABLED', false);

    this.kafka = new Kafka({
      clientId,
      brokers,
      ssl,
      sasl: sasl
        ? {
            mechanism: this.configService.get<string>('KAFKA_SASL_MECHANISM', 'plain'),
            username: this.configService.get<string>('KAFKA_SASL_USERNAME', ''),
            password: this.configService.get<string>('KAFKA_SASL_PASSWORD', ''),
          }
        : undefined,
      logLevel: logLevel.WARN,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'order-events-consumer-group' });
  }

  async onModuleInit(): Promise<void> {
    await this.connectProducer();
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnectProducer();
    await this.disconnectConsumer();
  }

  async connectProducer(): Promise<void> {
    if (!this.isProducerConnected) {
      try {
        await this.producer.connect();
        this.isProducerConnected = true;
        console.log('Kafka producer connected successfully');
      } catch (error) {
        console.error('Failed to connect Kafka producer:', error);
        throw error;
      }
    }
  }

  async disconnectProducer(): Promise<void> {
    if (this.isProducerConnected) {
      try {
        await this.producer.disconnect();
        this.isProducerConnected = false;
        console.log('Kafka producer disconnected');
      } catch (error) {
        console.error('Error disconnecting Kafka producer:', error);
      }
    }
  }

  async connectConsumer(): Promise<void> {
    if (!this.isConsumerConnected) {
      try {
        await this.consumer.connect();
        this.isConsumerConnected = true;
        console.log('Kafka consumer connected successfully');
      } catch (error) {
        console.error('Failed to connect Kafka consumer:', error);
        throw error;
      }
    }
  }

  async disconnectConsumer(): Promise<void> {
    if (this.isConsumerConnected) {
      try {
        await this.consumer.disconnect();
        this.isConsumerConnected = false;
        console.log('Kafka consumer disconnected');
      } catch (error) {
        console.error('Error disconnecting Kafka consumer:', error);
      }
    }
  }

  getProducer(): Producer {
    return this.producer;
  }

  getConsumer(): Consumer {
    return this.consumer;
  }

  getKafkaInstance(): Kafka {
    return this.kafka;
  }

  async sendMessage(topic: string, messages: Array<{ key?: string; value: string; headers?: Record<string, string> }>): Promise<void> {
    if (!this.isProducerConnected) {
      await this.connectProducer();
    }
    await this.producer.send({
      topic,
      messages,
    });
  }

  async subscribeToTopic(topic: string, fromBeginning = false): Promise<void> {
    if (!this.isConsumerConnected) {
      await this.connectConsumer();
    }
    await this.consumer.subscribe({ topic, fromBeginning });
  }
}