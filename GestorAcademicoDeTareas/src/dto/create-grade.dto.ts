import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';
export class CreateGradeDto {
  @ApiProperty({ example: '2', description: 'Id del estudiante' })
  @IsNotEmpty()
  @IsInt()
  studentId: number;

  @ApiProperty({ example: '2', description: 'Id de la tarea' })
  @IsNotEmpty()
  @IsInt()
  taskId: number;

  @ApiProperty({ example: '4', description: 'Calificación de 1 a 5 en números enteros' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  score: number;
}
