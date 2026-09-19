import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from '../topics/topic.entity';
import { CreateResultDto } from './create-result.dto';
import { ExperimentResult } from './result.entity';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(ExperimentResult) private readonly results: Repository<ExperimentResult>,
    @InjectRepository(Topic) private readonly topics: Repository<Topic>,
  ) {}

  async create(userId: number, dto: CreateResultDto) {
    if (!(await this.topics.exist({ where: { id: dto.topicId } }))) {
      throw new NotFoundException(`Mavzu topilmadi: ${dto.topicId}`);
    }
    const saved = await this.results.save(this.results.create({ userId, topicId: dto.topicId, data: dto.data }));
    return { id: saved.id };
  }

  /** Faqat joriy foydalanuvchining natijalari */
  async list(userId: number, topicId?: number, limit = 20) {
    const rows = await this.results.find({
      where: topicId ? { userId, topicId } : { userId },
      relations: { topic: true },
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 100),
    });
    return rows.map((r) => ({
      id: r.id,
      topicId: r.topicId,
      topicTitle: r.topic?.title ?? '',
      subject: r.topic?.subject,
      grade: r.topic?.grade,
      data: r.data,
      createdAt: r.createdAt,
    }));
  }
}
