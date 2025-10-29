import { HttpException, HttpStatus } from '@nestjs/common';

export class TaskNotFoundException extends HttpException {

    //Lanza un 404 si la tarea no existe.
  constructor(taskId: number) {
    super(
      {
        errorType: 'TaskNotFoundException',
        message: `Task with ID ${taskId} was not found.`,
        message_es: `No se encontró la tarea con ID ${taskId}.`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
