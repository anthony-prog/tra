# API de Transporte

API para el sistema de transporte, desarrollada con NestJS.

## Instalación

```bash
# Instalar dependencias
$ npm install
```

## Configuración

Asegúrate de configurar las siguientes variables en tu archivo `.env`:

### Configuración requerida
```env
# Puerto de la aplicación
PORT=3001

# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=nombre_db
```

### Otras configuraciones opcionales
```env
# Configuración de Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Configuración de MQTT
MQTT_HOST=localhost
MQTT_PORT=1883
```

Nota: Si no desea crear un archivo `.env`, puede modificar el puerto en [main](./src/main.ts) y configuracion de la base de datos en [postgresql](./src/database/database.service.ts)

## Manejo de Errores y Formateo de Código

Si encuentras errores de linting o formateo en el editor, o después de realizar cambios en el código, ejecuta estos comandos en orden:

```bash
# 1. Corregir errores de linting
$ npm run lint --fix

# 2. Formatear el código
$ npm run format
```

Estos comandos son importantes para:
- Mantener la consistencia del código
- Corregir errores de estilo
- Asegurar que el código cumpla con los estándares del proyecto

## Ejecución del Proyecto

### Usando Docker (Recomendado)

El proyecto incluye una configuración de Docker Compose que incluye todos los servicios necesarios:
- Backend (NestJS)
- PostgreSQL (Base de datos)
- pgAdmin (Interfaz gráfica para PostgreSQL)
- Redis (Para colas)
- MQTT (Para comunicación en tiempo real)

Para ejecutar el proyecto con Docker:

```bash
# Construir y levantar todos los servicios
$ docker-compose up --build

# Para detener todos los servicios
$ docker-compose down
```

Una vez que los servicios estén corriendo, puedes acceder a:
- Backend API: http://localhost:3001
- Swagger docs: http://localhost:3001/docs
- pgAdmin: http://localhost:5050
  - Email: admin@admin.com
  - Password: admin

Para configurar pgAdmin y ver la base de datos (opcional, solo si quieres visualizar las tablas):
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

Nota: Si despliegas con docker las tablas y datos se crearan, puedes agregar o quitar scripts en [script](./init-scripts/)

### Sin Docker

```bash
# Desarrollo
$ npm run start

# Desarrollo con recarga automática
$ npm run start:dev
```

## Inicialización de la Base de Datos

Para inicializar la base de datos con los scripts SQL:

```bash
# Ejecutar el script de inicialización
$ npm run db:init # Esto ejecuta todos los scripts de ./init-scripts

# Si deseas Cargar Datos (Recomendable ya q se usa bcrypt para autenticacion) puedes usar cualquiera de estos 2 comandos:
$ npm run db:import-csv-no-recreate-tables # Inserta datos sin volver a CREAR LAS TABLAS

$ npm run db:import-csv-recreate-tables # Inserta datos sin , pero primero se RCREAN LAS TABLAS
```

Si encuentras errores al ejecutar el script, verifica que las variables de entorno en tu archivo `.env` coincidan con la configuración de tu base de datos:

```env
DB_HOST=localhost
DB_PORT=5432 # Si usas Docker usa el puerto 5433, caso contrario usa el puerto de tu base de datos local usualmente 5432
DB_USER=postgres
DB_PASSWORD=postgres  # Si usas Docker, usa 'postgres' como contraseña, caso contrario usa la contraseña de tu base de datos local
DB_NAME=transporte
```

También puedes modificar estas variables directamente en `src/database/database.service.ts` si prefieres no usar un archivo `.env`.

## Documentación de la API

La documentación de la API está disponible en Swagger UI:
- URL: `http://localhost:3001/docs`

## Swagger json:

Util para generar automáticamente el cliente TypeScript basado en el Swagger del backend.
- URL: `http://localhost:3001/docs-json`

## Comandos Útiles de Nest CLI

```bash
# Generar un nuevo controlador
$ nest g controller nombre-controlador

# Generar un nuevo servicio
$ nest g service nombre-servicio

# Generar un nuevo módulo
$ nest g module nombre-modulo

# Generar un nuevo recurso (CRUD completo)
$ nest g resource nombre-recurso
```

## Importante
- La documentacion de cada endpoint y modelo debe ser clara para poder generar automaticamente el cliente Typescript basado en el Swagger del backend

- En los archivos docker-compose se cambio el puerto de la base de datos a 5433 para evitar conflictos si tienes instalado una base de datos local, postgres por defecto usa el 5432 a menos que al instalarlo hayas utilizado otro puerto

- Si ve errores de mqtt o relacionado, NO ES NECESARIO ISNTALAR NADA, ES NORMAL, solo se usa en el modulo de monitoreo en ruta.