import { HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { logger } from '../common/logger';

export abstract class BaseController {
  protected handleSuccessResponse<T>(
    response: Response,
    data: T,
    statusCode: number = HttpStatus.OK,
  ): Response {
    logger.info('Sending success response', { statusCode });
    return response.status(statusCode).json({
      success: true,
      statusCode,
      data,
    });
  }

  protected handleErrorResponse(
    response: Response,
    error: unknown,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ): Response {
    const fallbackMessage = 'Internal server error';
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : fallbackMessage;
    logger.error('Sending error response', { statusCode, message });

    return response.status(statusCode).json({
      success: false,
      statusCode,
      error: message,
    });
  }
}
