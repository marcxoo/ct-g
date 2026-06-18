Configuración rápida para Supabase

- Instala la dependencia:

```bash
npm install @supabase/supabase-js
```

- Variables de entorno (usar `.env.local` en desarrollo): copiar desde `.env.local.example` y rellenar con tus claves.

- Esquema sugerido en Supabase (ejecutar SQL en el editor SQL):

```sql
create table if not exists content (
  key text primary key,
  value jsonb
);

insert into content (key, value) values ('coffee_data', '{}'::jsonb)
on conflict (key) do nothing;
```

- Tabla opcional `admins` (si quieres gestionar administradores desde la DB):

```sql
create table if not exists admins (
  id uuid default gen_random_uuid() primary key,
  email text unique,
  role text,
  created_at timestamptz default now()
);
```

- Panel de administración añadido en la ruta `/admin` del proyecto. Funciona así:
  - Abre `http://localhost:3000/admin`.
  - Introduce `ADMIN_SECRET` (la misma variable de `.env.local`) en el campo "Admin secret".
  - Pulsa "Recargar" para traer los datos actuales y edítalos en formato JSON.
  - Pulsa "Guardar cambios" para enviar un `POST` a `/api/recipes` con el header `x-admin-secret`.

- Endpoints añadidos:
  - `GET /api/recipes` — devuelve el contenido `coffee_data`.
  - `POST /api/recipes` — reemplaza `coffee_data` (protegido por header `x-admin-secret`).

- Uso: desde el panel de administración realiza un `POST` JSON al endpoint con header `x-admin-secret` igual a `ADMIN_SECRET`.

- Nota de seguridad: NO subas `SUPABASE_SERVICE_ROLE_KEY` a repositorios públicos. Usa roles y autenticación robusta en producción.
