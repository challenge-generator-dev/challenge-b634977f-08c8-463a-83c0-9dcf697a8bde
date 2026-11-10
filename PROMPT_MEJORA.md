# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `GET /orders/events`
  - `POST /orders/events`
- `client` expone http:
  - `GET /orders/events (SSE)`

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `api/src/application/services/order.event.service.ts` — `OrderEvent.push`: Se invoca `push` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/application/services/order.event.service.ts` — `OrderEvent.shift`: Se invoca `shift` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/src/application/services/event.emitter.service.ts` — `EventHandlerMetadata.push`: Se invoca `push` sobre `EventHandlerMetadata`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `api/package.json` — `@nestjs/event-emitter@8.0.0`: @nestjs/event-emitter declara el rango ^8.0.0, que no resuelve a ninguna version publicada: `npm install` falla con ETARGET. Reemplazala por una version publicada real.

## Como saber que terminaste

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2

### Brecha de conocimiento
Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261109223818458), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz

### Misión / candidato
Mostrar en vivo el estado de las ordenes

### Reto
- Tema: Consumo de eventos en tiempo real con Kafka
- Seniority: advanced-l2
- Tipo: practical
- Título: Integración de eventos en tiempo real con Kafka
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial del entorno — objetivo: Establecer un entorno de desarrollo con Kafka y Angular para la publicación y consumo de eventos. — entregable (NO resolver): Entorno de desarrollo configurado con Kafka y Angular listo para la integración de eventos.
- Fase 2: Publicación de eventos en Kafka — objetivo: Implementar la funcionalidad para publicar eventos de órdenes en un topic Kafka. — entregable (NO resolver): Servicio en Angular que publica eventos de órdenes en Kafka.
- Fase 3: Consumo de eventos en Kafka — objetivo: Implementar la funcionalidad para consumir eventos de órdenes desde un topic Kafka y mostrarlos en tiempo real en la interfaz de usuario. — entregable (NO resolver): Servicio en Angular que consume eventos de órdenes desde Kafka y los muestra en tiempo real en la interfaz de usuario.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: api/package.json ===
{
  "name": "order-events-api",
  "version": "1.0.0",
  "description": "API para publicación y consumo de eventos de órdenes en tiempo real usando Kafka",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "format": "prettier --write 'src/**/*.ts'",
    "start": "node dist/main.js",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "lint": "eslint '{src,apps,libs,test}/**/*.ts' --fix"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/websockets": "^11.0.0",
    "@nestjs/config": "^12.1.1",
    "@nestjs/swagger": "^11.4.8",
    "class-validator": "^0.14.0",
    "kafkajs": "^2.2.4",
    "rxjs": "^7.8.1",
    "reflect-metadata": "^0.1.13",
    "@nestjs/event-emitter": "^12.0.2"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.5",
    "@types/node": "^20.8.0",
    "@types/supertest": "^2.0.12",
    "@typescript-eslint/eslint-plugin": "^6.7.3",
    "@typescript-eslint/parser": "^6.7.3",
    "eslint": "^8.50.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.7.0",
    "prettier": "^3.0.3",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1",
    "ts-loader": "^9.4.4",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.2.2"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ]
  }
}

// === ARCHIVO: api/tsconfig.json ===
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "esModuleInterop": true,
    "strict": true,
    "strictPropertyInitialization": false,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "paths": {
      "@app/*": ["src/*"],
      "@config/*": ["src/config/*"],
      "@domain/*": ["src/domain/*"],
      "@application/*": ["src/application/*"],
      "@infrastructure/*": ["src/infrastructure/*"],
      "@test/*": ["test/*"]
    }
  },
  "exclude": ["node_modules", "dist", "test", "**/*.spec.ts"]
}

// === ARCHIVO: api/src/main.ts ===
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  const config = new DocumentBuilder()
    .setTitle('Order Events API')
    .setDescription('API para publicación y consumo de eventos de órdenes en tiempo real')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

// === ARCHIVO: api/src/domain/order.event.ts ===
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

// === ARCHIVO: api/src/domain/ports/order.event.port.ts ===
import { Observable } from 'rxjs';
import { OrderEvent } from '../order.event';

export interface OrderEventPort {
  publish(event: OrderEvent): Promise<void>;
  consume(): Observable<OrderEvent>;
}

export const ORDER_EVENT_PORT = 'ORDER_EVENT_PORT';

// === ARCHIVO: api/src/app.module.ts ===
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

// === ARCHIVO: api/src/application/application.module.ts ===
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

// === ARCHIVO: api/src/application/services/order.event.service.ts ===
import { Injectable, Logger, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { Observable, Subject, interval, merge, of, EMPTY } from 'rxjs';
import { takeUntil, map, catchError, tap, retry, delay } from 'rxjs/operators';
import { OrderEvent, OrderEventType } from '@domain/order.event';
import { OrderEventPort } from '@domain/ports/order.event.port';
import { EventEmitterService } from './event.emitter.service';

export interface OrderEventDTO {
  orderId: string;
  eventType: OrderEventType;
  payload?: Record<string, any>;
  timestamp?: string;
}

export interface PublishResult {
  success: boolean;
  eventId?: string;
  message?: string;
  timestamp: Date;
}

export interface StreamEvent {
  type: 'order-event' | 'heartbeat' | 'error';
  data: OrderEvent | { heartbeat: number } | { error: string };
  timestamp: Date;
}

@Injectable()
export class OrderEventService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventService.name);
  private readonly destroy$ = new Subject<void>();
  private eventsSubject = new Subject<OrderEvent>();
  private connectedClients = 0;
  private eventBuffer: OrderEvent[] = [];
  private maxBufferSize = 1000;
  private processingActive = false;
  private eventHistory: OrderEvent[] = [];

  constructor(
    @Inject('OrderEventPort') private readonly orderEventPort: OrderEventPort,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  async onModuleInit() {
    this.logger.log('Inicializando OrderEventService');
    this.startEventConsumption();
    this.startHeartbeat();
  }

  async onModuleDestroy() {
    this.logger.log('Deteniendo OrderEventService');
    this.destroy$.next();
    this.destroy$.complete();
    await this.flushBuffer();
  }

  async publishEvent(dto: OrderEventDTO): Promise<PublishResult> {
    const eventId = this.generateEventId();
    const timestamp = dto.timestamp ? new Date(dto.timestamp) : new Date();

    const event = new OrderEvent({
      id: eventId,
      orderId: dto.orderId,
      eventType: dto.eventType,
      payload: dto.payload || {},
      timestamp,
    });

    try {
      this.validateEvent(event);
      await this.orderEventPort.publish(event);
      this.eventHistory.push(event);
      this.eventEmitter.emit('event.published', event);
      this.logger.log(`Evento publicado: ${eventId} para orden ${dto.orderId}`);

      return {
        success: true,
        eventId,
        message: `Evento ${event.eventType} publicado exitosamente`,
        timestamp: new Date(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Error al publicar evento: ${errorMessage}`, error);
      this.eventEmitter.emit('event.publish-failed', { event, error: errorMessage });

      return {
        success: false,
        eventId,
        message: `Error al publicar evento: ${errorMessage}`,
        timestamp: new Date(),
      };
    }
  }

  getOrderEvents(): Observable<StreamEvent> {
    this.connectedClients++;
    this.logger.log(`Cliente conectado a SSE. Total clientes: ${this.connectedClients}`);

    const heartbeat$ = interval(5000).pipe(
      map(() => ({
        type: 'heartbeat' as const,
        data: { heartbeat: Date.now() },
        timestamp: new Date(),
      })),
    );

    const events$ = this.eventsSubject.asObservable().pipe(
      map((event) => ({
        type: 'order-event' as const,
        data: event,
        timestamp: new Date(),
      })),
      catchError((error) => {
        this.logger.error('Error en stream de eventos:', error);
        return of({
          type: 'error' as const,
          data: { error: error instanceof Error ? error.message : 'Error desconocido' },
          timestamp: new Date(),
        });
      }),
      takeUntil(this.destroy$),
    );

    return merge(heartbeat$, events$).pipe(
      tap(() => {
        if (this.eventBuffer.length > 0 && !this.processingActive) {
          this.processBuffer();
        }
      }),
    );
  }

  private startEventConsumption() {
    this.orderEventPort.consume()
      .pipe(
        takeUntil(this.destroy$),
        tap((event) => {
          this.logger.debug(`Evento recibido de Kafka: ${event.id}`);
          this.handleIncomingEvent(event);
        }),
        retry({
          count: 3,
          delay: (error, retryCount) => {
            this.logger.warn(`Reintentando consumo de eventos. Intento ${retryCount}`);
            return of(null).pipe(delay(1000 * retryCount));
          },
        }),
        catchError((error) => {
          this.logger.error('Error fatal en consumo de eventos:', error);
          this.eventEmitter.emit('consumer.error', { error: error instanceof Error ? error.message : 'Error desconocido' });
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private startHeartbeat() {
    interval(30000)
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.logger.debug('Heartbeat del servicio de eventos');
        }),
      )
      .subscribe();
  }

  private handleIncomingEvent(event: OrderEvent) {
    if (this.connectedClients > 0) {
      this.eventsSubject.next(event);
    } else {
      this.bufferEvent(event);
    }
    this.eventEmitter.emit('event.received', event);
  }

  private bufferEvent(event: OrderEvent) {
    if (this.eventBuffer.length >= this.maxBufferSize) {
      this.eventBuffer.shift();
    }
    this.eventBuffer.push(event);
    this.logger.debug(`Evento bufferizado. Buffer size: ${this.eventBuffer.length}`);
  }

  private async processBuffer() {
    this.processingActive = true;
    const eventsToProcess = [...this.eventBuffer];
    this.eventBuffer = [];

    for (const event of eventsToProcess) {
      this.eventsSubject.next(event);
    }

    this.processingActive = false;
  }

  private async flushBuffer() {
    if (this.eventBuffer.length > 0) {
      this.logger.log(`Vaciando buffer de ${this.eventBuffer.length} eventos`);
      await this.processBuffer();
    }
  }

  private validateEvent(event: OrderEvent): void {
    if (!event.orderId || event.orderId.trim() === '') {
      throw new Error('El orderId es obligatorio');
    }
    if (!event.eventType) {
      throw new Error('El eventType es obligatorio');
    }
    if (!Object.values(OrderEventType).includes(event.eventType)) {
      throw new Error(`Tipo de evento inválido: ${event.eventType}`);
    }
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  async initialize(): Promise<void> {
    this.logger.log('Inicializando servicio de eventos de órdenes');
    this.processingActive = false;
    this.eventBuffer = [];
    this.connectedClients = 0;
  }

  async shutdown(): Promise<void> {
    this.logger.log('Cerrando servicio de eventos de órdenes');
    await this.flushBuffer();
    this.eventsSubject.complete();
  }

  getConnectedClients(): number {
    return this.connectedClients;
  }

  getBufferSize(): number {
    return this.eventBuffer.length;
  }

  getEventHistory(): OrderEvent[] {
    return [...this.eventHistory];
  }

  clearHistory(): void {
    this.eventHistory = [];
  }
}

// === ARCHIVO: api/src/application/services/event.emitter.service.ts ===
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

// === ARCHIVO: api/src/infrastructure/adapters/kafka.producer.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { OrderEvent } from '@domain/order.event';
import { OrderEventPort } from '@domain/ports/order.event.port';

@Injectable()
export class KafkaProducerAdapter implements OrderEventPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerAdapter.name);
  private kafka: Kafka;
  private producer: Producer;
  private readonly topic = 'order-events';

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID', 'order-events-api'),
      brokers: this.parseBrokers(),
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.producer.connect();
      this.logger.log('Productor Kafka conectado exitosamente');
    } catch (error) {
      this.logger.error('Error al conectar el productor Kafka', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
    this.logger.log('Productor Kafka desconectado');
  }

  async publish(event: OrderEvent): Promise<void> {
    const record: ProducerRecord = {
      topic: this.topic,
      messages: [
        {
          key: event.orderId,
          value: JSON.stringify({
            orderId: event.orderId,
            eventType: event.eventType,
            timestamp: event.timestamp,
            payload: event.payload,
          }),
          headers: {
            'content-type': 'application/json',
            'event-id': event.id,
          },
        },
      ],
    };

    try {
      await this.producer.send(record);
      this.logger.debug(`Evento publicado: ${event.eventType} para orden ${event.orderId}`);
    } catch (error) {
      this.logger.error(`Error al publicar evento para orden ${event.orderId}`, error);
      throw error;
    }
  }

  private parseBrokers(): string[] {
    const brokersEnv = this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
    return brokersEnv.split(',').map((b) => b.trim());
  }
}

// === ARCHIVO: api/src/infrastructure/adapters/kafka.consumer.ts ===
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { Observable, Subject, catchError, map, of } from 'rxjs';
import { OrderEvent, OrderEventType } from '@domain/order.event';
import { OrderEventPort } from '@domain/ports/order.event.port';

@Injectable()
export class KafkaConsumerAdapter implements OrderEventPort, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerAdapter.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly topic = 'order-events';
  private readonly eventSubject = new Subject<OrderEvent>();

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID', 'order-events-api'),
      brokers: this.parseBrokers(),
    });
    this.consumer = this.kafka.consumer({
      groupId: this.configService.get<string>('KAFKA_GROUP_ID', 'order-events-consumer-group'),
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });
      this.logger.log('Consumidor Kafka iniciado y escuchando eventos');
    } catch (error) {
      this.logger.error('Error al iniciar el consumidor Kafka', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
    this.eventSubject.complete();
    this.logger.log('Consumidor Kafka desconectado');
  }

  async publish(event: OrderEvent): Promise<void> {
    this.logger.warn('El consumidor no implementa publicación directa');
  }

  consume(): Observable<OrderEvent> {
    return this.eventSubject.asObservable().pipe(
      map((event) => {
        this.logger.debug(`Evento procesado para orden: ${event.orderId}`);
        return event;
      }),
      catchError((error) => {
        this.logger.error('Error en el flujo de eventos', error);
        return of(null as unknown as OrderEvent);
      }),
    );
  }

  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    if (!message.value) {
      this.logger.warn('Mensaje sin valor recibido, ignorando');
      return;
    }

    try {
      const parsed = JSON.parse(message.value.toString());
      const event: OrderEvent = new OrderEvent(
        parsed.orderId,
        parsed.eventType as OrderEventType,
        parsed.payload,
      );
      event.id = message.headers?.['event-id'] as string || event.id;
      event.timestamp = parsed.timestamp || event.timestamp;

      this.eventSubject.next(event);
      this.logger.debug(`Evento procesado y emitido: ${event.eventType}`);
    } catch (error) {
      this.logger.error('Error al procesar mensaje de Kafka', error);
    }
  }

  private parseBrokers(): string[] {
    const brokersEnv = this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
    return brokersEnv.split(',').map((b) => b.trim());
  }
}

// === ARCHIVO: api/src/infrastructure/controllers/order.event.controller.ts ===
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

// === ARCHIVO: api/src/config/kafka.config.ts ===
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

// === ARCHIVO: api/test/order.event.service.spec.ts ===
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

// === ARCHIVO: api/src/domain/domain.module.ts ===
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

// === ARCHIVO: api/src/application/services/order.event.publisher.ts ===
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { OrderEvent, OrderEventType } from '../../domain/order.event';
import { OrderEventPort } from '../../domain/ports/order.event.port';

@Injectable()
export class OrderEventPublisher implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventPublisher.name);
  private readonly publishSubject = new Subject<OrderEvent>();
  private isInitialized = false;
  private kafkaPort: OrderEventPort;

  constructor(private readonly kafkaProducer: OrderEventPort) {
    this.kafkaPort = kafkaProducer;
  }

  async onModuleInit(): Promise<void> {
    this.isInitialized = true;
    this.logger.log('OrderEventPublisher inicializado correctamente');
    this.subscribeToInternalEvents();
  }

  async onModuleDestroy(): Promise<void> {
    this.isInitialized = false;
    this.publishSubject.complete();
    this.logger.log('OrderEventPublisher detenido');
  }

  private subscribeToInternalEvents(): void {
    this.publishSubject.subscribe({
      next: async (event) => {
        try {
          await this.kafkaPort.publish(event);
          const eventId = (event as any).id || (event as any).eventId || 'unknown';
          this.logger.debug(`Evento publicado en Kafka: ${eventId}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error(`Error al publicar evento en Kafka: ${errorMessage}`);
        }
      },
      error: (error) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.logger.error(`Error en el flujo de publicación: ${errorMessage}`);
      },
    });
  }

  async publish(event: OrderEvent): Promise<boolean> {
    if (!this.isInitialized) {
      this.logger.warn('Publisher no está inicializado');
      return false;
    }

    this.validateEvent(event);
    this.publishSubject.next(event);
    return true;
  }

  async publishOrderCreated(orderId: string, data: Record<string, unknown>): Promise<boolean> {
    const event = new OrderEvent(
      OrderEventType.ORDER_CREATED,
      orderId,
      data,
      new Date(),
    );
    return this.publish(event);
  }

  async publishOrderUpdated(orderId: string, data: Record<string, unknown>): Promise<boolean> {
    const event = new OrderEvent(
      OrderEventType.ORDER_UPDATED,
      orderId,
      data,
      new Date(),
    );
    return this.publish(event);
  }

  async publishOrderCancelled(orderId: string, data: Record<string, unknown>): Promise<boolean> {
    const event = new OrderEvent(
      OrderEventType.ORDER_CANCELLED,
      orderId,
      data,
      new Date(),
    );
    return this.publish(event);
  }

  async publishOrderCompleted(orderId: string, data: Record<string, unknown>): Promise<boolean> {
    const event = new OrderEvent(
      OrderEventType.ORDER_COMPLETED,
      orderId,
      data,
      new Date(),
    );
    return this.publish(event);
  }

  private validateEvent(event: OrderEvent): void {
    if (!event.orderId || event.orderId.trim() === '') {
      throw new Error('El orderId es obligatorio para publicar un evento');
    }
    if (!event.type) {
      throw new Error('El tipo de evento es obligatorio');
    }
  }

  getPublishStream(): Observable<OrderEvent> {
    return this.publishSubject.asObservable();
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// === ARCHIVO: api/src/application/services/order.event.subscriber.ts ===
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject, filter, share, takeUntil, catchError, of } from 'rxjs';
import { OrderEvent, OrderEventType } from '../../domain/order.event';
import { OrderEventPort } from '../../domain/ports/order.event.port';

export interface SubscriptionFilter {
  orderId?: string;
  eventTypes?: OrderEventType[];
  fromDate?: Date;
}

@Injectable()
export class OrderEventSubscriber implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrderEventSubscriber.name);
  private readonly eventsSubject = new Subject<OrderEvent>();
  private readonly destroy$ = new Subject<void>();
  private isInitialized = false;
  private kafkaPort: OrderEventPort;
  private activeSubscriptions = 0;

  constructor(private readonly kafkaConsumer: OrderEventPort) {
    this.kafkaPort = kafkaConsumer;
  }

  async onModuleInit(): Promise<void> {
    this.isInitialized = true;
    this.logger.log('OrderEventSubscriber inicializado correctamente');
    this.startConsuming();
  }

  async onModuleDestroy(): Promise<void> {
    this.isInitialized = false;
    this.destroy$.next();
    this.destroy$.complete();
    this.eventsSubject.complete();
    this.logger.log('OrderEventSubscriber detenido');
  }

  private startConsuming(): void {
    const consumeMethod = (this.kafkaPort as any).consume;
    if (!consumeMethod || typeof consumeMethod !== 'function') {
      this.logger.warn('El puerto de Kafka no implementa consume()');
      return;
    }

    consumeMethod.call(this.kafkaPort)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error(`Error en el consumo de Kafka: ${errorMessage}`);
          return of(null as unknown as OrderEvent);
        }),
        filter((event): event is OrderEvent => event !== null),
      )
      .subscribe({
        next: (event) => {
          this.handleIncomingEvent(event);
        },
        error: (error) => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error(`Error en el flujo de consumo: ${errorMessage}`);
        },
      });
  }

  private handleIncomingEvent(event: OrderEvent): void {
    const eventId = (event as any).id || (event as any).eventId || 'unknown';
    const eventType = (event as any).type || (event as any).eventType || 'UNKNOWN';
    this.logger.debug(`Evento recibido: ${eventId} - Tipo: ${eventType}`);
    this.eventsSubject.next(event);
  }

  subscribe(filter?: SubscriptionFilter): Observable<OrderEvent> {
    this.activeSubscriptions++;
    this.logger.debug(`Nueva suscripción activa. Total: ${this.activeSubscriptions}`);

    let stream = this.eventsSubject.asObservable().pipe(
      share(),
    );

    if (filter) {
      if (filter.orderId) {
        stream = stream.pipe(
          filter((event) => (event as any).orderId === filter.orderId),
        );
      }

      if (filter.eventTypes && filter.eventTypes.length > 0) {
        stream = stream.pipe(
          filter((event) => filter.eventTypes!.includes((event as any).type)),
        );
      }

      if (filter.fromDate) {
        stream = stream.pipe(
          filter((event) => (event as any).timestamp >= filter.fromDate!),
        );
      }
    }

    return stream;
  }

  subscribeToOrderCreated(): Observable<OrderEvent> {
    return this.subscribe({ eventTypes: [OrderEventType.ORDER_CREATED] });
  }

  subscribeToOrderUpdated(): Observable<OrderEvent> {
    return this.subscribe({ eventTypes: [OrderEventType.ORDER_UPDATED] });
  }

  subscribeToOrderCancelled(): Observable<OrderEvent> {
    return this.subscribe({ eventTypes: [OrderEventType.ORDER_CANCELLED] });
  }

  subscribeToOrderCompleted(): Observable<OrderEvent> {
    return this.subscribe({ eventTypes: [OrderEventType.ORDER_COMPLETED] });
  }

  subscribeByOrderId(orderId: string): Observable<OrderEvent> {
    return this.subscribe({ orderId });
  }

  getEventStream(): Observable<OrderEvent> {
    return this.eventsSubject.asObservable();
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  getActiveSubscriptions(): number {
    return this.activeSubscriptions;
  }
}

// === ARCHIVO: client/package.json ===
{
  "name": "order-tracking-client",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "jest",
    "lint": "ng lint"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "~20.0.0",
    "@angular/cdk": "~20.0.0",
    "@angular/common": "~20.0.0",
    "@angular/compiler": "~20.0.0",
    "@angular/core": "~20.0.0",
    "@angular/forms": "~20.0.0",
    "@angular/material": "~20.0.0",
    "@angular/platform-browser": "~20.0.0",
    "@angular/platform-browser-dynamic": "~20.0.0",
    "@angular/router": "~20.0.0",
    "rxjs": "~7.8.1",
    "tslib": "^2.6.2",
    "zone.js": "~0.15.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~20.0.0",
    "@angular/cli": "~20.0.0",
    "@angular/compiler-cli": "~20.0.0",
    "@types/jest": "^29.5.12",
    "jest": "^29.7.0",
    "jest-preset-angular": "^14.0.3",
    "typescript": "~5.8.0"
  },
  "jest": {
    "preset": "jest-preset-angular",
    "setupFilesAfterEnv": ["<rootDir>/setup-jest.ts"],
    "testPathIgnorePatterns": [
      "<rootDir>/node_modules/",
      "<rootDir>/dist/"
    ],
    "globals": {
      "ts-jest": {
        "tsconfig": "<rootDir>/tsconfig.spec.json",
        "stringifyContentPathRegex": "\\.(html|svg)$"
      }
    }
  }
}

// === ARCHIVO: client/angular.json ===
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "order-tracking-client": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:application": {
          "strict": true,
          "standalone": true
        },
        "@schematics/angular:component": {
          "standalone": true,
          "style": "scss"
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/order-tracking-client",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [],
            "scripts": []
          },
          "configurations": {
            "development": {
              "optimization": false,
              "outputHashing": "all",
              "sourceMap": true,
              "namedChunks": true,
              "extractLicenses": false,
              "vendorChunk": true
            },
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": true,
              "vendorChunk": false
            }
          },
          "defaultConfiguration": "development"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "development": {
              "browserTarget": "order-tracking-client:build:development"
            },
            "production": {
              "browserTarget": "order-tracking-client:build:production"
            }
          },
          "defaultConfiguration": "development"
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "order-tracking-client:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:jest",
          "options": {
            "polyfills": [
              "zone.js",
              "zone.js/testing"
            ],
            "tsConfig": "tsconfig.spec.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [],
            "scripts": []
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": [
              "tsconfig.app.json",
              "tsconfig.spec.json"
            ],
            "exclude": []
          }
        }
      }
    }
  },
  "cli": {
    "analytics": false
  }
}

// === ARCHIVO: client/tsconfig.json ===
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": [
      "ES2022",
      "dom",
      "dom.iterable"
    ],
    "useDefineForClassFields": false
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}

// === ARCHIVO: client/src/main.ts ===
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { environment } from './environments/environment';

/**
 * Configuración de la aplicación Angular con providers esenciales.
 * Incluye HttpClientModule para manejo de requests HTTP,
 * BrowserAnimationsModule para soporte de animaciones,
 * y configuración del router.
 */
const enhancedAppConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideHttpClient(withFetch()),
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimationsAsync(),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    {
      provide: 'API_BASE_URL',
      useValue: environment.apiBaseUrl
    }
  ]
};

/**
 * Punto de entrada de la aplicación Angular.
 * Bootstrappea el componente raíz AppComponent con la configuración
 * necesaria para manejar eventos en tiempo real y consumo de APIs.
 */
bootstrapApplication(AppComponent, enhancedAppConfig)
  .catch((err) => {
    console.error('Error bootstrapping Angular application:', err);
    // Fallback UI: muestra un mensaje de error en el DOM
    const errorElement = document.createElement('div');
    errorElement.style.position = 'fixed';
    errorElement.style.top = '0';
    errorElement.style.left = '0';
    errorElement.style.width = '100%';
    errorElement.style.backgroundColor = '#ffebee';
    errorElement.style.color = '#c62828';
    errorElement.style.padding = '16px';
    errorElement.style.boxSizing = 'border-box';
    errorElement.style.zIndex = '9999';
    errorElement.textContent = 'Error al iniciar la aplicación. Ver consola para detalles.';
    document.body.appendChild(errorElement);
  });

// === ARCHIVO: client/src/index.html ===
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Order Tracking - Sistema de Seguimiento de Órdenes</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Sistema de seguimiento de órdenes en tiempo real con integración Kafka">
  <meta name="keywords" content="order tracking, kafka, eventos, tiempo real, órdenes">
  <meta name="author" content="Pragma Team">
  <meta name="robots" content="index, follow">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
  <app-root>
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Roboto', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <mat-spinner diameter="60" color="accent"></mat-spinner>
      <p style="margin-top: 24px; font-size: 18px; font-weight: 300;">Cargando aplicación de seguimiento de órdenes...</p>
      <p style="margin-top: 8px; font-size: 14px; opacity: 0.8;">Conectando con el servidor de eventos</p>
    </div>
  </app-root>
  <noscript>
    <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
      <h1>JavaScript Requerido</h1>
      <p>Esta aplicación requiere JavaScript para funcionar. Por favor, habilite JavaScript en su navegador.</p>
    </div>
  </noscript>
</body>
</html>

// === ARCHIVO: client/src/app/app.config.ts ===
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([]),
    provideHttpClient(withFetch()),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimationsAsync()
  ]
};

// === ARCHIVO: client/src/app/app.component.ts ===
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <mat-icon>local_shipping</mat-icon>
      <span class="app-title">Order Tracking</span>
      <span class="spacer"></span>
      <button mat-icon-button aria-label="Notifications">
        <mat-icon>notifications</mat-icon>
      </button>
      <button mat-icon-button aria-label="User menu">
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>
    <main class="app-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .app-title {
      margin-left: 12px;
      font-weight: 500;
      font-size: 1.25rem;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .app-content {
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
      padding: 24px;
    }
  `]
})
export class AppComponent {
  title = 'Order Tracking Client';

  constructor() {
    console.log('Order Tracking Client initialized');
  }
}

// === ARCHIVO: client/src/app/features/order-tracking/order-tracking.component.ts ===
import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { OrderEventService } from '../../../services/order-event.service';
import { OrderEvent } from '../../shared/models/order-event.model';
import { OrderEventCardComponent } from '../../shared/order-event-card/order-event-card.component';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    OrderEventCardComponent
  ],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  events = signal<OrderEvent[]>([]);
  isLoading = signal<boolean>(false);
  connectionStatus = signal<'connected' | 'disconnected' | 'connecting'>('disconnected');
  lastUpdate = signal<Date | null>(null);
  
  eventCount = computed(() => this.events().length);
  hasEvents = computed(() => this.events().length > 0);
  
  private eventSource: EventSource | null = null;

  constructor(
    private orderEventService: OrderEventService,
    private snackBar: MatSnackBar
  ) {
    effect(() => {
      const count = this.eventCount();
      console.log(`[OrderTracking] Event count updated: ${count}`);
    });
  }

  ngOnInit(): void {
    this.connectToEventStream();
  }

  ngOnDestroy(): void {
    this.disconnectFromEventStream();
    this.destroy$.next();
    this.destroy$.complete();
  }

  connectToEventStream(): void {
    if (this.connectionStatus() === 'connected' || this.connectionStatus() === 'connecting') {
      return;
    }

    this.connectionStatus.set('connecting');
    this.isLoading.set(true);

    this.orderEventService.consumeOrderEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event) => this.handleNewEvent(event),
        error: (err) => this.handleConnectionError(err),
        complete: () => this.handleConnectionComplete()
      });
  }

  disconnectFromEventStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.connectionStatus.set('disconnected');
  }

  private handleNewEvent(event: OrderEvent): void {
    this.isLoading.set(false);
    this.connectionStatus.set('connected');
    this.lastUpdate.set(new Date());
    
    const currentEvents = this.events();
    const updatedEvents = [event, ...currentEvents].slice(0, 50);
    this.events.set(updatedEvents);
    
    this.snackBar.open(
      `Nuevo evento: ${event.eventType}`,
      'Cerrar',
      { duration: 3000, horizontalPosition: 'right', verticalPosition: 'top' }
    );
  }

  private handleConnectionError(error: any): void {
    console.error('[OrderTracking] Connection error:', error);
    this.connectionStatus.set('disconnected');
    this.isLoading.set(false);
    
    this.snackBar.open(
      'Error de conexión. Reconectando...',
      'Reintentar',
      { duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom' }
    ).onAction().subscribe(() => {
      this.connectToEventStream();
    });
  }

  private handleConnectionComplete(): void {
    this.connectionStatus.set('disconnected');
    this.isLoading.set(false);
    console.log('[OrderTracking] Event stream connection closed');
  }

  clearEvents(): void {
    this.events.set([]);
    this.snackBar.open('Eventos limpiados', 'OK', { duration: 2000 });
  }

  reconnect(): void {
    this.disconnectFromEventStream();
    setTimeout(() => this.connectToEventStream(), 500);
  }
}

// === ARCHIVO: client/src/app/features/order-tracking/order-tracking.component.html ===
<div class="order-tracking-container">
  <header class="tracking-header">
    <h1>Seguimiento de Órdenes</h1>
    <p class="subtitle">Eventos en tiempo real de tus órdenes</p>
  </header>

  <div class="controls-section">
    <button 
      mat-raised-button 
      [color]="isConnected ? 'warn' : 'primary'"
      (click)="toggleConnection()"
      [disabled]="isLoading"
      class="connection-toggle">
      <mat-icon>{{ isConnected ? 'stop' : 'play_arrow' }}</mat-icon>
      {{ isConnected ? 'Detener Conexión' : 'Iniciar Conexión' }}
    </button>

    <mat-chip-set aria-label="Estado de conexión">
      <mat-chip [class.connected]="isConnected" [class.disconnected]="!isConnected">
        <mat-icon>{{ isConnected ? 'wifi' : 'wifi_off' }}</mat-icon>
        {{ isConnected ? 'Conectado' : 'Desconectado' }}
      </mat-chip>
    </mat-chip-set>
  </div>

  <div class="events-section" *ngIf="events.length > 0; else emptyState">
    <div class="events-header">
      <h2>Eventos Recibidos</h2>
      <span class="event-count">{{ events.length }} evento(s)</span>
    </div>

    <div class="events-list" role="log" aria-live="polite">
      <app-order-event-card
        *ngFor="let event of events; trackBy: trackByEventId"
        [event]="event"
        class="event-item">
      </app-order-event-card>
    </div>
  </div>

  <ng-template #emptyState>
    <div class="empty-state" *ngIf="!isConnected && !isLoading">
      <mat-icon class="empty-icon">inbox</mat-icon>
      <h3>No hay eventos</h3>
      <p>Inicia la conexión para comenzar a recibir eventos de órdenes en tiempo real</p>
    </div>
  </ng-template>

  <div class="loading-overlay" *ngIf="isLoading">
    <mat-spinner diameter="48"></mat-spinner>
    <p>Estableciendo conexión con el servidor...</p>
  </div>

  <mat-error *ngIf="connectionError" class="error-banner">
    <mat-icon>error_outline</mat-icon>
    <span>{{ connectionError }}</span>
    <button mat-button (click)="toggleConnection()">Reintentar</button>
  </mat-error>
</div>

// === ARCHIVO: client/src/app/features/order-tracking/order-tracking.component.scss ===
.order-tracking-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.tracking-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #1a1a2e;
    margin: 0 0 0.5rem;
    letter-spacing: -0.5px;
  }

  .subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
  }
}

.controls-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  .connection-toggle {
    min-width: 180px;
    height: 44px;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    mat-icon {
      margin-right: 0.5rem;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }

  mat-chip {
    font-weight: 500;

    &.connected {
      background-color: #d1fae5;
      color: #065f46;
    }

    &.disconnected {
      background-color: #fee2e2;
      color: #991b1b;
    }

    mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }
  }
}

.events-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  .events-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;

    h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin: 0;
    }

    .event-count {
      font-size: 0.875rem;
      color: #6b7280;
      background: #e5e7eb;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }
  }

  .events-list {
    max-height: 600px;
    overflow-y: auto;
    padding: 1rem;

    .event-item {
      display: block;
      margin-bottom: 1rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .empty-icon {
    font-size: 64px;
    width: 64px;
    height: 64px;
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.5rem;
  }

  p {
    font-size: 0.9375rem;
    color: #6b7280;
    margin: 0;
    max-width: 400px;
    margin: 0 auto;
    line-height: 1.5;
  }
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  p {
    margin-top: 1rem;
    color: #6b7280;
    font-size: 0.9375rem;
  }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  margin-top: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-weight: 500;

  mat-icon {
    color: #dc2626;
  }

  span {
    flex: 1;
  }

  button {
    color: #dc2626;
  }
}

@media (max-width: 640px) {
  .order-tracking-container {
    padding: 1rem;
  }

  .tracking-header h1 {
    font-size: 1.5rem;
  }

  .controls-section {
    flex-direction: column;

    .connection-toggle {
      width: 100%;
    }
  }

  .events-section .events-list {
    max-height: 400px;
  }
}

// === ARCHIVO: client/src/app/shared/order-event-card/order-event-card.component.ts ===
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface OrderEvent {
  id: string;
  orderId: string;
  eventType: 'CREATED' | 'UPDATED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  timestamp: string;
  data: Record<string, unknown>;
  source: string;
}

@Component({
  selector: 'app-order-event-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-event-card.component.html',
  styleUrls: ['./order-event-card.component.scss']
})
export class OrderEventCardComponent {
  @Input({ required: true }) event!: OrderEvent;

  get eventTypeLabel(): string {
    const labels: Record<string, string> = {
      'CREATED': 'Creada',
      'UPDATED': 'Actualizada',
      'PROCESSING': 'Procesando',
      'SHIPPED': 'Enviada',
      'DELIVERED': 'Entregada',
      'CANCELLED': 'Cancelada'
    };
    return labels[this.event.eventType] || this.event.eventType;
  }

  get eventTypeIcon(): string {
    const icons: Record<string, string> = {
      'CREATED': 'add_circle',
      'UPDATED': 'edit',
      'PROCESSING': 'sync',
      'SHIPPED': 'local_shipping',
      'DELIVERED': 'check_circle',
      'CANCELLED': 'cancel'
    };
    return icons[this.event.eventType] || 'info';
  }

  get eventTypeColor(): string {
    const colors: Record<string, string> = {
      'CREATED': 'primary',
      'UPDATED': 'accent',
      'PROCESSING': 'accent',
      'SHIPPED': 'primary',
      'DELIVERED': 'primary',
      'CANCELLED': 'warn'
    };
    return colors[this.event.eventType] || 'primary';
  }

  get formattedTimestamp(): string {
    const date = new Date(this.event.timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getSourceLabel(source: string): string {
    const sources: Record<string, string> = {
      'order-service': 'Servicio de Órdenes',
      'notification-service': 'Servicio de Notificaciones',
      'payment-service': 'Servicio de Pagos',
      'shipping-service': 'Servicio de Envíos'
    };
    return sources[source] || source;
  }

  trackByKey(index: number, item: { key: string }): string {
    return item.key;
  }

  getDataKeys(): Array<{ key: string }> {
    return Object.keys(this.event.data || {}).map(key => ({ key }));
  }
}

// === ARCHIVO: client/src/app/shared/order-event-card/order-event-card.component.html ===
<div class="event-card" [class]="'event-card--' + (eventType$ | async)">
  <div class="event-card__header">
    <div class="event-card__icon">
      @switch (eventType$ | async) {
        @case ('ORDER_CREATED') {
          <mat-icon>add_shopping_cart</mat-icon>
        }
        @case ('ORDER_UPDATED') {
          <mat-icon>update</mat-icon>
        }
        @case ('ORDER_CANCELLED') {
          <mat-icon>cancel</mat-icon>
        }
        @case ('ORDER_SHIPPED') {
          <mat-icon>local_shipping</mat-icon>
        }
        @case ('ORDER_DELIVERED') {
          <mat-icon>check_circle</mat-icon>
        }
        @default {
          <mat-icon>receipt</mat-icon>
        }
      }
    </div>
    <div class="event-card__title">
      <span class="event-card__order-id">Orden #{{ orderEvent.orderId }}</span>
      <span class="event-card__type">{{ eventType$ | async }}</span>
    </div>
    <div class="event-card__timestamp">
      {{ formatTimestamp(orderEvent.timestamp) }}
    </div>
  </div>

  <div class="event-card__body">
    <div class="event-card__info-row">
      <span class="event-card__label">Cliente:</span>
      <span class="event-card__value">{{ orderEvent.customerName }}</span>
    </div>
    <div class="event-card__info-row">
      <span class="event-card__label">Email:</span>
      <span class="event-card__value">{{ orderEvent.customerEmail }}</span>
    </div>
    <div class="event-card__info-row">
      <span class="event-card__label">Estado:</span>
      <span class="event-card__status" [class]="'event-card__status--' + orderEvent.status.toLowerCase()">
        {{ orderEvent.status }}
      </span>
    </div>
    <div class="event-card__info-row">
      <span class="event-card__label">Total:</span>
      <span class="event-card__value event-card__value--price">
        {{ orderEvent.totalAmount | currency:orderEvent.currency }}
      </span>
    </div>
  </div>

  @if (orderEvent.items && orderEvent.items.length > 0) {
    <div class="event-card__items">
      <span class="event-card__label">Artículos ({{ orderEvent.items.length }}):</span>
      <ul class="event-card__items-list">
        @for (item of orderEvent.items; track item.productId) {
          <li class="event-card__item">
            <span class="event-card__item-name">{{ item.productName }}</span>
            <span class="event-card__item-qty">x{{ item.quantity }}</span>
          </li>
        }
      </ul>
    </div>
  }

  <div class="event-card__footer">
    <span class="event-card__source">
      <mat-icon class="event-card__source-icon">cloud</mat-icon>
      {{ orderEvent.source }}
    </span>
  </div>
</div>

// === ARCHIVO: client/src/app/shared/order-event-card/order-event-card.component.scss ===
.event-card {
  background: var(--mat-sys-surface-container-lowest, #ffffff);
  border-radius: 12px;
  border: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &--ORDER_CREATED {
    border-left: 4px solid #4caf50;
  }

  &--ORDER_UPDATED {
    border-left: 4px solid #2196f3;
  }

  &--ORDER_CANCELLED {
    border-left: 4px solid #f44336;
  }

  &--ORDER_SHIPPED {
    border-left: 4px solid #ff9800;
  }

  &--ORDER_DELIVERED {
    border-left: 4px solid #9c27b0;
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 16px;
    background: var(--mat-sys-surface-container-low, #f5f5f5);
    gap: 12px;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--mat-sys-primary-container, #e3f2fd);
    color: var(--mat-sys-primary, #1976d2);

    mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
  }

  &__title {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__order-id {
    font-weight: 600;
    font-size: 16px;
    color: var(--mat-sys-on-surface, #212121);
  }

  &__type {
    font-size: 12px;
    color: var(--mat-sys-on-surface-variant, #757575);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__timestamp {
    font-size: 12px;
    color: var(--mat-sys-on-surface-variant, #757575);
    white-space: nowrap;
  }

  &__body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__label {
    font-size: 13px;
    color: var(--mat-sys-on-surface-variant, #757575);
  }

  &__value {
    font-size: 14px;
    color: var(--mat-sys-on-surface, #212121);
    font-weight: 500;

    &--price {
      font-weight: 700;
      color: var(--mat-sys-primary, #1976d2);
    }
  }

  &__status {
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;

    &--pending {
      background: #fff3e0;
      color: #e65100;
    }

    &--processing {
      background: #e3f2fd;
      color: #1565c0;
    }

    &--shipped {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    &--delivered {
      background: #e8f5e9;
      color: #2e7d32;
    }

    &--cancelled {
      background: #ffebee;
      color: #c62828;
    }
  }

  &__items {
    padding: 0 16px 16px;
    border-top: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
    margin-top: 8px;
    padding-top: 16px;
  }

  &__items-list {
    list-style: none;
    margin: 8px 0 0;
    padding: 0;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 13px;
  }

  &__item-name {
    color: var(--mat-sys-on-surface, #212121);
  }

  &__item-qty {
    color: var(--mat-sys-on-surface-variant, #757575);
    font-weight: 500;
  }

  &__footer {
    padding: 12px 16px;
    border-top: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
    background: var(--mat-sys-surface-container-lowest, #fafafa);
  }

  &__source {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--mat-sys-on-surface-variant, #9e9e9e);
  }

  &__source-icon {
    font-size: 16px;
    width: 16px;
    height: 16px;
  }
}

// === ARCHIVO: client/src/services/order-event.service.ts ===
import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map, catchError, retry, takeUntil, tap } from 'rxjs/operators';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderEvent {
  eventId: string;
  eventType: 'ORDER_CREATED' | 'ORDER_UPDATED' | 'ORDER_CANCELLED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED';
  orderId: string;
  timestamp: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  source: string;
}

export interface OrderEventDTO {
  eventType: string;
  orderId: string;
  status: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  source: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderEventService implements OnDestroy {
  private readonly API_URL = 'http://localhost:3000';
  private readonly ENDPOINT = `${this.API_URL}/orders/events`;

  private eventSource: EventSource | null = null;
  private destroy$ = new Subject<void>();
  private connectionStatus$ = new BehaviorSubject<'connected' | 'disconnected' | 'connecting'>('disconnected');

  private orderEvents = signal<OrderEvent[]>([]);
  private lastEvent = signal<OrderEvent | null>(null);
  private isStreaming = signal<boolean>(false);

  readonly events = computed(() => this.orderEvents());
  readonly latestEvent = computed(() => this.lastEvent());
  readonly streaming = computed(() => this.isStreaming());
  readonly connectionStatus = computed(() => this.connectionStatus$.value);

  constructor(private http: HttpClient) {}

  consumeOrderEvents(): Observable<OrderEvent> {
    this.connectionStatus$.next('connecting');
    this.isStreaming.set(true);

    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(this.ENDPOINT);

    const eventSubject = new Subject<OrderEvent>();

    this.eventSource.onopen = () => {
      this.connectionStatus$.next('connected');
      console.log('[OrderEventService] SSE connection established');
    };

    this.eventSource.onerror = (error) => {
      console.error('[OrderEventService] SSE connection error:', error);
      this.connectionStatus$.next('disconnected');
      this.isStreaming.set(false);
      eventSubject.error(error);
    };

    this.eventSource.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data) as OrderEvent;
        this.handleNewEvent(data);
        eventSubject.next(data);
      } catch (parseError) {
        console.error('[OrderEventService] Failed to parse event data:', parseError);
      }
    });

    return eventSubject.asObservable().pipe(
      takeUntil(this.destroy$)
    );
  }

  private handleNewEvent(event: OrderEvent): void {
    this.orderEvents.update(events => [event, ...events]);
    this.lastEvent.set(event);
  }

  publishOrderEvent(eventDto: OrderEventDTO): Observable<{ accepted: boolean; eventId: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<{ accepted: boolean; eventId: string }>(
      this.ENDPOINT,
      eventDto,
      { headers }
    ).pipe(
      retry({ count: 3, delay: 1000 }),
      tap(response => {
        console.log('[OrderEventService] Event published successfully:', response.eventId);
      }),
      catchError(error => {
        console.error('[OrderEventService] Failed to publish event:', error);
        throw error;
      })
    );
  }

  getOrderEvents(): Observable<OrderEvent[]> {
    return this.http.get<OrderEvent[]>(this.ENDPOINT).pipe(
      catchError(error => {
        console.error('[OrderEventService] Failed to fetch order events:', error);
        return [];
      })
    );
  }

  clearEvents(): void {
    this.orderEvents.set([]);
    this.lastEvent.set(null);
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isStreaming.set(false);
    this.connectionStatus$.next('disconnected');
    console.log('[OrderEventService] SSE connection closed');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}

// === ARCHIVO: client/setup-jest.ts ===
// Setup de tests generado automaticamente (referenciado por la config del runner).
import 'jest-preset-angular/setup-jest';


// === ARCHIVO: client/src/app/app.routes.ts ===
import { Routes } from '@angular/router';
import { OrderTrackingComponent } from './features/order-tracking/order-tracking.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrderTrackingComponent,
    title: 'Seguimiento de Órdenes'
  },
  {
    path: '**',
    redirectTo: 'orders'
  }
];

// === ARCHIVO: client/src/environments/environment.ts ===
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',
  sseEndpoint: '/orders/events',
  wsReconnectInterval: 3000,
  maxReconnectAttempts: 5,
  eventBufferSize: 100,
  connectionTimeout: 10000
};

// === ARCHIVO: client/src/app/shared/models/order-event.model.ts ===
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

// === ARCHIVO: client/tsconfig.app.json ===
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts",
    "src/**/*.ts"
  ],
  "exclude": [
    "src/**/*.spec.ts"
  ]
}

// === ARCHIVO: client/tsconfig.spec.json ===
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": [
      "jest"
    ],
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  },
  "include": [
    "src/**/*.spec.ts",
    "src/**/*.d.ts"
  ],
  "exclude": []
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  kafka:
    image: "apache/kafka:3.8.0"
    ports:
      - "127.0.0.1:9092:9092"
    environment:
      KAFKA_NODE_ID: "1"
      KAFKA_PROCESS_ROLES: "broker,controller"
      KAFKA_LISTENERS: "PLAINTEXT://:9092,CONTROLLER://:9093"
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://localhost:9092"
      KAFKA_CONTROLLER_LISTENER_NAMES: "CONTROLLER"
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: "CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT"
      KAFKA_CONTROLLER_QUORUM_VOTERS: "1@localhost:9093"
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: "1"
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: "1"
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: "0"
    healthcheck:
      test: ["CMD-SHELL","/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server localhost:9092 > /dev/null 2>&1"]
      interval: 15s
      timeout: 10s
      retries: 10
      start_period: 30s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| Apache Kafka (KRaft, un nodo) | `apache/kafka:3.8.0` | 9092 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/kafka/create-topics.sh ===
#!/usr/bin/env bash
# Crea los topics en Kafka local (idempotente). Ejecutar con el compose levantado y healthy.
set -euo pipefail

docker compose exec -T kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --if-not-exists --topic app-events --partitions 1 --replication-factor 1

```
