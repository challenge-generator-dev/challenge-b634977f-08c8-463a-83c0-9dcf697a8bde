import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE, APP_FILTER } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationModule } from './application/application.module';
import { KafkaConfigService } from './config/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [() => ({
        kafka: {
          clientId: process.env.KAFKA_CLIENT_ID || 'order-events-api',
          brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
          groupId: process.env.KAFKA_GROUP_ID || 'order-events-consumer-group',
        },
        app: {
          port: parseInt(process.env.APP_PORT || '3000', 10),
          host: process.env.APP_HOST || '0.0.0.0',
        },
      })],
    }),
    ApplicationModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    KafkaConfigService,
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  configureSwagger(document: any, app: any) {
    const config = new DocumentBuilder()
      .setTitle('Order Events API')
      .setDescription(
        'API para publicación y consumo de eventos de órdenes en tiempo real. ' +
        'Proporciona endpoints SSE para consumo de eventos y REST para publicación.',
      )
      .setVersion('1.0')
      .addServer(
        `http://localhost:${this.configService.get<number>('app.port') || 3000}`,
        'Servidor de desarrollo',
      )
      .addTag('orders', 'Operaciones relacionadas con eventos de órdenes')
      .addTag('events', 'Gestión de eventos en tiempo real')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Ingrese el token JWT',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();
    return SwaggerModule.createDocument(app, config);
  }

  getConfig<T = any>(key: string): T {
    return this.configService.get<T>(key);
  }

  getPort(): number {
    return this.configService.get<number>('app.port') || 3000;
  }

  getHost(): string {
    return this.configService.get<string>('app.host') || '0.0.0.0';
  }
}