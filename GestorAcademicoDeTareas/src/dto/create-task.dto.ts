import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean, IsInt } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsDateString()
  deadline: string;

  @IsInt()
  studentId: number; // para vincular la tarea al estudiante
}
