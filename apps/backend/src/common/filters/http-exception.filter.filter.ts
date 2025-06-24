import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomException } from '../exceptions/custom.exception';
import { ErrorResponseDto } from '../dto/error-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. Errores personalizados (CustomException)
    if (exception instanceof CustomException) {
      const errorResponse = exception.getResponse() as ErrorResponseDto;
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : 'Unknown error',
      );
      return response
        .status(exception.getStatus())
        .json(ErrorResponseDto.error(errorResponse.message));
    }

    // 2. Errores de validación y datos (relevantes para el cliente)
    if (exception instanceof Error) {
      const errorMessage = exception.message;

      // Errores de validación de UUID
      if (
        errorMessage.includes('sintaxis de entrada no es válida para tipo uuid')
      ) {
        this.logger.warn(`${request.method} ${request.url}`, exception.stack);
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(ErrorResponseDto.error('El ID proporcionado no es válido'));
      }

      // Errores de clave foránea
      if (errorMessage.includes('violates foreign key constraint')) {
        this.logger.warn(`${request.method} ${request.url}`, exception.stack);
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(ErrorResponseDto.error('El recurso referenciado no existe'));
      }

      // Errores de validación de datos
      if (errorMessage.includes('violates check constraint')) {
        this.logger.warn(`${request.method} ${request.url}`, exception.stack);
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(
            ErrorResponseDto.error('Los datos proporcionados no son válidos'),
          );
      }

      // Errores de unicidad
      if (
        errorMessage.includes('duplicate key value violates unique constraint')
      ) {
        this.logger.warn(`${request.method} ${request.url}`, exception.stack);
        return response
          .status(HttpStatus.CONFLICT)
          .json(
            ErrorResponseDto.error('Ya existe un registro con estos datos'),
          );
      }

      // Errores de formato de datos
      if (errorMessage.includes('invalid input syntax')) {
        this.logger.warn(`${request.method} ${request.url}`, exception.stack);
        return response
          .status(HttpStatus.BAD_REQUEST)
          .json(ErrorResponseDto.error('El formato de los datos no es válido'));
      }
    }

    // 3. Errores internos (no relevantes para el cliente)
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : 'Unknown error',
    );

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(ErrorResponseDto.error('Error interno del servidor'));
  }
}
