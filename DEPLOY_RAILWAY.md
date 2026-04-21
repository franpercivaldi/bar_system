# Despliegue en Railway (paso a paso)

Este tutorial sirve para publicar **Bar System** en [Railway](https://railway.app): base de datos PostgreSQL, API Node y sitio estático del frontend. El cliente puede seguirlo para probar el sistema en internet.

**Requisitos**

- Cuenta en [railway.app](https://railway.app) (GitHub/GitLab para conectar el repo).
- El código de este repositorio subido a un repositorio Git.

**Orden recomendado:** primero la base de datos, luego el backend (para conocer la URL pública del API), después el frontend (necesita esa URL en el build).

---

## Monorepo: error “Railpack could not determine how to build” / “start.sh not found”

Este repo **no tiene** `package.json` en la raíz: solo dentro de **`backend/`** y **`frontend/`**. Si conectás GitHub y dejás Railway en la raíz del repositorio, **Railpack no sabe qué construir** y aparece ese error.

**Qué hacer (obligatorio en cada servicio):**

1. Abrí el servicio → **Settings**.
2. **Root Directory** → escribí exactamente **`backend`** (API) o **`frontend`** (sitio). Guardá.
3. Volvé a desplegar (**Redeploy**).

En **`backend/`** hay un **`Dockerfile`** de producción y un **`railway.json`** que piden construir con Dockerfile: suele evitar fallos de detección automática. Si el panel ofrece elegir **Builder**, podés dejar **Dockerfile**.

---

## 1. Crear proyecto y base PostgreSQL

1. Entrá a Railway → **New Project**.
2. Elegí **Deploy from GitHub repo** (o GitLab) y seleccioná el repositorio de **bar_system**.
3. En el proyecto, **Add** → **Database** → **PostgreSQL**.
4. Esperá a que el plugin quede **Active**. No hace falta copiar credenciales a mano: en el paso del backend vas a **referenciar** esta base.

---

## 2. Servicio: Backend (API)

1. **Add** → **GitHub Repo** → mismo repo (o **Empty Service** y conectá el repo).
2. Abrí el servicio → **Settings** (primero esto, antes de confiar en el build):
   - **Root Directory:** **`backend`** (crítico: si queda vacío o en `/`, el deploy falla en monorepos).
   - Con el **`Dockerfile`** y **`railway.json`** de esta carpeta, Railway construye la imagen sin depender de Railpack en la raíz. No hace falta un **Build Command** manual salvo que el panel lo exija; el **Start** lo define el `CMD` del Dockerfile (`node src/app.js`).
3. Pestaña **Variables** (o **Variables** del servicio):
   - Clic en **Add Reference** → elegí la variable **`DATABASE_URL`** del plugin **Postgres** (Railway la inyecta sola). Si no aparece como referencia, agregá manualmente la variable `DATABASE_URL` copiándola desde el servicio Postgres → **Variables** → `DATABASE_URL`.
   - **`JWT_SECRET`:** una cadena larga y aleatoria (por ejemplo 32+ caracteres). No la compartas públicamente.
   - **`CORS_ORIGIN`:** por ahora podés poner `http://localhost:5173` y **después del paso 4** volver acá y añadir la URL **exacta** del frontend en Railway, separada por coma si hay varias.  
     Ejemplo: `https://tu-frontend.up.railway.app`  
     Sin barra final. Si tenés varios orígenes:  
     `http://localhost:5173,https://tu-frontend.up.railway.app`
   - Si la conexión a Postgres falla con error de SSL, agregá **`DATABASE_SSL`** = `true` y volvé a desplegar.

4. **Settings** → **Networking** → **Generate Domain** (o equivalente) para obtener una URL pública HTTPS del API, por ejemplo `https://bar-system-api-production.up.railway.app`. **Anotá esta URL** (la usarás en el frontend).

5. Esperá el deploy verde y revisá los **logs**: deberían verse mensajes como conexión a PostgreSQL y “Servidor corriendo en el puerto …”. Railway define **`PORT`** automáticamente; el código ya lo usa.

---

## 3. Servicio: Frontend (sitio estático)

1. **Add** → **GitHub Repo** → mismo repo otra vez (segundo servicio).
2. **Settings**:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - Para **Static** / output: Railway suele pedir la carpeta de salida. En Vite es **`dist`**. Si la interfaz pide “Publish directory” / “Output”, indicá **`dist`**.
3. **Variables** del servicio frontend (se usan **en el build**):
   - **`VITE_API_URL`** = la URL pública del backend del paso 2, **sin barra al final**, por ejemplo:  
     `https://bar-system-api-production.up.railway.app`  
     No incluyas `/api` aquí: el cliente ya llama rutas tipo `/api/login`.

4. Generá dominio público para el frontend (misma idea que el backend) y **actualizá el backend**:
   - En el servicio **backend** → variable **`CORS_ORIGIN`** debe incluir la URL **https** del frontend (origen desde el que el navegador carga la SPA). Guardá y redeploy del backend si hace falta.

5. Tras un deploy correcto, abrí la URL del frontend en el navegador: debería cargar el login y poder registrarse / ingresar.

---

## 4. Checklist rápido si algo falla

| Síntoma | Qué revisar |
|--------|----------------|
| El front no llega al API (CORS o red) | `VITE_API_URL` correcta y rebuild del front; `CORS_ORIGIN` en el backend incluye la URL exacta del front (https, sin `/` final). |
| Backend no conecta a la DB | `DATABASE_URL` referenciada al Postgres del mismo proyecto; probar `DATABASE_SSL=true`. |
| Página en blanco en el front | Logs de build del servicio estático; que exista la carpeta `dist` tras `npm run build`. |
| 502 en el API | Logs del backend; que `npm start` exista en `backend/package.json` y que no crashee al arrancar. |

---

## 5. Coste y facturación

Railway cobra por **uso** (recursos, ancho de banda, base de datos). Conviene revisar el **plan** y el **usage** en el panel. El cliente puede poner **límites** o alertas de gasto en la cuenta.

---

## 6. Variables resumidas

### Backend (`backend`)

| Variable | Obligatorio | Descripción |
|----------|-------------|-------------|
| `DATABASE_URL` | Sí (Railway Postgres) | URL de conexión que da el plugin. |
| `JWT_SECRET` | Sí | Secreto para firmar tokens. |
| `CORS_ORIGIN` | Sí en prod | Orígenes permitidos, separados por coma. Incluir URL del front en Railway. |
| `DATABASE_SSL` | A veces | `true` si Postgres exige SSL y falla la conexión. |
| `PORT` | No | Lo define Railway; no hace falta ponerlo a mano. |

### Frontend (build)

| Variable | Obligatorio | Descripción |
|----------|-------------|-------------|
| `VITE_API_URL` | Sí | URL base del API (https), sin `/` al final. |

---

## 7. Desarrollo local (sin cambiar código)

- Sin `VITE_API_URL`, el front usa `http://localhost:3000`.
- Sin `CORS_ORIGIN`, el backend permite `http://localhost:5173` y `http://127.0.0.1:5173`.

Podés copiar `backend/.env.example` y `frontend/.env.example` como referencia (no subir secretos reales al repo).

---

## 8. Notas de mantenimiento

- **`sequelize.sync({ alter: true })`** en el arranque es cómodo para evolucionar el esquema en proyectos chicos; en escenarios más serios suele usarse migraciones. Para un único bar suele ser aceptable.
- Renovar dominios generados por Railway si cambian; actualizar `CORS_ORIGIN` y `VITE_API_URL` en consecuencia y **volver a build** el frontend si cambia la URL del API.

Si al probar este flujo falta algún ajuste en Railway (nombres de menús), adaptá los pasos a la interfaz actual de Railway: la lógica (Postgres → backend con `DATABASE_URL` → front con `VITE_API_URL` → CORS) no cambia.
