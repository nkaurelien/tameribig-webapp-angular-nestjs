import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Lang = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const acceptLanguage = request.headers['accept-language'] ?? 'en';
    return acceptLanguage.substring(0, 2);
  },
);
