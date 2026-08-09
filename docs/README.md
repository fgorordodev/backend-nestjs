# Documentación del backend base

Este directorio reúne las decisiones y reglas que permiten extender el backend sin convertir `common` ni `AppModule` en dependencias de negocio.

## Arquitectura

- [Índice de arquitectura](architecture/README.md)
- [Límites y dirección de dependencias](architecture/module-boundaries.md)
- [Plantilla pragmática de módulos](architecture/module-template.md)
- [Contratos públicos entre módulos](architecture/public-contracts.md)
- [Error codes globales y modulares](architecture/error-codes.md)
- [HealthModule como módulo de referencia](architecture/health-module.md)
- [Checklist para incorporar un módulo](architecture/new-module-checklist.md)

## Decisiones

- [Índice de ADR](decisions/README.md)
- [ADR-0001: monolito modular pragmático](decisions/0001-pragmatic-modular-monolith.md)

## Estado

La estructura modular está en evolución. Cada documento diferencia entre:

- **Actual:** comportamiento que ya existe en el repositorio.
- **Objetivo de fase 9:** contrato aprobado pero todavía pendiente de implementación completa.
- **Futuro:** opción deliberadamente postergada hasta que exista una necesidad real.
