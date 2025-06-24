import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.filter';
import { BaseResponseDto } from './common/dto/base-response.dto';
import { ErrorResponseDto } from './common/dto/error-response.dto';

interface SwaggerMethod {
  responses?: Record<string, any>;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar prefijo global
  app.setGlobalPrefix('api');

  // Configurar CORS
  app.enableCors({
    origin: '*', // Permite todas las origenes
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type'],
  });

  // Configurar filtro global de excepciones
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Transporte')
    .setDescription('API para el sistema de monitoreo de transporte')
    .setVersion('1.0')
    .addServer('http://localhost:3001', 'Servidor Local')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config, {
    extraModels: [BaseResponseDto, ErrorResponseDto],
  });

  // Agregar respuesta de error 500 a todos los endpoints
  Object.values(document.paths).forEach((path) => {
    Object.values(path).forEach((method: SwaggerMethod) => {
      if (method?.responses) {
        method.responses['500'] = {
          description: 'Error interno del servidor',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponseDto',
              },
            },
          },
        };
      }
    });
  });

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});
