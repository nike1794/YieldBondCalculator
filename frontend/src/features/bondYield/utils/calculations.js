export const formatPercent = (value) => `${value.toFixed(2)}%`;

export const formatNumber = (value) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
