import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    // read @Roles('admin') metadata on the handler (method), fallback to class
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]) || [];

    // if no @Roles on this route, allow (JWT guard still applies separately)
    if (!required.length) return true;

    const req = ctx.switchToHttp().getRequest();
    const user = req.user; // set by JwtAuthGuard / JwtStrategy
    return !!user && required.includes(user.role);
  }
}