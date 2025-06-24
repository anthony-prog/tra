import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(
      {
        statusCode,
        message,
        error: HttpStatus[statusCode],
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}
