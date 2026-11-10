import { Test, TestingModule } from '@nestjs/testing';
import { OrderEventService } from '@application/services/order.event.service';
import { OrderEventPort } from '@domain/ports/order.event.port';
import { OrderEvent, OrderEventType } from '@domain/order.event';
import { Observable, of, Subject } from 'rxjs';

describe('OrderEventService', () => {
  let service: OrderEventService;
  let mockPort: jest.Mocked<OrderEventPort>;
  let mockEventSubject: Subject<OrderEvent>;

  beforeEach(async () => {
    mockEventSubject = new Subject<OrderEvent>();

    mockPort = {
      publish: jest.fn().mockResolvedValue(undefined),
      consume: jest.fn().mockReturnValue(mockEventSubject.asObservable()),
    };

    const mockEventEmitter = {
      emit: jest.fn().mockReturnValue(true),
      on: jest.fn(),
      once: jest.fn(),
      off: jest.fn(),
      removeAllListeners: jest.fn(),
      listenerCount: jest.fn().mockReturnValue(0),
      getRegisteredHandlers: jest.fn().mockReturnValue([]),
      registerHandlers: jest.fn(),
      clearHandlers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderEventService,
        {
          provide: 'OrderEventPort',
          useValue: mockPort,
        },
        {
          provide: 'EventEmitter2',
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<OrderEventService>(OrderEventService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('publishEvent', () => {
    it('debería publicar un evento de orden exitosamente', async () => {
      const dto = {
        orderId: 'order-123',
        eventType: OrderEventType.ORDER_CREATED,
        payload: { customerId: 'cust-456', amount: 100.50 },
      };

      const result = await service.publishEvent(dto);

      expect(result.success).toBe(true);
      expect(result.eventId).toBeDefined();
      expect(mockPort.publish).toHaveBeenCalledTimes(1);
    });

    it('debería manejar errores al publicar evento', async () => {
      mockPort.publish.mockRejectedValueOnce(new Error('Kafka connection failed'));

      const dto = {
        orderId: 'order-456',
        eventType: OrderEventType.ORDER_UPDATED,
        payload: { status: 'PROCESSING' },
      };

      const result = await service.publishEvent(dto);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Error');
    });

    it('debería publicar eventos para diferentes tipos de orden', async () => {
      const dtos = [
        {
          orderId: 'order-001',
          eventType: OrderEventType.ORDER_CREATED,
          payload: { amount: 100 },
        },
        {
          orderId: 'order-001',
          eventType: OrderEventType.ORDER_UPDATED,
          payload: { status: 'CONFIRMED' },
        },
        {
          orderId: 'order-001',
          eventType: OrderEventType.ORDER_CANCELLED,
          payload: { reason: 'Customer request' },
        },
      ];

      for (const dto of dtos) {
        await service.publishEvent(dto);
      }

      expect(mockPort.publish).toHaveBeenCalledTimes(3);
    });
  });

  describe('getOrderEvents', () => {
    it('debería retornar un observable de eventos de orden', () => {
      const result = service.getOrderEvents();

      expect(result).toBeInstanceOf(Observable);
    });

    it('debería emitir eventos cuando el puerto emita', (done) => {
      const mockEvent = new OrderEvent({
        id: 'evt-006',
        orderId: 'order-789',
        eventType: OrderEventType.ORDER_COMPLETED,
        payload: { finalAmount: 250.00 },
        timestamp: new Date(),
      });

      const observable$ = service.getOrderEvents();

      const subscription = observable$.subscribe((event) => {
        if (event.type === 'order-event') {
          const orderEvent = event.data as OrderEvent;
          expect(orderEvent.id).toBe(mockEvent.id);
          subscription.unsubscribe();
          done();
        }
      });

      mockEventSubject.next(mockEvent);
    });

    it('debería manejar múltiples eventos emitidos consecutivamente', (done) => {
      const events = [
        new OrderEvent({ id: 'evt-007', orderId: 'o1', eventType: OrderEventType.ORDER_CREATED, payload: {}, timestamp: new Date() }),
        new OrderEvent({ id: 'evt-008', orderId: 'o2', eventType: OrderEventType.ORDER_UPDATED, payload: {}, timestamp: new Date() }),
        new OrderEvent({ id: 'evt-009', orderId: 'o3', eventType: OrderEventType.ORDER_COMPLETED, payload: {}, timestamp: new Date() }),
      ];

      const observable$ = service.getOrderEvents();
      let index = 0;

      const subscription = observable$.subscribe((event) => {
        if (event.type === 'order-event') {
          const orderEvent = event.data as OrderEvent;
          expect(orderEvent.id).toBe(events[index].id);
          index++;
          if (index === events.length) {
            subscription.unsubscribe();
            done();
          }
        }
      });

      events.forEach((evt) => mockEventSubject.next(evt));
    });

    it('debería manejar errores del flujo de consumo', (done) => {
      const errorObservable$ = service.getOrderEvents();
      const testError = new Error('Consumer stream error');

      errorObservable$.subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toEqual(testError);
          done();
        },
      });

      mockEventSubject.error(testError);
    });
  });

  describe('getEventHistory', () => {
    it('debería retornar historial de eventos vacío inicialmente', async () => {
      const history = service.getEventHistory();
      expect(history).toEqual([]);
    });

    it('debería almacenar eventos publicados en el historial', async () => {
      const dto = {
        orderId: 'order-999',
        eventType: OrderEventType.ORDER_CREATED,
        payload: { amount: 500 },
      };

      await service.publishEvent(dto);

      const history = service.getEventHistory();
      expect(history.length).toBe(1);
      expect(history[0].orderId).toBe('order-999');
    });

    it('debería mantener historial de múltiples eventos publicados', async () => {
      const dtos = [
        { orderId: 'o1', eventType: OrderEventType.ORDER_CREATED, payload: {} },
        { orderId: 'o2', eventType: OrderEventType.ORDER_UPDATED, payload: {} },
        { orderId: 'o3', eventType: OrderEventType.ORDER_COMPLETED, payload: {} },
      ];

      for (const dto of dtos) {
        await service.publishEvent(dto);
      }

      const history = service.getEventHistory();
      expect(history.length).toBe(3);
    });
  });

  describe('clearHistory', () => {
    it('debería清理 el historial de eventos', async () => {
      const dto = {
        orderId: 'order-111',
        eventType: OrderEventType.ORDER_CANCELLED,
        payload: { reason: 'Test' },
      };

      await service.publishEvent(dto);
      expect(service.getEventHistory().length).toBe(1);

      service.clearHistory();
      expect(service.getEventHistory()).toEqual([]);
    });
  });

  describe('getConnectedClients', () => {
    it('debería retornar el número de clientes conectados', () => {
      const clients = service.getConnectedClients();
      expect(typeof clients).toBe('number');
    });
  });

  describe('getBufferSize', () => {
    it('debería retornar el tamaño del buffer', () => {
      const size = service.getBufferSize();
      expect(typeof size).toBe('number');
    });
  });
});