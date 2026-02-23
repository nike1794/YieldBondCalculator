import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { RequestContext } from './RequestContext';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const headerValue = request.headers['x-correlation-id'];
    const correlationId =
      (Array.isArray(headerValue) ? headerValue[0] : headerValue) ??
      randomUUID();

    response.setHeader('x-correlation-id', correlationId);
    RequestContext.run(correlationId, () => next());
  }
}
