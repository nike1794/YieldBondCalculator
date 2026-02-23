export class CashFlowItemDto {
  period!: number;
  paymentDate!: string;
  couponPayment!: number;
  cumulativeInterest!: number;
  remainingPrincipal!: number;
}

export class BondCalculationResponseDto {
  currentYield!: number;
  ytm: number | null = null;
  totalInterestEarned!: number;
  premiumOrDiscountIndicator!: 'PREMIUM' | 'DISCOUNT' | 'PAR';
  couponFrequency!: 'annual' | 'semi-annual';
  couponPaymentPerPeriod!: number;
  numberOfPeriods!: number;
  cashFlowSchedule!: CashFlowItemDto[];
}
