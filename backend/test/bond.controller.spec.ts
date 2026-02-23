import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { BondController } from '../src/controller/BondController';
import { BondCalculationRequestDto } from '../src/models/BondCalculationRequestDto';
import { BondService } from '../src/service/BondService';

describe('BondController', () => {
  let controller: BondController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BondController],
      providers: [BondService],
    }).compile();

    controller = moduleRef.get<BondController>(BondController);
  });

  it('should return success response for calculate endpoint', () => {
    const payload: BondCalculationRequestDto = {
      faceValue: 1000,
      annualCouponRate: 8,
      marketPrice: 950,
      yearsToMaturity: 5,
      couponFrequency: 'annual',
    };

    const responseMock: Pick<Response, 'status' | 'json'> = {
      status: jest.fn().mockReturnThis() as Response['status'],
      json: jest.fn().mockReturnThis() as Response['json'],
    };
    const response = responseMock as Response;

    controller.calculateBond(payload, response);

    expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(responseMock.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        statusCode: HttpStatus.OK,
      }),
    );
  });
});
