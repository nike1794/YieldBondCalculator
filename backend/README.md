## Description

Backend API for Bond Yield calculation built with NestJS and TypeScript.

## Project setup

```bash
npm install
```

## Compile and run

```bash
# build
npm run build

# start
npm run start

# watch mode (auto-restart on changes)
npm run serve

# production mode
npm run start:prod
```

## Lint

```bash
npm run lint
```

## Tests

```bash
# unit tests
npm run test

# watch tests
npm run test:watch

```

## Notes

- Main endpoint: `POST /bond/calculate`

## API Endpoint

### `POST /bond/calculate`

Calculates bond metrics from the input payload.

#### Request body

```json
{
  "faceValue": 1000,
  "annualCouponRate": 8,
  "marketPrice": 950,
  "yearsToMaturity": 5,
  "couponFrequency": "annual"
}
```

#### Response (success)

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "currentYield": 8.42,
    "ytm": 9.29,
    "totalInterestEarned": 400,
    "premiumOrDiscountIndicator": "DISCOUNT",
    "couponFrequency": "annual",
    "couponPaymentPerPeriod": 80,
    "numberOfPeriods": 5,
    "cashFlowSchedule": [
      {
        "period": 1,
        "paymentDate": "2026-03-23",
        "couponPayment": 80,
        "cumulativeInterest": 80,
        "remainingPrincipal": 1000
      }
    ]
  }
}
```
