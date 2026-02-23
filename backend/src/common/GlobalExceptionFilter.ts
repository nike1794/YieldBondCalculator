import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { RATE_LIMIT_TTL } from './Constants';
import { logger } from './logger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse) {
        const payload = exceptionResponse as {
          message?: string | string[];
          error?: string;
        };
        if (Array.isArray(payload.message)) {
          message = payload.message.join(', ');
        } else if (typeof payload.message === 'string') {
          message = payload.message;
        } else {
          message = exception.message;
        }
        if (typeof payload.error === 'string') {
          error = payload.error;
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (statusCode === HttpStatus.TOO_MANY_REQUESTS) {
      error = 'Too Many Requests';
      message = 'Rate limit exceeded. Please retry shortly.';
    }

    const correlationIdHeader = response.getHeader('x-correlation-id');
    const correlationId =
      typeof correlationIdHeader === 'string' ? correlationIdHeader : null;

    const retryAfterHeader = response.getHeader('Retry-After');
    const retryAfterValue =
      statusCode === HttpStatus.TOO_MANY_REQUESTS
        ? typeof retryAfterHeader === 'string'
          ? Number.parseInt(retryAfterHeader, 10)
          : Math.ceil(RATE_LIMIT_TTL / 1000)
        : undefined;

    logger.error('Request failed', {
      statusCode,
      method: request.method,
      path: request.url,
      message,
      correlationId,
    });

    response.status(statusCode).json({
      success: false,
      statusCode,
      error,
      message,
      ...(retryAfterValue !== undefined ? { retryAfter: retryAfterValue } : {}),
      ...(correlationId ? { correlationId } : {}),
    });
  }
}
