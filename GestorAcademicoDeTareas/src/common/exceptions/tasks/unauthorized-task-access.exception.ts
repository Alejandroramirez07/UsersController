import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedTaskAccessException extends HttpException {
    //Se lanza si un usuario intenta editar o eliminar una tarea que no le pertenece
  constructor() {
    super(
      {
        errorType: 'UnauthorizedTaskAccessException',
        message: `You are not authorized to access or modify this task.`,
         message_es: 'No estás autorizado a acceder ni modificar esta tarea.'
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
