import { formatNumber, formatPercent } from './calculations';

describe('bond calculation formatters', () => {
  test('formats numbers using Indian grouping', () => {
    expect(formatNumber(100000)).toBe('1,00,000');
    expect(formatNumber(12345.67)).toBe('12,345.67');
  });

  test('formats percent with two decimals', () => {
    expect(formatPercent(8.947368421052632)).toBe('8.95%');
  });
});
