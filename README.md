# Bar System

Sistema web para gestión de un bar/restaurante: mesas y turnos, caja, empleados, vales, comentarios y resúmenes. El **frontend** es una SPA en React; el **backend** es una API REST en Node.js con **PostgreSQL** como base de datos.

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 18, Vite 6, React Router 7, Ant Design 5, Axios, Formik + Yup |
| Backend | Node.js 20, Express 4, Sequelize 6 (ORM) |
| Base de datos | PostgreSQL 16 |
| Contenedores (dev) | Docker Compose: Postgres + backend + frontend |

La API expone rutas bajo el prefijo `/api`. El backend sincroniza los modelos con la base al arrancar (`sequelize.sync({ alter: true })`), de modo que el esquema se adapta al código (útil en desarrollo; en producción conviene migraciones explícitas).

**Nota:** En `package.json` del backend aparece `mongoose`, pero el proyecto usa solo **Sequelize + PostgreSQL**; esa dependencia no se utiliza en el código actual.

---

## Requisitos previos

- **Node.js** 20 o compatible (alineado con los Dockerfiles).
- **npm** (viene con Node).
- Para desarrollo **sin** Docker: una instancia de **PostgreSQL** accesible (misma versión que en Compose: 16 recomendado).
- Para el flujo **con** Docker: **Docker** y **Docker Compose**.

---

## Opción 1: Levantar todo con Docker Compose (recomendado)

Desde la raíz del repositorio:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Qué hace el compose:

1. **`db`**: PostgreSQL 16 con base `MariasRestoBar`, usuario y contraseña definidos en el propio `docker-compose.dev.yml` (solo entorno de desarrollo).
2. **`backend`**: construye la imagen desde `backend/Dockerfile.dev`, monta el código, ejecuta **nodemon** sobre `src/app.js`, expone el puerto **3000**. Sobrescribe `DB_HOST=db` para que el backend apunte al servicio Postgres dentro de la red Docker.
3. **`frontend`**: construye desde `frontend/Dockerfile.dev`, ejecuta Vite en modo dev con `--host` (accesible desde fuera del contenedor), puerto **5173**. Define `VITE_API_URL=http://localhost:3000` (el cliente en el navegador sigue llamando al API en tu máquina; el código del frontend hoy usa la URL del API fijada en `frontend/src/api/axiosInstance.js`).

**URLs habituales:**

- Frontend: http://localhost:5173  
- API: http://localhost:3000  

El volumen `db_dev_data` persiste los datos de Postgres entre reinicios del compose.

Para detener:

```bash
docker compose -f docker-compose.dev.yml down
```

(Sin borrar el volumen de datos; para borrarlo también: `docker compose -f docker-compose.dev.yml down -v`.)

---

## Opción 2: Desarrollo local sin Docker

### 1. Base de datos PostgreSQL

Crea una base y un usuario que coincidan con lo que pondrás en `backend/.env` (nombre de BD, usuario, contraseña). El compose de referencia usa la BD `MariasRestoBar`; puedes replicar eso en tu Postgres local.

### 2. Variables de entorno del backend

En `backend/.env` (no versionar secretos reales en el repositorio) necesitas algo equivalente a:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=MariasRestoBar

JWT_SECRET=un_secreto_largo_y_aleatorio
```

- **`DB_HOST`**: con Postgres en la misma máquina suele ser `localhost` o `127.0.0.1`. Si usas WSL, Docker Desktop u otro host virtual, puede ser una IP distinta (como la que tengas hoy en tu `.env` local).
- **`JWT_SECRET`**: clave para firmar los tokens JWT del login de bares.

En `backend/src/config/database.js` la conexión Sequelize solo usa `host`, `DB_NAME`, usuario y contraseña; el puerto de Postgres queda el predeterminado (**5432**). Si necesitas otro puerto, habría que añadirlo en la configuración de Sequelize.

### 3. Backend

```bash
cd backend
npm install
npm run dev
```

Esto usa **nodemon** (configuración en `backend/nodemon.json`) y levanta el servidor en el puerto **3000**.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite levanta el dev server en **5173** por defecto. El backend tiene CORS permitido para `http://localhost:5173` (ver `backend/src/app.js`).

El cliente HTTP (`frontend/src/api/axiosInstance.js`) usa como `baseURL` **`http://localhost:3000`**. Si el API corre en otro host/puerto, hay que cambiar esa URL (o parametrizarla con variables `VITE_*` y usar `import.meta.env` en el código).

---

## Scripts útiles

| Ubicación | Comando | Descripción |
|-----------|---------|-------------|
| Backend | `npm run dev` | Desarrollo con recarga (nodemon) |
| Backend | `npm start` | Arranque sin nodemon (`node src/app.js`) |
| Frontend | `npm run dev` | Servidor de desarrollo Vite |
| Frontend | `npm run build` | Build de producción |
| Frontend | `npm run preview` | Previsualizar el build |
| Frontend | `npm run lint` | ESLint |

---

## Estructura del repositorio

```
bar_system/
├── docker-compose.dev.yml   # Orquestación dev: db + backend + frontend
├── backend/
│   ├── Dockerfile.dev
│   ├── src/
│   │   ├── app.js           # Entrada Express, CORS, sync Sequelize, puerto 3000
│   │   ├── config/          # Conexión Sequelize → PostgreSQL
│   │   ├── models/          # Bar, Mesa, Turno, Usuario, Comentario, Empleado, Vale, etc.
│   │   ├── routes/          # Rutas /api (bares, mesas, auth, caja, resúmenes, …)
│   │   ├── controllers/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── frontend/
    ├── Dockerfile.dev
    ├── src/
    │   ├── api/             # Axios + interceptores (token, bar seleccionado)
    │   ├── pages/           # Login, Daily, resúmenes, etc.
    │   ├── components/
    │   ├── routes.jsx
    │   └── ...
    └── package.json
```

---

## Autenticación y cabeceras

El login devuelve un **JWT** guardado en `localStorage` como `token`. Los requests envían `Authorization: Bearer <token>`. Además se puede enviar el bar activo con la cabecera **`Bar-Seleccionado`** (valor desde `localStorage`), según la lógica del interceptor en `axiosInstance.js`.

---

## Resumen de puertos

| Servicio | Puerto |
|----------|--------|
| API (Express) | 3000 |
| Frontend (Vite dev) | 5173 |
| PostgreSQL (en Docker) | interno al compose; desde el host no hace falta exponerlo si solo usas el backend en contenedor |

---

## Producción (Railway)

Guía paso a paso para el cliente o para quien despliegue: [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md). En producción el frontend usa la variable **`VITE_API_URL`** (URL pública del API); el backend usa **`CORS_ORIGIN`**, **`DATABASE_URL`** (o `DB_*` en local) y **`JWT_SECRET`**.

---

Si algo no conecta en local, revisa en este orden: que Postgres esté arriba y que `DB_*` coincidan con el servidor; que el backend imprima “Conectado a PostgreSQL” y “Servidor corriendo”; que CORS y la URL del API (local o `VITE_API_URL`) coincidan con el origen del navegador.
