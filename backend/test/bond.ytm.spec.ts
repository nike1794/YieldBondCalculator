import { BondService } from '../src/service/BondService';
import { BondCalculationRequestDto } from '../src/models/BondCalculationRequestDto';

describe('BondService YTM', () => {
  let service: BondService;

  beforeEach(() => {
    service = new BondService();
  });

  it('should calculate YTM near coupon rate for a par bond', () => {
    const input: BondCalculationRequestDto = {
      faceValue: 1000,
      annualCouponRate: 8,
      marketPrice: 1000,
      yearsToMaturity: 5,
      couponFrequency: 'annual',
    };

    const result = service.calculateBondYield(input);

    expect(result.ytm).toBeCloseTo(8, 2);
  });
});
