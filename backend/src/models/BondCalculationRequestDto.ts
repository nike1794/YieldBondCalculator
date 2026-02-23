import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsIn,
  IsNumber,
  Max,
  Min,
  NotEquals,
} from 'class-validator';

export class BondCalculationRequestDto {
  @Transform(({ value }) =>
    value === '' || value === null ? undefined : Number(value),
  )
  @IsDefined({ message: 'Face value is required' })
  @IsNumber({}, { message: 'Face value is required' })
  @NotEquals(0, { message: 'Face value must be greater than 0' })
  @Min(0, { message: 'Face value cannot be negative' })
  @Max(100000000, { message: 'Face value cannot exceed ₹10,00,00,000' })
  faceValue!: number;

  @Transform(({ value }) =>
    value === '' || value === null ? undefined : Number(value),
  )
  @IsDefined({ message: 'Coupon rate is required' })
  @IsNumber({}, { message: 'Coupon rate is required' })
  @Max(50, { message: 'Coupon rate seems unrealistic above 50%' })
  annualCouponRate!: number;

  @Transform(({ value }) =>
    value === '' || value === null ? undefined : Number(value),
  )
  @IsDefined({ message: 'Market price is required' })
  @IsNumber({}, { message: 'Market price is required' })
  @NotEquals(0, { message: 'Market price must be greater than 0' })
  @Min(0, { message: 'Market price cannot be negative' })
  marketPrice!: number;

  @Transform(({ value }) =>
    value === '' || value === null ? undefined : Number(value),
  )
  @IsDefined({ message: 'Years to maturity is required' })
  @IsNumber({}, { message: 'Years to maturity is required' })
  @Min(1, { message: 'Maturity must be at least 1 year' })
  @Max(50, { message: 'Years cannot exceed 50' })
  yearsToMaturity!: number;

  @IsDefined({ message: 'Coupon frequency is required' })
  @IsIn(['annual', 'semi-annual'], {
    message: 'Coupon frequency must be annual or semi-annual',
  })
  couponFrequency!: 'annual' | 'semi-annual';
}
