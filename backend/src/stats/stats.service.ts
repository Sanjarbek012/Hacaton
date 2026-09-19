import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperimentResult } from '../results/result.entity';
import { SUBJECTS, Topic } from '../topics/topic.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Topic) private readonly topics: Repository<Topic>,
    @InjectRepository(ExperimentResult) private readonly results: Repository<ExperimentResult>,
  ) {}

  async overview(userId: number) {
    const topicRows = await this.topics
      .createQueryBuilder('t')
      .select('t.subject', 'subject')
      .addSelect('COUNT(*)', 'total')
      .addSelect('COUNT(t."simKey")', 'ready')
      .groupBy('t.subject')
      .getRawMany<{ subject: string; total: string; ready: string }>();

    const doneRows = await this.results
      .createQueryBuilder('r')
      .innerJoin('r.topic', 't')
      .select('t.subject', 'subject')
      .addSelect('COUNT(*)', 'attempts')
      .addSelect('COUNT(DISTINCT r."topicId")', 'doneTopics')
      .where('r."userId" = :userId', { userId })
      .groupBy('t.subject')
      .getRawMany<{ subject: string; attempts: string; doneTopics: string }>();

    return SUBJECTS.map((subject) => {
      const t = topicRows.find((r) => r.subject === subject);
      const d = doneRows.find((r) => r.subject === subject);
      return {
        subject,
        total: Number(t?.total ?? 0),
        ready: Number(t?.ready ?? 0),
        attempts: Number(d?.attempts ?? 0),
        doneTopics: Number(d?.doneTopics ?? 0),
      };
    });
  }
}
