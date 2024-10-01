import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import { Request } from 'express';
  import { Reflector } from '@nestjs/core';
  import { IS_PUBLIC_KEY } from 'src/decorator/public.decorator';
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      @Inject(JwtService) private jwtService: JwtService,
      @Inject(ConfigService) private configService: ConfigService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // check is public route
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
  
      // check for token to exist into headers
      if (!token) {
        throw new UnauthorizedException();
      }
  
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('JWT_RESET_SECRET'),
        });
        request['user'] = payload;
      } catch {
        throw new UnauthorizedException();
      }
  
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  