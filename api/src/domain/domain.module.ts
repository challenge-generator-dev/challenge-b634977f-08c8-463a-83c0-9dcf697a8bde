import { Module } from '@nestjs/common';
import { OrderEvent, OrderEventType } from './order.event';
import { OrderEventPort } from './ports/order.event.port';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'OrderEventType',
      useValue: OrderEventType,
    },
  ],
  exports: [
    OrderEvent,
    OrderEventType,
    OrderEventPort,
    {
      provide: 'OrderEventType',
      useValue: OrderEventType,
    },
  ],
})
export class DomainModule {}