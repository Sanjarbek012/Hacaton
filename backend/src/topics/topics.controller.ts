import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SUBJECTS, Subject } from './topic.entity';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topics: TopicsService) {}

  /** GET /api/topics?subject=physics&grade=9 */
  @Get()
  findAll(
    @Query('subject') subject?: string,
    @Query('grade', new ParseIntPipe({ optional: true })) grade?: number,
  ) {
    if (subject && !SUBJECTS.includes(subject as Subject)) {
      throw new BadRequestException(`subject: ${SUBJECTS.join(' | ')}`);
    }
    return this.topics.findAll(subject as Subject | undefined, grade);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.topics.findOne(id);
  }
}
