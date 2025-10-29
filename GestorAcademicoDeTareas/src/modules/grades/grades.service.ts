import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DuplicateGradeException } from 'src/common/exceptions/grades/duplicate-grade.exception';
import { GradeNotFoundException } from 'src/common/exceptions/grades/grade-not-found.exception';
import { NoGradesException } from 'src/common/exceptions/grades/no-grade.exception';
import { CreateGradeDto } from 'src/dto/create-grade.dto';
import { UpdateGradeDto } from 'src/dto/update-grade.dto';
import { Grade } from 'src/entities/grade.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private gradesRepository: Repository<Grade>,
  ) {}

  //FUNCIONA - Consultar refactorización 63 - 77
  /**
   * @description Crea una calificación si no existe para el estudiante y la tarea.
   * @param newGrade DTO con id del estudiante, id de la tarea y la calificación.
   * @returns Objeto con mensaje, estudiante, tarea y nota.
  */
  async create(newGrade: CreateGradeDto) {
    const { studentId, taskId, score } = newGrade;

    // Verificar existencia previa de calificación
    const gradeExists = await this.gradesRepository.findOne({
      where: { task: { id: taskId }, student: { id: studentId } },
      relations: ['task', 'student'],
    });

    if (gradeExists) throw new DuplicateGradeException(studentId, taskId);

    // Crear y guardar la nueva calificación
    const newGradeEntity = this.gradesRepository.create({
      score,
      student: { id: studentId },
      task: { id: taskId },
    });

    const savedGrade = await this.gradesRepository.save(newGradeEntity);

    // Obtener la calificación con las relaciones cargadas
    const grade = await this.gradesRepository.findOne({
      where: { id: savedGrade.id },
      relations: ['task', 'student'],
    });

    if (!grade) throw new GradeNotFoundException(savedGrade.id);

    const { firstName, lastName } = grade.student;
    return {
      message: 'Calificación creada correctamente',
      studentName: `${firstName} ${lastName}`,
      taskTitle: grade.task.title,
      score: grade.score,
    };
  }

  /**
   * @description Actualiza la calificación existente en la base de datos. Utiliza el método `preload()` de TypeORM para cargar la entidad actual y fusionar los nuevos valores recibidos desde el DTO.
   * @param id - Identificador único de la calificación a actualizar.
   * @param updateGrade - Objeto que contiene los campos a modificar 
   */
  async update(id: number, updateGrade: UpdateGradeDto) {
    const gradeToUpdate = await this.gradesRepository.preload({
      id,
      ...updateGrade,
    });

    if (!gradeToUpdate) throw new GradeNotFoundException(id);
    await this.gradesRepository.save(gradeToUpdate);
    return { message: 'Calificación modificada correctamente'};
  }

  /**
   * @description Toma el id del estudiante y devuelve todas sus notas con información del estudiante y tareas
   * @param student - ID del estudiante
   * @returns Objeto con información del estudiante y lista de sus calificaciones
   */
  async findByStudent(student: number) {
    const grades = await this.gradesRepository.find({ 
      where: { student: { id: student } },
      relations: ['student', 'task']
    });

    if (grades.length === 0) throw new NoGradesException();

    const { firstName, lastName } = grades[0].student;

    let message = {
      studentName: `${firstName} ${lastName}`,
      studentId: student,
      grades: grades.map(grade => ({
        taskTitle: grade.task.title,
        score: grade.score
      })),
      totalGrades: grades.length
    };

    return message;
  }

  /**
   * @description Toma el id del estudiante y calcula el promedio de sus notas
   * @returns Mensaje informativo con el promedio de las notas
   */
  async getStudentAverage(studentId: number) {
    const grades = await this.gradesRepository.find({ 
      where: { student: { id: studentId } },
      relations: ['student', 'task']
    });

    if (grades.length === 0) throw new NoGradesException();

    const totalScore = grades.reduce((sum, grade) => sum + grade.score, 0);
    const averageScore = (totalScore / grades.length);
    return { message: `El promedio de este estudiante es de: ${averageScore}` };
  }

  /**
   * @description Elimina una calificación asociada a una tarea
   * @param id de la calificación
   * @returns Mensaje de confirmación
   */
  async remove(id: number) {
    const result = await this.gradesRepository.delete(id);
    if (result.affected === 0) throw new GradeNotFoundException(id);
    return { message: 'Calificación eliminada correctamente' };
  }
}
