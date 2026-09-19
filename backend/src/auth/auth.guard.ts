import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthedRequest } from './auth.types';
import { IS_PUBLIC } from './public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly reflector: Reflector) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [ctx.getHandler(), ctx.getClass()]);
    if (isPublic) return true;

    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const [type, token] = (req.headers['authorization'] ?? '').split(' ');
    if (type !== 'Bearer' || !token) throw new UnauthorizedException('Tizimga kiring');

    try {
      const p = await this.jwt.verifyAsync<{ sub: number; email: string; name: string }>(token);
      req.user = { id: p.sub, email: p.email, fullName: p.name };
      return true;
    } catch {
      throw new UnauthorizedException('Sessiya tugagan, qayta kiring');
    }
  }
}
