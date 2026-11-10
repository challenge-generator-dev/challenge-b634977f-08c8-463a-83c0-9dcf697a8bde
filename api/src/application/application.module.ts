import { Module, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { DomainModule } from '../domain/domain.module';
import { OrderEventService } from './services/order.event.service';
import { OrderEventPublisher } from './services/order.event.publisher';
import { OrderEventSubscriber } from './services/order.event.subscriber';
import { EventEmitterService } from './services/event.emitter.service';
import { KafkaProducerAdapter } from '../infrastructure/adapters/kafka.producer';
import { KafkaConsumerAdapter } from '../infrastructure/adapters/kafka.consumer';

@Module({
  imports: [DomainModule],
  providers: [
    OrderEventService,
    {
      provide: 'OrderEventPublisher',
      useClass: OrderEventPublisher,
    },
    {
      provide: 'OrderEventSubscriber',
      useClass: OrderEventSubscriber,
    },
    EventEmitterService,
    KafkaProducerAdapter,
    KafkaConsumerAdapter,
  ],
  exports: [
    OrderEventService,
    OrderEventPublisher,
    OrderEventSubscriber,
    EventEmitterService,
  ],
})
export class ApplicationModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ApplicationModule.name);

  constructor(
    private readonly orderEventService: OrderEventService,
    private readonly eventEmitter: EventEmitterService,
    private readonly orderEventPublisher: OrderEventPublisher,
    private readonly orderEventSubscriber: OrderEventSubscriber,
  ) {}

  async onModuleInit() {
    this.logger.log('Inicializando ApplicationModule...');
    await this.orderEventService.initialize();
    this.eventEmitter.registerHandlers();
    this.logger.log('ApplicationModule inicializado correctamente');
  }

  async onModuleDestroy() {
    this.logger.log('Deteniendo ApplicationModule...');
    await this.orderEventService.shutdown();
    this.eventEmitter.clearHandlers();
    this.logger.log('ApplicationModule detenido');
  }
}