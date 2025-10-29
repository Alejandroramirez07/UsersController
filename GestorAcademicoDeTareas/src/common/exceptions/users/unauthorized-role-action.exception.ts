import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedRoleActionException extends HttpException {
  constructor() {
    super(
      {
        error: 'UnauthorizedRoleAction',
        message: 'You are not authorized to perform this action.',
        message_es: 'No estás autorizado para realizar esta acción.',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
