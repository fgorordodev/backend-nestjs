# HealthModule como módulo de referencia

## Estado actual

`HealthModule` es el primer módulo real ubicado bajo `src/modules`:

```text
src/modules/health/
├── dto/
│   ├── health-response.dto.ts
│   └── index.ts
├── application-health.indicator.ts
├── health.controller.ts
└── health.module.ts
```

Se integra en `AppModule` y encapsula Terminus, el controller y el indicador de salud de la aplicación.

## Endpoints

```text
GET /health/live
GET /health/ready
```

Ambos endpoints son version-neutral y permanecen fuera del prefijo versionado de la API.

## Comportamiento transversal

El controller utiliza:

- `@SkipThrottle()` para que las sondas no consuman el rate limit;
- `@ApiExcludeController()` para no publicar endpoints operacionales en Swagger;
- `@HealthCheck()` para producir el contrato de Terminus;
- `VERSION_NEUTRAL` para evitar rutas como `/api/v1/health`.

El middleware de logging omite health checks exitosos, pero conserva fallos y requests abortados.

## Liveness y readiness

Actualmente ambas rutas verifican solamente que la aplicación pueda responder:

```ts
this.application.isHealthy('application');
```

La distinción se vuelve relevante al incorporar dependencias:

- **Liveness:** indica si el proceso está vivo. No debe fallar por una dependencia externa temporalmente caída.
- **Readiness:** indica si la instancia puede recibir tráfico. Puede incluir base de datos, caché u otras dependencias indispensables.

Ejemplo futuro:

```text
live  -> application
ready -> application + database
```

## Superficie pública pendiente

Durante la fase 9 se agregará:

```text
src/modules/health/index.ts
```

con:

```ts
export * from './health.module';
```

`AppModule` pasará de un import profundo:

```ts
import { HealthModule } from './modules/health/health.module';
```

a la superficie pública:

```ts
import { HealthModule } from './modules/health';
```

No es necesario exportar el controller ni el indicador, porque actualmente no tienen consumidores externos.

## Lecciones para otros módulos

- El módulo posee sus endpoints y providers.
- `AppModule` solo lo compone.
- Los detalles internos no se exportan.
- Las excepciones globales, logging y respuesta HTTP siguen siendo responsabilidad de `common`.
- Las dependencias futuras del readiness se incorporan mediante indicadores, no desde `AppModule`.
