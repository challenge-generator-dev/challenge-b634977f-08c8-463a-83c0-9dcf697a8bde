import { Observable } from 'rxjs';
import { OrderEvent } from '../order.event';

export interface OrderEventPort {
  publish(event: OrderEvent): Promise<void>;
  consume(): Observable<OrderEvent>;
}

export const ORDER_EVENT_PORT = 'ORDER_EVENT_PORT';