# Plantilla pragmática de módulo

## Estructura mínima

Un módulo simple comienza con la menor estructura que permita entenderlo:

```text
src/modules/orders/
├── dto/
│   ├── create-order.dto.ts
│   └── index.ts
├── errors/
│   ├── order-error-code.ts
│   └── index.ts
├── orders.controller.ts
├── orders.service.ts
├── orders.module.ts
└── index.ts
```

No todas las carpetas son obligatorias. Si el módulo no recibe entrada HTTP o todavía no tiene errores propios, no se crean `dto/` o `errors/` vacías.

## Módulo

```ts
import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
```

Solo incluir `exports` cuando exista un consumidor externo real. Un servicio interno no se exporta preventivamente.

## Controller

El controller es una frontera HTTP:

- recibe parámetros y DTO validados;
- invoca un caso de uso;
- selecciona status y decorators de Swagger;
- no implementa reglas de negocio;
- no accede directamente a la base de datos.

```ts
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  create(@Body() input: CreateOrderDto): Promise<OrderView> {
    return this.orders.create(input);
  }
}
```

El interceptor global envuelve el resultado dentro de `ApiResponse<T>`; el controller no construye manualmente esa envoltura.

## Service

El service expresa casos de uso y reglas del módulo. Puede comenzar como una clase única y dividirse cuando la cantidad de responsabilidades lo justifique.

```ts
@Injectable()
export class OrdersService {
  create(input: CreateOrderInput): Promise<OrderView> {
    // Orquestación del caso de uso.
  }
}
```

## DTO

Los DTO pertenecen al límite que validan. Los DTO HTTP utilizan `class-validator`, `class-transformer` y decorators de Swagger cuando corresponda.

Separar entrada y salida:

```text
CreateOrderDto   -> entrada HTTP
OrderView        -> salida pública
OrderRecord      -> representación de persistencia, no pública
```

No reutilizar automáticamente una entidad de base de datos como respuesta HTTP.

## Configuración específica

Cuando un módulo necesita variables propias:

```ts
export default registerAs('payments', () => ({
  timeoutMs: Number(process.env.PAYMENTS_TIMEOUT_MS ?? 3000),
}));
```

El módulo registra su configuración:

```ts
@Module({
  imports: [ConfigModule.forFeature(paymentsConfig)],
})
export class PaymentsModule {}
```

Las variables también deben añadirse al esquema de validación y a `.env.example` cuando formen parte del contrato operativo de la aplicación.

## Capas opcionales

Agregar una capa solo cuando reduzca complejidad real:

```text
src/modules/orders/
├── application/      # varios casos de uso o puertos
├── domain/           # invariantes y modelos independientes
├── infrastructure/   # persistencia o clientes externos
└── presentation/     # múltiples transportes, si se justifica
```

No crear estas carpetas como ceremonia. Tres archivos claros son preferibles a diez wrappers sin comportamiento.

## Integración

El módulo se conecta en `AppModule` mediante su superficie pública:

```ts
import { OrdersModule } from './modules/orders';

@Module({
  imports: [OrdersModule],
})
export class AppModule {}
```

El cambio mínimo esperado para instalar un módulo autocontenido es:

1. copiar o crear su directorio;
2. declarar configuración de entorno necesaria;
3. importarlo en `AppModule`;
4. ejecutar los quality gates.
