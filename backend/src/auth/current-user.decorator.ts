import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthedRequest, AuthUser } from './auth.types';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser => {
  const req = ctx.switchToHttp().getRequest<AuthedRequest>();
  return req.user as AuthUser;
});
