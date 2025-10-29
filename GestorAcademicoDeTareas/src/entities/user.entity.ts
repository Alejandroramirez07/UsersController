import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../common/enums/roles.enum';
import { Task } from './task.entity';
import { Grade } from './grade.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.Student,
  })
  role: Role;

  @Column()
  passwordHash: string;

  @Column({ default: true })
  isActive: boolean;

  // Un estudiante puede tener muchas tareas
  @OneToMany(() => Task, (task) => task.student)
  tasks: Task[];

  // Un estudiante puede tener muchas calificaciones
  @OneToMany(() => Grade, (grade) => grade.student)
  grades: Grade[];
}
