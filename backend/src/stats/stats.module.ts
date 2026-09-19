import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentResult } from '../results/result.entity';
import { Topic } from '../topics/topic.entity';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, ExperimentResult])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
