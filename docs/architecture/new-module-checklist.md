# Checklist para incorporar un módulo

## Antes de implementar

- [ ] La capacidad tiene un propietario y propósito claros.
- [ ] No existe ya otro módulo responsable del comportamiento.
- [ ] Los endpoints, entradas, salidas y errores están definidos.
- [ ] Las dependencias con otros módulos están identificadas.
- [ ] La rama de trabajo nace desde `dev`.

```bash
git switch dev
git pull --ff-only origin dev
git switch -c codex/<trabajo>
```

## Estructura

- [ ] El módulo vive en `src/modules/<name>/`.
- [ ] Existe `<name>.module.ts`.
- [ ] Solo se crean carpetas que contienen comportamiento real.
- [ ] Los DTO están separados de modelos de persistencia.
- [ ] Los errores funcionales pertenecen al módulo.
- [ ] Existe un `index.ts` con una superficie pública mínima.

## Dependencias

- [ ] El módulo no importa `AppModule` ni `main.ts`.
- [ ] `common` no fue modificado para alojar lógica específica del módulo.
- [ ] No hay imports profundos hacia internals de otro módulo.
- [ ] No existe una dependencia circular.
- [ ] Cada provider exportado tiene un consumidor externo real.

## HTTP y contratos

- [ ] La entrada externa se valida mediante DTO.
- [ ] El controller no construye manualmente `ApiResponse<T>`.
- [ ] Los errores usan status HTTP y error code coherentes.
- [ ] Los endpoints están versionados o son neutral de forma deliberada.
- [ ] Swagger documenta entradas y salidas públicas cuando corresponde.
- [ ] Las listas definen paginación antes de crecer sin límite.

## Configuración y seguridad

- [ ] Las variables nuevas están tipadas y validadas.
- [ ] `.env.example` documenta valores no sensibles.
- [ ] No hay secretos hardcodeados ni incluidos en logs.
- [ ] Clientes externos tienen timeout y tratamiento explícito de errores.
- [ ] Las respuestas externas se consideran datos no confiables.

## Verificación

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
docker compose config --quiet
docker build --check .
```

- [ ] Los quality gates pasan localmente.
- [ ] El comportamiento nuevo fue comprobado manualmente.
- [ ] No se modificaron contratos ajenos al alcance.
- [ ] El diff no contiene `.env`, credenciales ni build output.

## Integración

- [ ] El commit describe una sola unidad lógica.
- [ ] La rama fue publicada.
- [ ] El PR apunta a `dev`, no a `main`.
- [ ] Los jobs `Code quality` y `Production container` pasan.
- [ ] La rama de trabajo se elimina después del merge.

```text
codex/<trabajo> -> dev -> main
```

`dev` se promueve a `main` mediante un PR de release cuando el conjunto integrado está listo para producción.
