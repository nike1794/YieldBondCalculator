import React from 'react';

const formatWithCommas = (value) => {
  if (value === '') {
    return '';
  }

  const isNegative = String(value).startsWith('-');
  const raw = isNegative ? String(value).slice(1) : String(value);
  if (raw === '') {
    return '-';
  }

  const [integerPart, decimalPart] = raw.split('.');
  const normalizedInt = integerPart === '' ? '0' : String(Number(integerPart));
  const withCommas = new Intl.NumberFormat('en-IN').format(Number(normalizedInt));

  const formatted = decimalPart !== undefined ? `${withCommas}.${decimalPart}` : withCommas;
  return isNegative ? `-${formatted}` : formatted;
};

function InputSection({
  form,
  onFieldChange,
  frequencies,
  onCalculate,
  loading,
  yearsToMaturityError,
  maxYearsToMaturity,
  faceValueError,
  marketPriceError,
  couponRateMessage,
}) {
  const handleFormattedChange = (field) => (event) => {
    const rawValue = event.target.value.replace(/,/g, '');
    onFieldChange(field)({ target: { value: rawValue } });
  };

  return (
    <section className="panel">
      <h1>Bond Yield Calculator</h1>

      <div className="form-grid">
        <label>
          Face Value
          <input
            type="text"
            inputMode="decimal"
            value={formatWithCommas(form.faceValue)}
            onChange={handleFormattedChange('faceValue')}
          />
          <small className={faceValueError ? 'field-error' : 'field-hint'}>
            {faceValueError || '\u00A0'}
          </small>
        </label>
        <label>
          Coupon Rate %
          <input
            type="text"
            inputMode="decimal"
            value={form.couponRate}
            onChange={onFieldChange('couponRate')}
            placeholder="0.00"
          />
          <small className={couponRateMessage ? 'field-warning' : 'field-hint'}>
            {couponRateMessage || '\u00A0'}
          </small>
        </label>
        <label>
          Market Price
          <input
            type="text"
            inputMode="decimal"
            value={formatWithCommas(form.marketPrice)}
            onChange={handleFormattedChange('marketPrice')}
          />
          <small className={marketPriceError ? 'field-error' : 'field-hint'}>
            {marketPriceError || '\u00A0'}
          </small>
        </label>
        <label>
          Years to Maturity
          <input
            type="text"
            inputMode="decimal"
            value={formatWithCommas(form.yearsToMaturity)}
            onChange={handleFormattedChange('yearsToMaturity')}
          />
          <small className={yearsToMaturityError ? 'field-error' : 'field-hint'}>
            {yearsToMaturityError || `Max ${maxYearsToMaturity} years`}
          </small>
        </label>
        <label>
          Coupon Frequency
          <select value={form.couponFrequency} onChange={onFieldChange('couponFrequency')}>
            {Object.entries(frequencies).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className="calculate-btn"
        type="button"
        onClick={onCalculate}
        disabled={loading}
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
    </section>
  );
}

export default InputSection;
