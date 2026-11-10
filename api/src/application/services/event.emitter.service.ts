import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { OrderEvent } from '../../domain/order.event';

export interface EventHandlerMetadata {
  event: string;
  handler: string;
  timestamp: Date;
}

@Injectable()
export class EventEmitterService {
  private readonly logger = new Logger(EventEmitterService.name);
  private registeredHandlers: EventHandlerMetadata[] = [];

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.eventEmitter.on('error', (error: any) => {
      this.logger.error(`Error en EventEmitter: ${error}`);
    });
  }

  emit(event: string, payload?: any): boolean {
    try {
      const result = this.eventEmitter.emit(event, payload);
      this.logger.debug(`Evento emitido: ${event}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al emitir evento ${event}:`, error);
      return false;
    }
  }

  on(event: string, handler: (payload: any) => void): void {
    this.eventEmitter.on(event, handler);
    this.registeredHandlers.push({
      event,
      handler: handler.name || 'anonymous',
      timestamp: new Date(),
    });
    this.logger.debug(`Handler registrado para evento: ${event}`);
  }

  once(event: string, handler: (payload: any) => void): void {
    this.eventEmitter.once(event, handler);
    this.registeredHandlers.push({
      event,
      handler: `${handler.name || 'anonymous'}_once`,
      timestamp: new Date(),
    });
    this.logger.debug(`Handler único registrado para evento: ${event}`);
  }

  off(event: string, handler?: (payload: any) => void): void {
    if (handler) {
      this.eventEmitter.off(event, handler);
    } else {
      this.eventEmitter.removeAllListeners(event);
    }
    this.logger.debug(`Handlers removidos para evento: ${event}`);
  }

  removeAllListeners(): void {
    this.eventEmitter.removeAllListeners();
    this.registeredHandlers = [];
    this.logger.debug('Todos los handlers removidos');
  }

  listenerCount(event: string): number {
    return this.eventEmitter.listenerCount(event);
  }

  getRegisteredHandlers(): EventHandlerMetadata[] {
    return [...this.registeredHandlers];
  }

  registerHandlers(): void {
    this.logger.log('Registrando handlers de eventos internos');
    
    this.on('event.published', (event: OrderEvent) => {
      this.logger.log(`[INTERNAL] Evento publicado: ${event.id}`);
    });

    this.on('event.received', (event: OrderEvent) => {
      this.logger.log(`[INTERNAL] Evento recibido: ${event.id}`);
    });

    this.on('event.publish-failed', (data: { event: OrderEvent; error: string }) => {
      this.logger.warn(`[INTERNAL] Publicación fallida: ${data.event.id} - ${data.error}`);
    });

    this.on('consumer.error', (data: { error: string }) => {
      this.logger.error(`[INTERNAL] Error en consumidor: ${data.error}`);
    });
  }

  clearHandlers(): void {
    this.removeAllListeners();
    this.logger.log('Handlers de eventos internos limpiados');
  }
}