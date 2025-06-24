<<<<<<< HEAD
# tra
sdas
=======
# Sistema 'g5-app' - Proyecto Final

Este repositorio contiene una aplicación **full stack** desarrollada con:

- **Frontend:** Next.js + TailwindCSS
- **Backend:** NestJS + PostgreSQL
- **Infraestructura:** Docker
- **Estructura:** Monorepo en `/apps/frontend` y `/apps/backend`

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- Docker y Docker Compose
- Git
- Postgresql

```bash
# 1. Clonar el repositorio
git clone https://github.com/unifiis-bd/bd251-grupo5.git
cd bd251-grupo5/g5-app
```

## 🚀 Opciones de Despliegue

### 1. Despliegue Completo con Docker

Esta opción despliega todos los servicios (frontend, backend, base de datos, etc.) usando Docker.

```bash
# 1. Iniciar todos los servicios
docker-compose up --build
```

### 2. Desarrollo Local con Docker para Base de Datos

Esta opción es útil si prefieres ejecutar el frontend y backend localmente, pero usar Docker solo para la base de datos.

```bash
# 1. Iniciar solo la base de datos
docker-compose -f docker-compose.db.yml up -d

# 2. Instalar dependencias del backend
cd apps/backend
npm install
npm run start:dev

# 3. Instalar dependencias del frontend
cd ../frontend
npm install
npm run dev
```

Nota 1: Si optas por esta opcion, recuerda modificar los parametros de la base de datos en el backend [database.service.ts](./apps/backend/src/database/database.service.ts)

Nota 2: Si despliegas con docker las tablas y datos se crearan, puedes agregar o quitar scripts en [script](./apps/backend/init-scripts/)

### 3. Desarrollo Local Completo (Sin Docker)

Esta opción requiere tener PostgreSQL instalado localmente.

1. **Instalar PostgreSQL y pgAdmin**:
   - PostgreSQL: https://www.postgresql.org/download/
   - pgAdmin: https://www.pgadmin.org/download/

2. **Configurar la base de datos**:
   - Crear base de datos: `transporte`
   - Usuario: `postgres`
   - Password: `postgres`
   - Puerto: `5432`

   Nota: Es necesario configurar el archivo [database.service.ts](./apps/backend/src/database/database.service.ts) con tus datos para conectarlo a tu postgresql local.

3. **Ejecutar el backend**:
```bash
cd apps/backend
npm install
npm run start:dev
```

4. **Ejecutar el frontend**:
```bash
cd apps/frontend
npm install
npm run dev
```

### 4. Desarrollo Local parcial

Si quieres solo desplegar el backend consultar [documentación del backend](./apps/backend/README.md)

Si quieres solo desplegar el frontend consultar [documentación del frontend](./apps/frontend/README.md)

Nota: Para el backend es necesario tener postgresql instalado o usar docker para la base de datos, puedes revisar el punto 2 (2. Desarrollo Local con Docker para Base de Datos) de este documento. RECUERDA SIEMPRE VERIFICAR [databse.service.ts](./apps/backend/src/database/database.service.ts) Y QUE TENGAN TUS CREDENCIALES PARA CONEXION CON LA BASE DE DATOS.

### Por lo general:
Los servicios estarán disponibles en:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PgAdmin( **solo con docker** ): http://localhost:5050
  - Email: admin@admin.com
  - Password: admin
- PostgreSQL( **solo con docker el puerto es 5433 o depende de la configuracion si lo instalaste** ): localhost:5432
  - Usuario: postgres
  - Password: postgres
  - Base de datos: transporte

Para configurar pgAdmin y ver la base de datos (opcional, solo si quieres visualizar las tablas, **solo con docker**):
1. Accede a http://localhost:5050
2. Inicia sesión con las credenciales proporcionadas
3. Agrega un nuevo servidor:
   - Click derecho sobre `Servers`
   - Selecciona `register`
   - Luego `Server`
   - Por ultimo ve a la sección `Connection`
4. Agrega estos datos:
   - Host: postgres (o localhost)
   - Puerto: 5433
   - Usuario: postgres
   - Contraseña: postgres
   - Base de datos: transporte_db

## 🔧 Configuración de Variables de Entorno (Opcional por ahora)

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=transporte

REDIS_HOST=localhost
REDIS_PORT=6379
MQTT_HOST=localhost
MQTT_PORT=1883
```

## 🐛 Solución de Problemas Comunes

### 1. Problemas de Conexión con la Base de Datos
- Verificar que PostgreSQL esté corriendo
- Verificar que las tablas, el nombre de la base de datos o los datos existan

### 2. Problemas con el Backend
- Verificar que el puerto 3001 esté disponible
- Confirmar que los parametros de la conexion a la base de datos sean correctos [database.service.ts](./apps/backend/src/database/database.service.ts) 

### 3. Problemas con el Frontend
- Verificar que el puerto 3000 esté disponible
- Confirmar que la url apunte al backend correcto [client.ts](./apps/frontend/src/api/client.ts)

## 📦 Estructura del Proyecto

```
bd251-grupo5/
├── apps/
│   ├── frontend/     # Next.js
│   └── backend/      # NestJS
├── docker-compose.yml
├── docker-compose.db.yml
└── README.md
```

## 🔄 Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Reiniciar un servicio específico
docker-compose restart [servicio]

# Detener todos los servicios
docker-compose down

# Reconstruir imágenes
docker-compose build

# Ver estado de los contenedores
docker-compose ps
```

## 📚 Documentación de la API

El proyecto utiliza una arquitectura basada en Swagger para la documentación y generación automática del cliente TypeScript.

### Frontend
- La documentación detallada sobre la generación y uso del cliente API se encuentra en [Frontend README](./apps/frontend/README.md)
- El cliente API se genera automáticamente desde la documentación Swagger del backend
- Para actualizar el cliente API, consulta la documentación del frontend

### Backend
- La documentación Swagger está disponible en: `http://localhost:3001/api/docs`
- El esquema JSON de Swagger está en: `http://localhost:3001/api/docs-json`
- Para más detalles sobre la API, consulta la [documentación del backend](./apps/backend/README.md)

### Importante
En los archivos docker-compose se cambio el puerto de la base de datos a 5433 para evitar conflictos si tienes instalado una base de datos local, postgres por defecto usa el 5432 a menos que al instalarlo hayas utilizado otro puerto. Es decir, si usas docker para la base de datos el puerto es 5433.

🛠️ Tecnologías Usadas

Tecnología	Versión	Descripción
NestJS	9.0.0	Backend REST API
PostgreSQL	latest (Docker)	Base de datos relacional
Next.js	13+	Frontend React SSR
TailwindCSS	latest	Estilos CSS
Axios	latest	Cliente HTTP en frontend
Docker Compose	latest	Infraestructura local

🐛 Posibles Errores y Soluciones

Error	Solución
Cannot POST /login	Asegúrate de tener el endpoint creado en login.controller.ts con método @Post()
result.rowCount is possibly null	Se resolvió forzando TypeScript con rowCount ?? 0 > 0
Nest CLI lanza errores con decoradores	Se resolvió usando @nestjs/cli@9.0.0
El backend no responde	Verifica que esté ejecutándose en el puerto 3001 y que la base de datos esté activa en Docker
Axios: Cannot find module 'axios'	Instalar con: npm install axios

>>>>>>> e1b7110 (hola)
