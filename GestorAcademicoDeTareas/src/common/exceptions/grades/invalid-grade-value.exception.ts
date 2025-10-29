import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidGradeValueException extends HttpException {
    // Lanza un error 400 si la nota no está en el rango permitido.

  constructor(value: number) {
    super(
      {
        errorType: 'InvalidGradeValueException',
        message: `Invalid grade value: ${value}. Grades must be between 0 and 5.`,
        message_es: `Valor de calificación no válido: ${value}. Las calificaciones deben estar entre 0 y 5.`
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
