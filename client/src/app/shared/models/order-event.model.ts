export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderEvent {
  id: string;
  orderId: string;
  eventType: 'ORDER_CREATED' | 'ORDER_UPDATED' | 'ORDER_CANCELLED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | 'PAYMENT_PROCESSED' | 'PAYMENT_FAILED';
  timestamp: string;
  source: string;
  data: {
    customerId?: string;
    customerName?: string;
    totalAmount?: number;
    currency?: string;
    items?: OrderItem[];
    shippingAddress?: string;
    status?: string;
    trackingNumber?: string;
    [key: string]: unknown;
  };
}

export interface OrderEventDTO {
  orderId: string;
  eventType: OrderEvent['eventType'];
  source: string;
  data: OrderEvent['data'];
}