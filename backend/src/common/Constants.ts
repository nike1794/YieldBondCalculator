export const DEFAULT_PORT = 8000;

export const CORS_ORIGINS = ['http://localhost:3000'];
export const CORS_METHODS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
];
export const CORS_ALLOWED_HEADERS = ['Content-Type', 'Authorization'];
export const CORS_CREDENTIALS = true;

export const RATE_LIMIT_TTL = 10_000;
export const RATE_LIMIT_MAX_REQUESTS = 10;

export const REQUEST_TIMEOUT_MS = 10_000;

export const PERCENT_BASE = 100;
export const ROUND_DECIMALS = 2;
export const YTM_MIN_PERCENT = 0;
export const YTM_MAX_PERCENT = 100;
export const YTM_MAX_ITERATIONS = 80;
export const YTM_PRICE_TOLERANCE = 0.05;
