import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Subject, Topic } from './topic.entity';

@Injectable()
export class TopicsService {
  constructor(@InjectRepository(Topic) private readonly repo: Repository<Topic>) {}

  findAll(subject?: Subject, grade?: number) {
    const where: FindOptionsWhere<Topic> = {};
    if (subject) where.subject = subject;
    if (grade) where.grade = grade;
    return this.repo.find({ where, order: { subject: 'ASC', grade: 'ASC', sortOrder: 'ASC' } });
  }

  async findOne(id: number) {
    const topic = await this.repo.findOne({ where: { id } });
    if (!topic) throw new NotFoundException(`Mavzu topilmadi: ${id}`);
    return topic;
  }
}
