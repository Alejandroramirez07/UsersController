import { HttpException, HttpStatus } from '@nestjs/common';

export class TokenExpiredException extends HttpException {
  constructor() {
    super(
      {
        error: 'TokenExpired',
        message: 'Authentication token has expired.',
        message_es: 'El token de autenticación ha expirado.',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
