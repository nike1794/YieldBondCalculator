export const toNumberOrZero = (value) => Number(value || 0);

export const mapFormToCalculateRequest = (form, frequencies) => ({
  faceValue: toNumberOrZero(form.faceValue),
  annualCouponRate: toNumberOrZero(form.couponRate),
  marketPrice: toNumberOrZero(form.marketPrice),
  yearsToMaturity: toNumberOrZero(form.yearsToMaturity),
  couponFrequency: frequencies[form.couponFrequency].apiValue,
});

export const mapStatusTone = (indicator) => {
  if (!indicator) {
    return undefined;
  }

  if (indicator === 'DISCOUNT') {
    return 'discount';
  }

  if (indicator === 'PREMIUM') {
    return 'premium';
  }

  return 'par';
};

export const mapCalculateResponseToViewModel = (apiData, form) => ({
  ...apiData,
  faceValue: toNumberOrZero(form.faceValue),
});
