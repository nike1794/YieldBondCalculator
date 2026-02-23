import { BadRequestException, Injectable } from '@nestjs/common';
import {
  PERCENT_BASE,
  YTM_MAX_ITERATIONS,
  YTM_MAX_PERCENT,
  YTM_MIN_PERCENT,
  YTM_PRICE_TOLERANCE,
} from '../common/Constants';
import { BondCalculationRequestDto } from '../models/BondCalculationRequestDto';
import {
  BondCalculationResponseDto,
  CashFlowItemDto,
} from '../models/BondCalculationResponseDto';
import { logger } from '../common/logger';
import { roundToFixed } from '../utils/number';

@Injectable()
export class BondService {
  public calculateBondYield(
    input: BondCalculationRequestDto,
  ): BondCalculationResponseDto {
    logger.info('Bond yield calculation started', input);
    const {
      faceValue,
      annualCouponRate,
      marketPrice,
      yearsToMaturity,
      couponFrequency,
    } = input;

    if (yearsToMaturity <= 0) {
      logger.error('Validation failed: yearsToMaturity must be greater than 0');
      throw new BadRequestException('yearsToMaturity must be greater than 0');
    }

    const paymentsPerYear = couponFrequency === 'annual' ? 1 : 2;
    const annualCouponPayment = faceValue * (annualCouponRate / PERCENT_BASE);
    const couponPaymentPerPeriod = annualCouponPayment / paymentsPerYear;
    const currentYield = roundToFixed(
      (annualCouponPayment / marketPrice) * PERCENT_BASE,
    );
    const numberOfPeriods = yearsToMaturity * paymentsPerYear;
    if (!Number.isInteger(numberOfPeriods)) {
      logger.error(
        'Validation failed: yearsToMaturity must align with couponFrequency into whole periods',
        { yearsToMaturity, couponFrequency },
      );
      throw new BadRequestException(
        'yearsToMaturity must align with couponFrequency into whole periods',
      );
    }
    const rawYtm = this.calculateYTM(
      faceValue,
      annualCouponRate / PERCENT_BASE,
      marketPrice,
      yearsToMaturity,
      paymentsPerYear,
    );
    const ytm = roundToFixed(rawYtm);
    const totalInterestEarned = roundToFixed(
      annualCouponPayment * yearsToMaturity,
    );
    const premiumOrDiscountIndicator =
      marketPrice > faceValue
        ? 'PREMIUM'
        : marketPrice < faceValue
          ? 'DISCOUNT'
          : 'PAR';

    const cashFlowSchedule = this.buildCashFlowSchedule(
      numberOfPeriods,
      couponPaymentPerPeriod,
      faceValue,
      paymentsPerYear,
    );

    const result: BondCalculationResponseDto = {
      currentYield,
      ytm,
      totalInterestEarned,
      premiumOrDiscountIndicator,
      couponFrequency,
      couponPaymentPerPeriod,
      numberOfPeriods,
      cashFlowSchedule,
    };
    logger.info('Bond yield calculation completed', {
      currentYield: result.currentYield,
      totalInterestEarned: result.totalInterestEarned,
      numberOfPeriods: result.numberOfPeriods,
    });
    return result;
  }

  private buildCashFlowSchedule(
    numberOfPeriods: number,
    couponPaymentPerPeriod: number,
    faceValue: number,
    paymentsPerYear: number,
  ): CashFlowItemDto[] {
    logger.info('Building cash flow schedule', {
      numberOfPeriods,
      paymentsPerYear,
    });
    const schedule: CashFlowItemDto[] = [];
    const monthsPerPeriod = 12 / paymentsPerYear;
    const startDate = new Date();
    let cumulativeInterest = 0;

    for (let period = 1; period <= numberOfPeriods; period += 1) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(startDate.getMonth() + period * monthsPerPeriod);
      cumulativeInterest += couponPaymentPerPeriod;

      schedule.push({
        period,
        paymentDate: paymentDate.toISOString().slice(0, 10),
        couponPayment: couponPaymentPerPeriod,
        cumulativeInterest,
        remainingPrincipal: period === numberOfPeriods ? 0 : faceValue,
      });
    }

    logger.info('Cash flow schedule built', { items: schedule.length });
    return schedule;
  }

  private calculateYTM(
    faceValue: number,
    couponRate: number,
    marketPrice: number,
    years: number,
    frequency: number,
  ): number {
    const couponPayment = (faceValue * couponRate) / frequency;
    const totalPeriods = years * frequency;
    const tolerance = YTM_PRICE_TOLERANCE;
    let low = YTM_MIN_PERCENT;
    let high = YTM_MAX_PERCENT;
    let bestYtm = YTM_MIN_PERCENT;
    let bestDiff = Number.POSITIVE_INFINITY;

    for (let iteration = 0; iteration < YTM_MAX_ITERATIONS; iteration += 1) {
      const mid = (low + high) / 2;
      const periodicRate = mid / PERCENT_BASE / frequency;
      const calculatedPrice = this.getBondPrice(
        couponPayment,
        faceValue,
        periodicRate,
        totalPeriods,
      );
      const diff = Math.abs(calculatedPrice - marketPrice);

      if (diff < bestDiff) {
        bestDiff = diff;
        bestYtm = mid;
      }

      if (diff < tolerance) {
        return roundToFixed(mid);
      }

      if (calculatedPrice > marketPrice) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return roundToFixed(bestYtm);
  }

  private getBondPrice(
    couponPayment: number,
    faceValue: number,
    periodicRate: number,
    totalPeriods: number,
  ): number {
    let price = 0;
    for (let period = 1; period <= totalPeriods; period += 1) {
      price += couponPayment / (1 + periodicRate) ** period;
    }

    price += faceValue / (1 + periodicRate) ** totalPeriods;
    return price;
  }
}
