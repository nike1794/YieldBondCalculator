import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class BondCalculationRequestDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'faceValue mandatory type must be number' })
  @IsNotEmpty({ message: 'faceValue should not be empty' })
  @Min(0.000001, { message: 'faceValue must be greater than 0' })
  faceValue!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'annualCouponRate mandatory type must be number' })
  @IsNotEmpty({ message: 'annualCouponRate should not be empty' })
  @Min(0, { message: 'annualCouponRate must be 0 or greater' })
  annualCouponRate!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'marketPrice mandatory type must be number' })
  @IsNotEmpty({ message: 'marketPrice should not be empty' })
  @Min(0.000001, { message: 'marketPrice must be greater than 0' })
  marketPrice!: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'yearsToMaturity mandatory type must be number' })
  @IsNotEmpty({ message: 'yearsToMaturity should not be empty' })
  @Min(0.000001, { message: 'yearsToMaturity must be greater than 0' })
  yearsToMaturity!: number;

  @IsNotEmpty({ message: 'couponFrequency should not be empty' })
  @IsIn(['annual', 'semi-annual'], {
    message: 'couponFrequency mandatory type must be annual or semi-annual',
  })
  couponFrequency!: 'annual' | 'semi-annual';
}
