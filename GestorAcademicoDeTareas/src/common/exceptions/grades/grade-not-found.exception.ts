import { HttpException, HttpStatus } from '@nestjs/common';

export class GradeNotFoundException extends HttpException {

    //Lanza un error 404 
    // si no se encuentra la calificación solicitada.
  constructor(gradeId: number) {
    super(
      {
        errorType: 'GradeNotFoundException',
        message: `Grade with ID ${gradeId} was not found.`,
        message_es: `No se encontró la calificación con ID ${gradeId}`
       
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
