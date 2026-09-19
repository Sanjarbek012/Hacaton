import { Body, Controller, Post } from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { AiAssistDto } from './ai.dto';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  /** POST /api/ai/assist */
  @Post('assist')
  assist(@CurrentUser() user: AuthUser, @Body() dto: AiAssistDto) {
    return this.ai.assist(user.id, dto);
  }
}
