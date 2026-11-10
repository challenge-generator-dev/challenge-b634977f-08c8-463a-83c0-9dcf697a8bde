# AGENTS.md

Instrucciones para el agente de IA que abra este repositorio (Claude Code, Cursor, Codex, Copilot, Gemini). Se cargan solas: no hay que pegar nada en ningun chat.

## Que es este repositorio

Es el codigo base de un reto de aprendizaje de Pragma: **Integración de eventos en tiempo real con Kafka**.

| | |
|---|---|
| Tema | Consumo de eventos en tiempo real con Kafka |
| Nivel | advanced-l2 |
| Chapter | Frontend |
| Especialidad | Angular |
| Stack | TypeScript / Angular 20 |
| Patron arquitectonico | componentes contenedores/presentacionales con Signals y RxJS |
| Tiempo estimado | 8 horas |

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

## Receta del stack

Esqueleto obligatorio:

- `package.json, angular.json y tsconfig.json en la raiz`
- `src/main.ts con bootstrapApplication`
- `src/app/app.config.ts con los providers`
- `src/app/core con servicios y modelos`
- `src/app/features con componentes contenedores`
- `src/app/shared con componentes presentacionales`

Trampas conocidas:

- No inventes versiones de npm: una version inexistente hace fallar `npm install` con ETARGET y el proyecto no instala. Usa rango con caret sobre una version que exista.
- El `package.json` tiene que ser JSON valido y UNICO: nada despues de la llave de cierre.
- Angular necesita `angular.json` y `tsconfig.json` ademas del `package.json`, o `ng build` no corre.

Dependencias:

- @angular/core 20.0.0
- @angular/common 20.0.0
- @angular/platform-browser 20.0.0
- @angular/platform-browser-dynamic 20.0.0
- @angular/router 20.0.0
- @angular/forms 20.0.0
- @angular/material 20.0.0
- rxjs 7.8.1
- zone.js 0.14.2
- jest 29.7.0
- @angular-devkit/build-angular 20.0.0
- @angular/cli 20.0.0

## Tu tarea

Dejar este proyecto en estado **verificable**: que el comando de verificacion corra sin errores. Escribi los archivos en disco, en este repositorio. No generes ZIPs ni archivos adjuntos.

En orden:

1. Segui el orden de arranque del mapa de componentes (infraestructura local primero) y corre `(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q` desde la raiz: mira que falla.
2. Completa lo que falte de la lista de abajo: manifiesto de dependencias, punto de entrada, capa de interfaz y las capas del patron declarado.
3. Arregla SOLO los errores que impiden compilar o arrancar.
4. Volve a correr `(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q` hasta que pase.
5. Pará ahí.

## Regla dura: las fases son trabajo del humano

**PROHIBIDO implementar los entregables de las fases.** El valor del reto esta en que la persona los resuelva. Tu trabajo es que tenga un proyecto que arranca; el hueco pedagogico se queda como esta.

No resuelvas nada de esto:

- **Fase 1 — Configuración inicial del entorno**: Entorno de desarrollo configurado con Kafka y Angular listo para la integración de eventos.
- **Fase 2 — Publicación de eventos en Kafka**: Servicio en Angular que publica eventos de órdenes en Kafka.
- **Fase 3 — Consumo de eventos en Kafka**: Servicio en Angular que consume eventos de órdenes desde Kafka y los muestra en tiempo real en la interfaz de usuario.

Distincion operativa:

- **Arreglar** (si): import faltante, tipo que no existe, dependencia sin declarar, error de sintaxis, archivo referenciado que no existe.
- **No tocar** (no): logica de negocio incompleta, validaciones ausentes, secretos hardcodeados, APIs deprecadas que funcionan, concurrencia insegura, patrones mejorables. Eso es lo que la persona tiene que encontrar.

## Lo que falta y tenes que completar

### 1. Referencias colgando (4)

Salieron de un analisis estatico del codigo que SI esta en el repo. Cada una rompe la compilacion:

- [ ] `api/src/application/services/order.event.service.ts` — `OrderEvent.push`
      Se invoca `push` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/application/services/order.event.service.ts` — `OrderEvent.shift`
      Se invoca `shift` sobre `OrderEvent`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/src/application/services/event.emitter.service.ts` — `EventHandlerMetadata.push`
      Se invoca `push` sobre `EventHandlerMetadata`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- [ ] `api/package.json` — `@nestjs/event-emitter@8.0.0`
      @nestjs/event-emitter declara el rango ^8.0.0, que no resuelve a ninguna version publicada: `npm install` falla con ETARGET. Reemplazala por una version publicada real.

### Presentes (40)

- `api/package.json`
- `api/tsconfig.json`
- `api/src/main.ts`
- `api/src/domain/order.event.ts`
- `api/src/domain/ports/order.event.port.ts`
- `api/src/app.module.ts`
- `api/src/application/application.module.ts`
- `api/src/application/services/order.event.service.ts`
- `api/src/application/services/event.emitter.service.ts`
- `api/src/infrastructure/adapters/kafka.producer.ts`
- `api/src/infrastructure/adapters/kafka.consumer.ts`
- `api/src/infrastructure/controllers/order.event.controller.ts`
- `api/src/config/kafka.config.ts`
- `api/test/order.event.service.spec.ts`
- `api/src/domain/domain.module.ts`
- `api/src/application/services/order.event.publisher.ts`
- `api/src/application/services/order.event.subscriber.ts`
- `client/package.json`
- `client/angular.json`
- `client/tsconfig.json`
- `client/src/main.ts`
- `client/src/index.html`
- `client/src/app/app.config.ts`
- `client/src/app/app.component.ts`
- `client/src/app/features/order-tracking/order-tracking.component.ts`
- `client/src/app/features/order-tracking/order-tracking.component.html`
- `client/src/app/features/order-tracking/order-tracking.component.scss`
- `client/src/app/shared/order-event-card/order-event-card.component.ts`
- `client/src/app/shared/order-event-card/order-event-card.component.html`
- `client/src/app/shared/order-event-card/order-event-card.component.scss`
- `client/src/services/order-event.service.ts`
- `client/setup-jest.ts`
- `client/src/app/app.routes.ts`
- `client/src/environments/environment.ts`
- `client/src/app/shared/models/order-event.model.ts`
- `client/tsconfig.app.json`
- `client/tsconfig.spec.json`
- `docker-compose.yml`
- `infra-local/README.md`
- `infra-local/kafka/create-topics.sh`

### Capas del patron declarado

Cada una tiene que existir como directorio real con al menos un archivo. Codigo plano en la raiz no satisface el patron.

- `api`
- `api/src/domain`
- `api/src/application`
- `api/src/infrastructure`
- `api/src/config`
- `api/test`
- `client`
- `client/src/app/core`
- `client/src/app/features/order-tracking`
- `client/src/app/shared`
- `client/src/services`

## Verificacion

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

Ese comando pasando es la definicion de "terminado" para vos.

## Convenciones que tenes que respetar

- Un solo ecosistema: no declares librerias de otro lenguaje ni mezcles gestores de paquetes.
- Toda libreria que uses tiene que estar declarada en el manifiesto de dependencias.
- Todo import declarado tiene que usarse; todo tipo usado tiene que existir o venir de una dependencia declarada.
- Cada componente vive en su carpeta: instala y compila dentro de ella, y no muevas archivos entre componentes.
- Respeta los contratos entre componentes (endpoints, topics) tal como estan declarados en el mapa de componentes.
- El patron es **componentes contenedores/presentacionales con Signals y RxJS**: los contratos (interfaces, puertos) los define la capa interna y los implementa la externa, nunca al revés.
- Los archivos que crees llevan implementacion real, no stubs: sin `TODO`, sin cuerpos vacios, sin `// getters y setters`.

## Contexto del candidato

Sirve para calibrar el nivel del codigo, no para resolver las fases.

- Perfil: Chapter Frontend, Especialidad Desarrollador, Tecnología Angular, Advanced L2
- Brecha que el reto ataca: Publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real (corrida e2e 20261109223818458), Publica y consume eventos de un topic Kafka y refleja los mensajes en la interfaz
- Mision: Mostrar en vivo el estado de las ordenes

---

*Generado por Challenge Generator — Pragma. `README.md` tiene el enunciado completo del reto para la persona. `PROMPT_MEJORA.md` es la variante para pegar en un chat, si se prefiere ese flujo.*
