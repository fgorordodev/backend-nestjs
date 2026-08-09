# Límites y dirección de dependencias

## Principio central

La dirección de dependencias va desde las capacidades concretas hacia las abstracciones globales, nunca al revés.

```text
main.ts
   │
   ▼
AppModule (composition root)
   ├── config
   ├── common
   ├── request-context
   └── modules
          └── módulo A ──► contrato público del módulo B
```

## `src/common`

Contiene comportamiento transversal independiente del dominio:

- contrato HTTP global;
- filtros, interceptores y pipes globales;
- logging;
- rate limiting;
- utilidades de validación;
- helpers y DTO de Swagger compartidos;
- errores HTTP comunes.

Reglas:

- `common` no importa desde `modules`.
- `common` no conoce entidades, DTO ni reglas de un dominio concreto.
- Un helper solo entra en `common` cuando tiene más de un consumidor real y no pertenece conceptualmente a uno de ellos.
- `common` no funciona como carpeta para código difícil de clasificar.

## `src/config`

Contiene configuración global y funciones de bootstrap:

- carga y validación del entorno;
- CORS, Helmet y body limits;
- prefijo, versionado y Swagger;
- proxy, shutdown y middleware global.

Una configuración exclusiva de un módulo permanece junto al módulo y se registra con `ConfigModule.forFeature()`.

```text
src/modules/payments/
├── payments.config.ts
└── payments.module.ts
```

## `src/request-context`

Es infraestructura transversal para propagar `requestId` mediante `AsyncLocalStorage`. No pertenece a un módulo de negocio y no debe importar desde `modules`.

Si en el futuro aparecen más capacidades de infraestructura compartida, podrán agruparse bajo `src/infrastructure/`, pero no se creará esa jerarquía antes de tener casos reales como base de datos, caché o mensajería.

## `src/modules`

Contiene capacidades funcionales u operacionales autocontenidas. Cada módulo es dueño de:

- sus controladores;
- sus DTO de entrada y salida;
- sus casos de uso o servicios;
- sus errores específicos;
- su configuración específica;
- sus adaptadores de persistencia cuando existan.

Un módulo puede importar:

- APIs de NestJS y librerías externas;
- contratos de `common`;
- configuración global cuando sea realmente global;
- la superficie pública de otro módulo.

Un módulo no puede importar:

- controladores de otro módulo;
- archivos internos o rutas profundas de otro módulo;
- repositorios o entidades de persistencia de otro módulo;
- `AppModule`;
- funciones de `main.ts` o bootstrap.

## `AppModule` como composition root

`AppModule` ensambla la aplicación:

```ts
@Module({
  imports: [
    ConfigModule.forRoot(/* ... */),
    RequestContextModule,
    LoggingModule,
    RateLimitModule,
    HealthModule,
  ],
})
export class AppModule {}
```

Puede registrar providers globales y módulos, pero no debe implementar reglas funcionales ni coordinar casos de uso.

## Dependencias entre módulos

La primera opción es consumir un servicio o facade exportado explícitamente por el módulo propietario.

```text
OrdersModule ──► public UserReader ──► UsersModule
```

Evitar una dependencia bidireccional. Si `OrdersModule` y `UsersModule` se necesitan mutuamente, revisar primero si:

- la responsabilidad pertenece a un tercer módulo;
- uno de los módulos solo necesita un contrato de lectura;
- la coordinación pertenece a un caso de uso de nivel superior.

`forwardRef()` es una salida excepcional, no el diseño por defecto.

## Regla de estabilidad

Los detalles internos pueden cambiar libremente. Todo símbolo exportado desde el `index.ts` del módulo se considera un contrato y debe modificarse de forma aditiva siempre que sea posible.
