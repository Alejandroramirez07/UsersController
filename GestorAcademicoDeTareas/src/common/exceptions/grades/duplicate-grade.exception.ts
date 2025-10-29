import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateGradeException extends HttpException {
    
  //Lanza un error 409 (CONFLICT) cuando un estudiante
  // ya tiene una calificación registrada para una tarea

  constructor(studentId: number, taskId: number) {
    super(
      {
        errorType: 'DuplicateGradeException',
        message: `The student with ID ${studentId} already has a grade for task ${taskId}.`,
        message_es: `El estudiante con ID ${studentId} ya tiene una calificación para la tarea ${taskId}.`,
      },
      HttpStatus.CONFLICT,
    );
  }
}
