import { Controller, Get } from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  /** GET /api/stats/overview */
  @Get('overview')
  overview(@CurrentUser() user: AuthUser) {
    return this.stats.overview(user.id);
  }
}
