import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { logger } from '../common/logger';
import { BondCalculationRequestDto } from '../models/BondCalculationRequestDto';
import { BondCalculationResponseDto } from '../models/BondCalculationResponseDto';
import { BondService } from '../service/BondService';
import { BaseController } from './BaseController';

@Controller('bond')
export class BondController extends BaseController {
  constructor(private bondService: BondService) {
    super();
  }

  @Post('calculate')
  calculateBond(
    @Body() payload: BondCalculationRequestDto,
    @Res() response: Response,
  ): Response {
    logger.info('POST /bond/calculate called', payload);
    try {
      const data: BondCalculationResponseDto =
        this.bondService.calculateBondYield(payload);
      return this.handleSuccessResponse(response, data, HttpStatus.OK);
    } catch (error: unknown) {
      logger.error('POST API /bond/calculate failed', error);
      const statusCode =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      return this.handleErrorResponse(response, error, statusCode);
    }
  }
}
