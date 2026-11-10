# Integración de eventos en tiempo real con Kafka

El sistema de seguimiento de órdenes debe publicar y consumir eventos en un topic Kafka y mostrarlos en tiempo real en la interfaz de usuario. Los eventos representan el estado de las órdenes, que deben ser reflejados dinámicamente en la interfaz. Los eventos pueden provenir de múltiples fuentes, incluyendo el servicio de procesamiento de órdenes y el servicio de notificación de clientes. El sistema debe manejar la publicación y el consumo de eventos de manera eficiente y confiable, asegurando que los usuarios vean el estado actualizado de las órdenes en todo momento.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Consumo de eventos en tiempo real con Kafka |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial del entorno

**Objetivo:** Establecer un entorno de desarrollo con Kafka y Angular para la publicación y consumo de eventos.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configura un cluster de Kafka local o en la nube.
- Crea un topic Kafka para los eventos de órdenes.
- Configura un proyecto Angular para mostrar los eventos en tiempo real.

**Entregable:** Entorno de desarrollo configurado con Kafka y Angular listo para la integración de eventos.

<details>
<summary>Pistas de conocimiento</summary>

- Configuración de Kafka y Angular.
- Creación y gestión de topics en Kafka.

</details>

### Fase 2: Publicación de eventos en Kafka

**Objetivo:** Implementar la funcionalidad para publicar eventos de órdenes en un topic Kafka.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Desarrolla un servicio en Angular que publique eventos de órdenes en el topic Kafka.
- Asegura que los eventos se publiquen de manera eficiente y confiable.
- Maneja posibles errores de publicación y proporciona retroalimentación al usuario.

**Entregable:** Servicio en Angular que publica eventos de órdenes en Kafka.

<details>
<summary>Pistas de conocimiento</summary>

- Uso de la API de Kafka para la publicación de eventos.
- Manejo de errores en la publicación de eventos.

</details>

### Fase 3: Consumo de eventos en Kafka

**Objetivo:** Implementar la funcionalidad para consumir eventos de órdenes desde un topic Kafka y mostrarlos en tiempo real en la interfaz de usuario.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Desarrolla un servicio en Angular que consuma eventos de órdenes desde el topic Kafka.
- Muestra los eventos consumidos en tiempo real en la interfaz de usuario.
- Asegura que los eventos se consuman de manera eficiente y confiable.
- Maneja posibles errores de consumo y proporciona retroalimentación al usuario.

**Entregable:** Servicio en Angular que consume eventos de órdenes desde Kafka y los muestra en tiempo real en la interfaz de usuario.

<details>
<summary>Pistas de conocimiento</summary>

- Uso de la API de Kafka para el consumo de eventos.
- Manejo de errores en el consumo de eventos.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es Kafka y cómo se utiliza para la publicación y consumo de eventos?
- **paraQueSirve**: ¿Para qué sirve la integración de Kafka con Angular en este contexto?
- **comoSeUsa**: ¿Cómo se usa la API de Kafka para publicar y consumir eventos?
- **erroresComunes**: ¿Cuáles son los errores comunes al publicar y consumir eventos en Kafka y cómo se manejan?

## Criterios de Evaluacion

- Configuración correcta del entorno de desarrollo con Kafka y Angular.
- Implementación eficiente y confiable de la publicación de eventos en Kafka.
- Implementación eficiente y confiable del consumo de eventos desde Kafka.
- Manejo adecuado de errores en la publicación y consumo de eventos.
- Mostrar en vivo el estado de las órdenes en la interfaz de usuario.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

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

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
