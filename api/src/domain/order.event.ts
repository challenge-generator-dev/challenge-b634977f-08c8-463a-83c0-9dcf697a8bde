import { IsString, IsNumber, IsDate, IsEnum } from 'class-validator';

export enum OrderEventType {
  CREATED = 'ORDER_CREATED',
  UPDATED = 'ORDER_UPDATED',
  CANCELLED = 'ORDER_CANCELLED',
  DELIVERED = 'ORDER_DELIVERED'
}

export class OrderEvent {
  @IsString()
  orderId: string;

  @IsEnum(OrderEventType)
  eventType: OrderEventType;

  @IsNumber()
  customerId: number;

  @IsString()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsDate()
  timestamp: Date;

  @IsString()
  metadata?: Record<string, any>;

  constructor(
    orderId: string,
    eventType: OrderEventType,
    customerId: number,
    productId: string,
    quantity: number,
    timestamp: Date = new Date(),
    metadata?: Record<string, any>
  ) {
    this.orderId = orderId;
    this.eventType = eventType;
    this.customerId = customerId;
    this.productId = productId;
    this.quantity = quantity;
    this.timestamp = timestamp;
    this.metadata = metadata;
  }
}