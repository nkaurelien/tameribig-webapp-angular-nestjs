import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { ContextService } from '../services/context.service.js';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    ContextService.run(() => {
      ContextService.set(
        'requestId',
        req.headers['x-request-id'] ?? randomUUID(),
      );
      ContextService.set('userAgent', req.headers['user-agent']);
      ContextService.set('ip', req.ip);
      next();
    });
  }
}
