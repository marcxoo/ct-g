# Design System — Coffee Manual V2

Fecha: 2026-06-12

Este documento define el sistema de diseño básico y tokens visuales aplicados a la app de la cafetería, usando la paleta proporcionada:

- `#144639` — color primario (verde oscuro)
- `#cab470` — color secundario / acento (beige dorado)
- `#ffffff` — color de fondo / blanco

## Tokens CSS

Definir variables globales para usar desde `globals.css` o componentes:

```css
:root {
  /* Palette */
  --color-primary: #144639; /* uso: encabezados, botones primarios */
  --color-accent: #cab470;  /* uso: highlights, badges, links */
  --color-bg: #ffffff;      /* fondo principal */

  /* Text colors */
  --text-on-primary: #ffffff; /* texto encima de color-primary */
  --text-default: #1C1917;   /* gris muy oscuro para legibilidad */

  /* UI */
  --surface: #FFFFFF;        /* tarjetas, fondos elevados */
  --muted: #F3F2F1;          /* superficies neutrales */
}
```

## Contraste y accesibilidad

- `#144639` con texto blanco tiene suficiente contraste para títulos y botones; usar `--text-on-primary`.
- `#cab470` sobre texto oscuro (ej. `#1C1917`) ofrece buen contraste; evita texto blanco sobre `#cab470` en tamaños pequeños.
- Validar con herramientas de contraste (WCAG 2.1) para componentes críticos.

## Componentes y usos recomendados

- Botón primario

```css
.btn-primary {
  background: var(--color-primary);
  color: var(--text-on-primary);
  border-radius: 12px;
  padding: 0.9rem 1.2rem;
}
```

- Badge / etiqueta de categoría

```css
.badge-accent {
  background: var(--color-accent);
  color: var(--text-default);
  font-weight: 800;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
}
```

- Fondo general

Usar `--color-bg` como fondo de la aplicación; tarjetas y elevaciones usan `--surface` y `--muted` para separación visual.

## Ejemplos rápidos

- Header: fondo `--color-bg`, título en `--text-default`, botón de acción en `.btn-primary`.
- Lista de recetas: tarjetas con `--surface`, iconos/accentos en `--color-accent`, acciones (favoritos) con `--color-primary` o rojo puntual.

## Siguientes pasos recomendados

1. Añadir estas variables a `src/app/globals.css` y ajustar clases utilitarias existentes para usar tokens.
2. Revisar todos los botones y badges para asegurar contraste (especialmente tamaños pequeños).
3. Si quieres, puedo aplicar los cambios automáticamente en `globals.css` ahora.

---
Archivo creado: `docs/superpowers/design.md`
