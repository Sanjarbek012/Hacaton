import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Topic } from '../topics/topic.entity';
import { User } from '../users/user.entity';

@Entity('experiment_results')
export class ExperimentResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int' })
  topicId: number;

  @ManyToOne(() => Topic, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topicId' })
  topic: Topic;

  @Index()
  @Column({ type: 'int', nullable: true })
  userId: number | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  /** Tajriba parametrlari va o'lchangan qiymatlar */
  @Column({ type: 'jsonb' })
  data: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}
