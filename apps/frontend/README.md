# Sistema de Transporte

Este es el frontend del Sistema de Transporte desarrollado con Next.js.

## Instalación

```bash
# Instalar dependencias
$ npm install
```

## Ejecución del Proyecto

### Usando Docker

```bash
# Construir y levantar todos los servicios
$ docker-compose up --build

# Para detener todos los servicios
$ docker-compose down
```

Una vez que los servicios estén corriendo, puedes acceder a:
- Frontend: http://localhost:3000

### Sin Docker

```bash
# Desarrollo
$ npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

Nota: Verifia que la url del backend es correcta, si ocurre algun error relacionado a la conexion con el backend [client.ts](./src/api/client.ts)

## Generación de la API

El proyecto utiliza `openapi-typescript-codegen` para generar automáticamente el cliente TypeScript basado en el Swagger del backend.

### Obtener el Swagger

1. Asegúrate de que el backend esté corriendo
2. Accede a la documentación Swagger en: `http://localhost:3001/api/docs-json`
3. Copia el contenido del archivo
4. Colócalo en `src/api/swagger/swagger.json`

### Generar el Cliente API

```bash
# Generar el cliente API
$ npm run generate-api
```

Nota: Si da error, eliminar la carpeta `src/api/generated` y volver a correr el comando. Si tus cambios del backend no se visualizan al correr el comando, vuelve al paso de `obtener el swagger`

### Actualizar la API

Si el backend cambia:
1. Obtén el nuevo `swagger.json`
2. Reemplaza el archivo en `src/api/swagger/`
3. Ejecuta `npm run generate-api`
