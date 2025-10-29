import { HttpException, HttpStatus } from '@nestjs/common';

export class TaskAlreadyExistsException extends HttpException {
    // Evita duplicar tareas con el mismo título.
  constructor(title: string) {
    super(
      {
        errorType: 'TaskAlreadyExistsException',
        message: `A task with title "${title}" already exists.`,
         message_es: `Ya existe una tarea con el título "${title}".`,

      },
      HttpStatus.CONFLICT,
    );
  }
}
