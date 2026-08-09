# Contratos públicos entre módulos

## Objetivo

Un consumidor debe poder entender qué ofrece un módulo sin recorrer sus archivos internos. La superficie pública está definida por el `index.ts` ubicado en la raíz del módulo.

```text
src/modules/orders/index.ts
```

## Exportaciones permitidas

Exportar únicamente símbolos diseñados para consumidores externos:

```ts
export * from './orders.module';
export * from './orders-reader.service';
export * from './errors';
```

Según el caso pueden ser públicos:

- el módulo Nest;
- una facade o servicio de lectura deliberadamente estable;
- tokens de inyección;
- tipos de entrada o salida usados entre módulos;
- error codes que un consumidor necesite interpretar.

## Exportaciones que deben evitarse

No exportar por defecto:

- controllers;
- repositorios concretos;
- entidades ORM;
- helpers internos;
- DTO exclusivos de transporte HTTP;
- implementaciones de clientes externos;
- todos los archivos mediante barrels recursivos.

## Import correcto

```ts
import { OrdersModule, OrdersReader } from '../orders';
```

## Import incorrecto

```ts
import { OrdersRepository } from '../orders/infrastructure/orders.repository';
```

El import profundo acopla al consumidor con la organización interna e impide refactorizar el módulo propietario.

## Providers públicos

Nest solo permite inyectar providers que el módulo exporta. Esa limitación es parte de la frontera, no un obstáculo que deba evitarse exportando todo.

```ts
@Module({
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService],
})
export class OrdersModule {}
```

`OrdersRepository` permanece privado. Si otros módulos necesitan leer órdenes, se expone una interfaz orientada a ese caso de uso, no el mecanismo de persistencia.

## Contratos de entrada y salida

Un método público debe declarar qué recibe, qué devuelve y qué errores puede producir.

```ts
export type FindOrderInput = {
  orderId: string;
};

export type OrderSummary = {
  id: string;
  status: string;
};

export interface OrdersReader {
  findById(input: FindOrderInput): Promise<OrderSummary | null>;
}
```

Preferir tipos específicos del caso de uso. Evitar objetos genéricos, `any`, entidades ORM o respuestas HTTP como contratos internos.

## Compatibilidad

Una exportación pública se modifica de forma aditiva:

- añadir campos opcionales antes que cambiar campos existentes;
- añadir métodos antes que alterar semántica existente;
- deprecar antes de eliminar;
- evitar que textos de error sean la única señal interpretable;
- utilizar error codes estables para decisiones automáticas.

## Comunicación asincrónica

Eventos o colas podrán desacoplar módulos cuando exista una necesidad real. No se incorpora un event bus durante la fase 9. Una llamada directa mediante un contrato público es más simple y suficiente para el estado actual.

## Estado actual

`HealthModule` todavía se importa mediante una ruta directa a `health.module.ts`. El objetivo pendiente es agregar su `index.ts` e importar `HealthModule` desde `./modules/health`.
