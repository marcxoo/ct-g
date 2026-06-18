# Diseño: Búsqueda en Web Worker — Coffee Manual V2

Fecha: 2026-06-12
Autor: asistente

## Resumen
Aplicar y estabilizar la búsqueda en la aplicación usando un Web Worker que ejecute búsqueda por substring sobre un índice preconstruido. Objetivo inmediato: mejorar la capacidad de respuesta y eliminar bloqueos/parpadeos en UI. Iteración futura: habilitar Fuse.js dentro del worker para fuzzy search si los usuarios lo solicitan.

## Contexto
La app es una guía interna para trabajadores de la cafetería que deben consultar recetas y procedimientos rápidamente. Ya existe un índice local (`searchIndex`) y un hook `useSearchWorker` que crea un worker mediante blob. Actualmente la UI muestra resultados virtualizados con `react-window`.

## Objetivos de éxito
- Búsqueda responsiva sin bloquear la UI en dispositivos comunes.
- Resultado en <100ms para consultas típicas en dev/prod (dataset actual).
- Sin parpadeos ni reflows visibles al tipear.
- Mínimo tamaño adicional de bundle; mantener operación offline.

## Alcance
Incluye:
- Usar `useSearchWorker` con índice preconstruido (ya integrado en `page.tsx`).
- Virtualizar la lista de resultados (`react-window`) para render rápido.
- Fallback a `filterItems` cuando la query esté vacía.
- Manejo de cancelación/actualización de resultados al cambiar query.

No incluye (para etapas posteriores):
- Integración de Fuse.js (opcional) — ver iteración.
- Búsqueda server-side / Supabase.

## Arquitectura propuesta
Componentes principales:
- `searchIndex` (lib): construye índice planar con texto pre-lowercased por item.
- `useSearchWorker` (lib): crea un Web Worker (Blob) y expone `search(query)` y `results`.
- `page.tsx`: usa `useDebounce` sobre `searchQuery`, manda `workerSearch(debouncedQuery)` y consume `workerResults` para poblar `filteredItems`. Cuando `debouncedQuery` está vacío, usa `filterItems`.
- UI: `react-window` `FixedSizeList` para renderizar resultados; items sin animaciones de entrada/salida para evitar reflows.

Flujo de datos:
1. Usuario escribe → `searchQuery` se actualiza.
2. `useDebounce` produce `debouncedQuery` (~150ms).
3. Si `debouncedQuery` no vacío → `workerSearch(debouncedQuery)` → worker procesa índice y `postMessage(results)`.
4. `useSearchWorker` actualiza `results` → `page.tsx` mapea a `filteredItems` → `react-window` renderiza.
5. Si `debouncedQuery` vacío → `filterItems(...)` produce `filteredItems` por categorías/tabs.

## Manejo de errores y edge cases
- Worker fallido: `useSearchWorker` debe exponer estado `error`. En caso de error, log y fallback a `filterItems` en el hilo principal.
- Race conditions: cada `workerSearch` incluye un identificador incremental (id) para ignorar resultados antiguos si llegan tarde.
- Query vacía: no invocar worker, usar `filterItems`.

## Rendimiento
- Preconstruir índice (ejecutado en mount) para evitar costosas operaciones por tecla.
- Worker realiza búsqueda O(n) substring; suficiente para dataset actual. Si escala, evaluar Fuse.js o server-side with indexed DB.
- Virtualización con `react-window` reduce coste de render a O(visibleItems).

## Pruebas
- Unit tests para `searchIndex` (buildIndex output, sample matches).
- Mock del worker para tests del hook `useSearchWorker` (simular postMessage).
- E2E manual: escribir queries largas, typos, alternar tabs; verificar latencia y que no hay parpadeo.

## Rollout y métricas
- Desplegar en ambiente local/dev y pedir feedback del staff en 48h.
- Métricas: tiempo desde keypress a resultados renderizados (target <100ms), tasa de errores del worker.

## Pasos siguientes (implementación incremental)
1. Validar en local que `useSearchWorker` responde y `filteredItems` se actualiza (hecho: código integrado).  
2. Añadir idempotencia en `useSearchWorker` para evitar races (mejorar si no está).  
3. Añadir tests unitarios para `searchIndex` y hook `useSearchWorker`.  
4. Medir rendimiento en dispositivos lentos; si la calidad de búsqueda es demandada, evaluar Fuse.js dentro del worker.  
5. Documentar comportamiento offline y cómo actualizar el índice si la fuente de datos cambia.

---

Archivo: `docs/superpowers/specs/2026-06-12-search-worker-design.md`
Estado: guardado localmente. Por favor revísalo; si estás de acuerdo, escribiré el plan de implementación (writing-plans) y lo pondré en la lista de tareas para ejecutar los cambios pendientes.
