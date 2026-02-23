import { ROUND_DECIMALS } from '../common/Constants';

export function roundToFixed(
  value: number,
  decimals: number = ROUND_DECIMALS,
): number {
  return Number.parseFloat(value.toFixed(decimals));
}
