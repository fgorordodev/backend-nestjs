# Architecture Decision Records

Los ADR registran decisiones costosas de revertir y el contexto que las motivó. El código explica qué existe; un ADR explica por qué se eligió esa dirección y qué alternativas se descartaron.

## Convención

```text
docs/decisions/NNNN-titulo-en-kebab-case.md
```

Cada ADR incluye:

- estado;
- fecha;
- contexto;
- decisión;
- alternativas consideradas;
- consecuencias.

## Ciclo de vida

```text
Proposed -> Accepted -> Superseded | Deprecated
```

Un ADR aceptado no se elimina. Si la decisión cambia, se crea otro ADR que referencia y reemplaza al anterior.

## Índice

| ADR                                        | Estado   | Decisión                                               |
| ------------------------------------------ | -------- | ------------------------------------------------------ |
| [0001](0001-pragmatic-modular-monolith.md) | Accepted | Organizar el backend como monolito modular pragmático. |
