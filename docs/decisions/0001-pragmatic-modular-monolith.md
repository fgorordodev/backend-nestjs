# ADR-0001: adoptar un monolito modular pragmático

## Estado

Accepted

## Fecha

2026-08-08

## Contexto

El repositorio funciona como una base production-ready sobre la que se incorporarán capacidades completas como persistencia, autenticación, pagos o mensajería.

Una estructura centrada únicamente en carpetas técnicas globales hace que cada nueva capacidad distribuya controller, service, DTO y persistencia por toda la aplicación. Eso aumenta el acoplamiento, vuelve ambiguo el propietario de cada regla y dificulta extraer o reemplazar una capacidad.

Al mismo tiempo, imponer Clean Architecture completa en módulos pequeños produciría carpetas vacías, interfaces sin consumidores y wrappers que no reducen complejidad.

## Decisión

Organizar las capacidades bajo `src/modules/<name>/` y desplegarlas como una sola aplicación NestJS.

Cada módulo:

- posee sus endpoints, casos de uso, DTO, errores y adaptadores específicos;
- expone una superficie pública mínima mediante `index.ts`;
- consume otros módulos únicamente a través de contratos públicos;
- empieza con una estructura simple;
- agrega capas internas cuando la complejidad real lo exige.

`AppModule` actúa como composition root. `common`, `config` y `request-context` contienen capacidades transversales y no importan lógica desde módulos funcionales.

`HealthModule` es el primer módulo real utilizado para aplicar y validar esta organización.

## Alternativas consideradas

### Organización exclusivamente por tipo técnico

```text
controllers/
services/
dto/
repositories/
```

Ventajas:

- familiar en aplicaciones pequeñas;
- navegación inicial sencilla.

Desventajas:

- una funcionalidad queda repartida por todo el repositorio;
- las fronteras y propietarios son implícitos;
- favorece imports cruzados y servicios globales.

Se rechaza porque no cumple el objetivo de integrar módulos autocontenidos.

### Clean Architecture obligatoria por módulo

```text
domain/
application/
infrastructure/
presentation/
```

Ventajas:

- separación fuerte de responsabilidades;
- útil para dominios complejos y múltiples adaptadores.

Desventajas:

- añade ceremonia en módulos simples;
- incentiva abstracciones antes de tener más de una implementación;
- eleva el costo de navegación y mantenimiento.

Se posterga como estructura opcional que un módulo adopta cuando la complejidad la justifica.

### Microservicios desde el inicio

Ventajas:

- despliegue y escalado independientes;
- aislamiento de fallos por proceso.

Desventajas:

- red, observabilidad distribuida, consistencia eventual y despliegues múltiples;
- contratos remotos más costosos de cambiar;
- complejidad operacional sin carga o equipos que la justifiquen.

Se rechaza para el estado actual. Las fronteras modulares preservan una ruta de extracción futura sin pagar el costo distribuido ahora.

## Consecuencias

### Positivas

- Cada capacidad tiene un propietario y directorio claros.
- Los cambios suelen permanecer dentro de un módulo.
- `AppModule` conserva el rol de ensamblaje.
- Los contratos públicos vuelven visibles los acoplamientos.
- Es posible introducir capas avanzadas módulo por módulo.

### Costos

- El equipo debe revisar y mantener las superficies públicas.
- Las dependencias circulares requieren rediseño en lugar de imports rápidos.
- La disciplina no queda garantizada solamente por carpetas; CI y revisión deben hacer cumplir las reglas.

### Riesgos aceptados

- Durante la migración pueden coexistir imports profundos con imports públicos.
- Los error codes modulares requieren una extensión compatible del contrato actual.
- Algunas capacidades transversales todavía viven en carpetas históricas y podrán reorganizarse cuando existan más casos reales.

## Criterios para revisar la decisión

Revisar este ADR si ocurre alguna de estas condiciones:

- una capacidad necesita despliegue o escalado independiente de forma sostenida;
- varios módulos requieren límites transaccionales incompatibles;
- múltiples transportes justifican capas internas consistentes;
- el número de dependencias cruzadas indica que las fronteras actuales no representan el dominio.
