import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/auth.types';
import { CreateResultDto } from './create-result.dto';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly results: ResultsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateResultDto) {
    return this.results.create(user.id, dto);
  }

  /** GET /api/results?topicId=3&limit=10 — faqat o'zimning natijalarim */
  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query('topicId', new ParseIntPipe({ optional: true })) topicId?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.results.list(user.id, topicId, limit);
  }
}
