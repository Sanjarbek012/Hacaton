import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 80 })
  fullName: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 160 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
