import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderEvent, OrderEventType } from '@domain/order.event';
import { OrderEventPort } from '@domain/ports/order.event.port';
import { KafkaProducerAdapter } from '@infrastructure/adapters/kafka.producer';
import { KafkaConsumerAdapter } from '@infrastructure/adapters/kafka.consumer';

class PublishEventDto {
  orderId: string;
  eventType: OrderEventType;
  payload: Record<string, unknown>;
}

@Controller('orders/events')
export class OrderEventController {
  private readonly logger = new Logger(OrderEventController.name);
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly producerAdapter: KafkaProducerAdapter,
    private readonly consumerAdapter: KafkaConsumerAdapter,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async publishOrderEvent(
    @Body() publishEventDto: PublishEventDto,
  ): Promise<{ message: string; eventId: string }> {
    this.logger.log(`Recibida solicitud para publicar evento: ${publishEventDto.eventType}`);

    if (!publishEventDto.orderId || !publishEventDto.eventType) {
      throw new Error('orderId y eventType son requeridos');
    }

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const event = new OrderEvent({
      id: eventId,
      orderId: publishEventDto.orderId,
      eventType: publishEventDto.eventType,
      payload: publishEventDto.payload || {},
      timestamp: new Date(),
    });

    try {
      await this.producerAdapter.publish(event);
      this.logger.log(`Evento ${event.id} publicado exitosamente para orden ${event.orderId}`);

      return {
        message: 'Evento aceptado para procesamiento',
        eventId: event.id,
      };
    } catch (error) {
      this.logger.error('Error al publicar el evento en Kafka', error);
      throw error;
    }
  }

  @Get()
  getOrderEvents(@Res() res: Response): void {
    this.logger.log('Cliente conectado a stream de eventos de órdenes');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const eventStream$ = this.consumerAdapter.consume();

    const subscription = eventStream$.subscribe({
      next: (event: OrderEvent | null) => {
        if (event) {
          const sseData = this.buildSseData(event);
          res.write(`data: ${JSON.stringify(sseData)}\n\n`);
          this.logger.debug(`Evento SSE enviado para orden: ${event.orderId}`);
        }
      },
      error: (error) => {
        this.logger.error('Error en el stream de eventos', error);
        res.write(`event: error\ndata: ${JSON.stringify({ message: 'Error en el stream' })}\n\n`);
      },
      complete: () => {
        this.logger.log('Stream de eventos cerrado');
        res.end();
      },
    });

    res.on('close', () => {
      this.logger.log('Conexión SSE cerrada por el cliente');
      subscription.unsubscribe();
    });
  }

  private buildSseData(event: OrderEvent): Record<string, unknown> {
    return {
      id: event.id,
      orderId: event.orderId,
      eventType: event.eventType,
      timestamp: event.timestamp,
      payload: event.payload,
    };
  }
}