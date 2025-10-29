import { Column, Entity, JoinColumn, OneToOne, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  // Muchas notas pueden ser de un mismo estudiante
  @ManyToOne(() => User, (user) => user.grades)
  @JoinColumn({ name: 'studentId' })
  student: User;

  // Una nota pertenece a una tarea
  @OneToOne(() => Task, (task) => task.grade)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column({ nullable: false })
  score: number;
}
