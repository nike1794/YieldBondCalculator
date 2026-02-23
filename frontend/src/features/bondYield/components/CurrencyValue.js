import React from 'react';
import { CURRENCY_SYMBOL } from '../constants';
import { formatNumber } from '../utils/calculations';

function CurrencyValue({ amount }) {
  return <span>{`${CURRENCY_SYMBOL} ${formatNumber(amount)}`}</span>;
}

export default CurrencyValue;
