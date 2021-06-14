import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-errors';
import { Observable } from 'rxjs';
import { Request } from 'src/shared/interfaces/request.interface';
import { QUERY_PARAMS_TOKEN_KEY } from '../alternative-auth.decorator';
import { IS_PUBLIC_KEY } from '../public.decorator';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class JwtGuard implements CanActivate {
  public constructor(private reflector: Reflector, private readonly jwtService: JwtService) {}

  private getBooleanMetadata(context: ExecutionContext, key: string): boolean {
    return this.reflector.getAllAndOverride<boolean>(key, [context.getHandler(), context.getClass()]);
  }

  private getRequestFromGqlContext(context: ExecutionContext): Request {
    const ctx: GqlExecutionContext = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  private getRequestFromHttpContext(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean = this.getBooleanMetadata(context, IS_PUBLIC_KEY);
    const queryParamsToken: boolean = this.getBooleanMetadata(context, QUERY_PARAMS_TOKEN_KEY);

    let token: string;
    let request: Request = this.getRequestFromGqlContext(context);

    if (!request) {
      request = this.getRequestFromHttpContext(context);
      if (!request) {
        return isPublic;
      }
    }

    if (queryParamsToken) {
      token = request.query.token as string;
    } else {
      token = request.headers.authorization?.replace('Bearer ', '');
    }

    let jwtPayload: JwtPayload;

    try {
      jwtPayload = this.jwtService.verify(token);
    } catch (_err) {
      if (isPublic) {
        return true;
      }
      throw new AuthenticationError('User must be connected to access this resource');
    }

    request.user = jwtPayload;
    return true;
  }
}
