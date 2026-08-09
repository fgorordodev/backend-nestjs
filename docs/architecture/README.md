# Arquitectura modular

El backend se organiza como un monolito modular. Se despliega como una sola aplicación NestJS, pero cada capacidad funcional mantiene una frontera explícita y una superficie pública pequeña.

## Objetivos

- Incorporar módulos completos con cambios mínimos en el composition root.
- Mantener infraestructura global fuera de los módulos de negocio.
- Evitar imports hacia archivos internos de otro módulo.
- Permitir que un módulo evolucione sin propagar detalles de implementación.
- Posponer capas, patrones y dependencias hasta que exista un caso concreto.

## Mapa de documentos

| Documento                                  | Propósito                                                    |
| ------------------------------------------ | ------------------------------------------------------------ |
| [Límites de módulos](module-boundaries.md) | Define responsabilidades y dirección de dependencias.        |
| [Plantilla de módulo](module-template.md)  | Muestra la estructura mínima y las extensiones opcionales.   |
| [Contratos públicos](public-contracts.md)  | Define qué puede exportar y consumir otro módulo.            |
| [Error codes](error-codes.md)              | Separa errores globales de errores propios de una capacidad. |
| [HealthModule](health-module.md)           | Registra el primer módulo real usado como referencia.        |
| [Checklist](new-module-checklist.md)       | Guía práctica para integrar un módulo nuevo.                 |

## Estructura de alto nivel

```text
src/
├── common/
├── config/
├── modules/
├── request-context/
├── app.module.ts
└── main.ts
```

`AppModule` es el composition root. Conecta configuración, capacidades transversales y módulos funcionales; no contiene lógica de negocio.

## Estado de la fase 9

- [x] Existe `src/modules/`.
- [x] `HealthModule` vive en `src/modules/health/`.
- [ ] Cada módulo expone un `index.ts` público.
- [ ] Los consumidores importan módulos únicamente desde su superficie pública.
- [ ] Los error codes modulares siguen una convención namespaced.
- [ ] Las reglas de este directorio están reflejadas en los siguientes módulos reales.
