export const FREQUENCIES = {
  annual: { label: 'Annual', apiValue: 'annual' },
  semiAnnual: { label: 'Semi-Annual', apiValue: 'semi-annual' },
};

export const BOND_CALCULATE_API_URL =
  process.env.REACT_APP_BOND_API_URL || 'http://localhost:8000/bond/calculate';
export const CURRENCY_SYMBOL = '\u20B9';

export const FORM_DEFAULTS = {
  faceValue: '0',
  couponRate: '0',
  marketPrice: '0',
  yearsToMaturity: '0',
  couponFrequency: 'annual',
};

export const LIMITS = {
  maxCouponRate: 100,
  maxYearsToMaturity: 50,
  maxAmountDigits: 10,
  maxFaceValue: 100000000,
};

export const VALIDATION_MESSAGES = {
  faceValueRequired: 'Face value is required',
  faceValueZero: 'Face value must be greater than 0',
  faceValueNegative: 'Face value cannot be negative',
  faceValueMax: 'Face value cannot exceed \u20B910,00,00,000',
  marketPriceRequired: 'Market price is required',
  marketPriceZero: 'Market price must be greater than 0',
  marketPriceNegative: 'Market price cannot be negative',
  couponRateRequired: 'Coupon rate is required',
  couponRateUnrealistic: 'Coupon rate seems unrealistic above 50%',
  yearsRequired: 'Years to maturity is required',
  yearsZero: 'Maturity must be at least 1 year',
  yearsMax: 'Years cannot exceed 50',
};
