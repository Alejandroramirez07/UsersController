import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdateTaskDto } from 'src/dto/update-task.dto';
import { Task } from 'src/entities/task.entity';
import { TaskAlreadyExistsException } from 'src/common/exceptions/tasks/task-already-exists.exception';
import { TaskNotFoundException } from 'src/common/exceptions/tasks/task-not-found.exception';
import { InvalidTaskDeadlineException } from 'src/common/exceptions/tasks/invalid-task-deadline.exception';
import { UnauthorizedTaskAccessException } from 'src/common/exceptions/tasks/unauthorized-task-access.exception';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /**
   * Crea una nueva tarea.
   * Valida que no exista una tarea con el mismo título.
   * Verifica que la fecha límite sea válida.
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // Verificar si ya existe una tarea con el mismo nombre
    const existingTask = await this.taskRepository.findOne({
      where: { title: createTaskDto.title },
    });

    if (existingTask) {
      throw new TaskAlreadyExistsException(createTaskDto.title);
    }

    // Validar fecha límite
    const now = new Date();
    if (new Date(createTaskDto.deadline) < now) {
      throw new InvalidTaskDeadlineException();
    }

    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  /**
   * Devuelve todas las tareas registradas.
   */
  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  /**
   * Busca una tarea por ID.
   * Lanza una excepción personalizada si no se encuentra.
   */
  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new TaskNotFoundException(id);
    }

    return task;
  }

  /**
   * Actualiza una tarea existente.
   * Valida existencia y fecha límite.
   */
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id); // reutiliza la validación

    if (updateTaskDto.deadline && new Date(updateTaskDto.deadline) < new Date()) {
      throw new InvalidTaskDeadlineException();
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  /**
   * Elimina una tarea por su ID.
   * Lanza una excepción si no existe.
   */
  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new TaskNotFoundException(id);
    }
  }

  /**
   * Ejemplo de validación de acceso (si usas roles o usuario autenticado).
   */
  async verifyOwnership(taskId: number, userId: number): Promise<void> {
    const task = await this.findOne(taskId);

    // // Supongamos que tu entidad Task tiene una propiedad "ownerId"
    // if (task.ownerId !== userId) {
    //   throw new UnauthorizedTaskAccessException();
    // }
  }
}
