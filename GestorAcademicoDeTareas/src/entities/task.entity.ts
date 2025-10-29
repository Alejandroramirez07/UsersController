import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Grade } from './grade.entity';
import { User } from './user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date', nullable: true })
  dueDate: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deadline?: Date;

  // Una tarea tiene una calificación
  @OneToOne(() => Grade, (grade) => grade.task, { cascade: true })
  grade: Grade;

  // Una tarea pertenece a un estudiante
  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;
}
