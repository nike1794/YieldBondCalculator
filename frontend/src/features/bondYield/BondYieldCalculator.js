import React, { useMemo, useState } from 'react';
import {
  FORM_DEFAULTS,
  FREQUENCIES,
  LIMITS,
  VALIDATION_MESSAGES,
} from './constants';
import InputSection from './components/InputSection';
import MetricsSection from './components/MetricsSection';
import CashFlowSection from './components/CashFlowSection';
import CurrencyValue from './components/CurrencyValue';
import { calculateBond } from './services/bondApi';
import {
  mapCalculateResponseToViewModel,
  mapFormToCalculateRequest,
  mapStatusTone,
  toNumberOrZero,
} from './mappers/bondMapper';
import { formatPercent } from './utils/calculations';
import './BondYieldCalculator.css';

function BondYieldCalculator() {
  const [form, setForm] = useState(FORM_DEFAULTS);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    if (field === 'faceValue') {
      if (value === '') {
        return VALIDATION_MESSAGES.faceValueRequired;
      }
      const numeric = toNumberOrZero(value);
      if (numeric < 0) {
        return VALIDATION_MESSAGES.faceValueNegative;
      }
      if (numeric === 0) {
        return VALIDATION_MESSAGES.faceValueZero;
      }
      if (numeric > LIMITS.maxFaceValue) {
        return VALIDATION_MESSAGES.faceValueMax;
      }
      return '';
    }

    if (field === 'marketPrice') {
      if (value === '') {
        return VALIDATION_MESSAGES.marketPriceRequired;
      }
      const numeric = toNumberOrZero(value);
      if (numeric < 0) {
        return VALIDATION_MESSAGES.marketPriceNegative;
      }
      if (numeric === 0) {
        return VALIDATION_MESSAGES.marketPriceZero;
      }
      return '';
    }

    if (field === 'couponRate') {
      if (value === '') {
        return VALIDATION_MESSAGES.couponRateRequired;
      }
      const numeric = toNumberOrZero(value);
      if (numeric > 50) {
        return VALIDATION_MESSAGES.couponRateUnrealistic;
      }
      return '';
    }

    if (field === 'yearsToMaturity') {
      if (value === '') {
        return VALIDATION_MESSAGES.yearsRequired;
      }
      const numeric = toNumberOrZero(value);
      if (numeric <= 0) {
        return VALIDATION_MESSAGES.yearsZero;
      }
      if (numeric > LIMITS.maxYearsToMaturity) {
        return VALIDATION_MESSAGES.yearsMax;
      }
      return '';
    }

    return '';
  };

  const validateForm = () => {
    const nextErrors = {
      faceValue: validateField('faceValue', form.faceValue),
      marketPrice: validateField('marketPrice', form.marketPrice),
      couponRate: validateField('couponRate', form.couponRate),
      yearsToMaturity: validateField('yearsToMaturity', form.yearsToMaturity),
    };
    setErrors(nextErrors);

    return Object.values(nextErrors).filter(Boolean);
  };

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    if (errorMessage) {
      setErrorMessage('');
    }

    if (field === 'couponFrequency') {
      setForm((prev) => ({ ...prev, [field]: value }));
      return;
    }

    if (field === 'faceValue' || field === 'marketPrice') {
      if (!/^-?\d{0,10}(\.\d{0,2})?$/.test(value)) {
        return;
      }
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
      return;
    }

    if (field === 'couponRate') {
      if (!/^-?\d{0,3}(\.\d{0,2})?$/.test(value)) {
        return;
      }
      if (value !== '' && Number(value) > LIMITS.maxCouponRate) {
        return;
      }
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
      return;
    }

    if (!/^-?\d*\.?\d*$/.test(value)) {
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleCalculate = async () => {
    const activeErrors = validateForm();
    if (activeErrors.length > 0) {
      setErrorMessage('');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const requestBody = mapFormToCalculateRequest(form, FREQUENCIES);
      const data = await calculateBond(requestBody);
      setResult(mapCalculateResponseToViewModel(data, form));
    } catch (error) {
      setResult(null);
      setErrorMessage(error.message || 'Failed to connect to calculation API.');
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(
    () => [
      {
        label: 'Current Yield',
        value: result?.currentYield != null ? formatPercent(result.currentYield) : '--',
      },
      {
        label: 'YTM',
        value: result?.ytm != null ? formatPercent(result.ytm) : '--',
      },
      {
        label: 'Total Interest',
        value:
          result?.totalInterestEarned != null ? <CurrencyValue amount={result.totalInterestEarned} /> : '--',
      },
      {
        label: 'Status',
        value: result?.premiumOrDiscountIndicator ?? '--',
        tone: mapStatusTone(result?.premiumOrDiscountIndicator),
      },
    ],
    [result]
  );

  return (
    <main className="bond-app">
      <InputSection
        form={form}
        onFieldChange={handleFieldChange}
        frequencies={FREQUENCIES}
        onCalculate={handleCalculate}
        loading={loading}
        yearsToMaturityError={errors.yearsToMaturity}
        maxYearsToMaturity={LIMITS.maxYearsToMaturity}
        faceValueError={errors.faceValue}
        marketPriceError={errors.marketPrice}
        couponRateMessage={errors.couponRate}
      />
      {errorMessage && <p className="api-error">{errorMessage}</p>}
      <MetricsSection metrics={metrics} />
      <CashFlowSection result={result} />
    </main>
  );
}

export default BondYieldCalculator;
