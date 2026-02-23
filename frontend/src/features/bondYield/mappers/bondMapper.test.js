import {
  mapCalculateResponseToViewModel,
  mapFormToCalculateRequest,
  mapStatusTone,
} from './bondMapper';

const frequencies = {
  annual: { apiValue: 'annual' },
  semiAnnual: { apiValue: 'semi-annual' },
};

describe('bondMapper', () => {
  test('maps form state to calculate API request', () => {
    const form = {
      faceValue: '1000',
      couponRate: '8.5',
      marketPrice: '950',
      yearsToMaturity: '5',
      couponFrequency: 'semiAnnual',
    };

    expect(mapFormToCalculateRequest(form, frequencies)).toEqual({
      faceValue: 1000,
      annualCouponRate: 8.5,
      marketPrice: 950,
      yearsToMaturity: 5,
      couponFrequency: 'semi-annual',
    });
  });

  test('maps API response to view model with normalized face value', () => {
    const apiData = { currentYield: 8.9 };
    const form = { faceValue: '1000' };

    expect(mapCalculateResponseToViewModel(apiData, form)).toEqual({
      currentYield: 8.9,
      faceValue: 1000,
    });
  });

  test('maps status indicator to UI tone', () => {
    expect(mapStatusTone('DISCOUNT')).toBe('discount');
    expect(mapStatusTone('PREMIUM')).toBe('premium');
    expect(mapStatusTone('PAR')).toBe('par');
    expect(mapStatusTone(undefined)).toBeUndefined();
  });
});
