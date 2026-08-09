# Error codes globales y modulares

## Propósito

`errorCode` es un contrato estable y legible por máquinas. El cliente puede tomar decisiones usando el código sin depender del texto localizado de `message`.

```json
{
  "success": false,
  "message": "La orden no existe",
  "errorCode": "ORDER.NOT_FOUND",
  "requestId": "...",
  "data": null
}
```

## Estado actual

Los códigos globales viven en:

```text
src/common/errors/error-code.ts
```

Incluyen errores HTTP transversales como:

```text
BAD_REQUEST
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
INTERNAL_SERVER_ERROR
```

El type guard actual solo acepta valores incluidos explícitamente en ese catálogo. Por lo tanto, los códigos propios de módulos todavía no están implementados.

## Objetivo de fase 9

Mantener los códigos globales existentes y permitir códigos namespaced pertenecientes a cada módulo:

```text
<MODULE>.<CODE>
```

Ejemplos:

```text
ORDER.NOT_FOUND
ORDER.INVALID_STATE
USER.EMAIL_ALREADY_EXISTS
AUTH.INVALID_CREDENTIALS
```

Convención propuesta:

- mayúsculas ASCII;
- palabras separadas por `_`;
- exactamente un namespace de módulo y un código separados por `.`;
- el código describe una condición estable, no el texto mostrado al usuario.

Patrón objetivo:

```regex
^[A-Z][A-Z0-9_]*\.[A-Z][A-Z0-9_]*$
```

## Catálogo local

Cada módulo define su propio catálogo:

```ts
export const OrderErrorCode = {
  NOT_FOUND: 'ORDER.NOT_FOUND',
  INVALID_STATE: 'ORDER.INVALID_STATE',
  ALREADY_PAID: 'ORDER.ALREADY_PAID',
} as const;

export type OrderErrorCode =
  (typeof OrderErrorCode)[keyof typeof OrderErrorCode];
```

Ubicación:

```text
src/modules/orders/errors/order-error-code.ts
```

## Responsabilidades

`common` es dueño de errores HTTP transversales. El módulo es dueño de errores que expresan reglas de su capacidad.

| Condición             | Propietario            | Ejemplo                     |
| --------------------- | ---------------------- | --------------------------- |
| JSON inválido         | `common`               | `INVALID_REQUEST_BODY`      |
| Credenciales ausentes | `common` o auth global | `UNAUTHORIZED`              |
| Orden inexistente     | orders                 | `ORDER.NOT_FOUND`           |
| Transición inválida   | orders                 | `ORDER.INVALID_STATE`       |
| Email duplicado       | users                  | `USER.EMAIL_ALREADY_EXISTS` |

## Semántica HTTP

El error code no reemplaza el status HTTP:

```text
404 + ORDER.NOT_FOUND
409 + ORDER.INVALID_STATE
400 + VALIDATION_ERROR
500 + INTERNAL_SERVER_ERROR
```

El status expresa la categoría HTTP. El código expresa la condición funcional concreta.

## Validación y seguridad

El filtro global solo debe exponer un código explícito cuando sea una cadena válida según el catálogo global o la convención modular. Un valor inválido cae al código derivado del status HTTP.

Los controllers no aceptan `errorCode` desde el cliente para devolverlo sin validación. El código se origina en lógica controlada por la aplicación.

## Compatibilidad

- No renombrar un código publicado sin una estrategia de migración.
- `message` puede cambiar o traducirse; `errorCode` debe permanecer estable.
- Eliminar un código requiere confirmar que ningún cliente lo consume.
- Agregar un código nuevo es un cambio aditivo.

## Alternativa postergada

Un registry dinámico de códigos permitiría registrar catálogos desde cada módulo en runtime. Se posterga porque añade inicialización, estado global y complejidad de DI sin una necesidad actual. La convención namespaced ofrece aislamiento suficiente para esta base.
