import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type Subject = 'physics' | 'chemistry' | 'biology';
export const SUBJECTS: Subject[] = ['physics', 'chemistry', 'biology'];

@Entity('topics')
@Index(['subject', 'grade'])
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 16 })
  subject: Subject;

  @Column({ type: 'int' })
  grade: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  /** Frontenddagi simulyatsiya kaliti. null bo'lsa — "tez orada". */
  @Column({ type: 'varchar', length: 40, nullable: true })
  simKey: string | null;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
