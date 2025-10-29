import { HttpException, HttpStatus } from '@nestjs/common';

export class NoGradesException extends HttpException {
  constructor() {
    super(
      {
        errorType: 'NoGradesException',
        message: `No ratings found for this student.`,
        message_es: `No se encontraron calificaciones para este estudiante.`
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
