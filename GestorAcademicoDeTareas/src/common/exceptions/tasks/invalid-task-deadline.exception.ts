import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTaskDeadlineException extends HttpException {
    //Lanza un 400 si se intenta crear o actualizar una tarea con fecha de entrega pasada.
  constructor() {
    super(
      {
        errorType: 'InvalidTaskDeadlineException',
        message: `The task deadline must be a future date.`,
          message_es: 'La fecha límite de la tarea proporcionada no es válida.',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
