import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from '../topics/topic.entity';
import { ExperimentResult } from './result.entity';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExperimentResult, Topic])],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
