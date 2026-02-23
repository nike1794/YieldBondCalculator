# Bond Yield Calculator UI

React UI for a bond yield calculator assignment. The UI collects bond inputs, calls a backend API, and renders output metrics plus a cash flow schedule.

## Features

- Structured 3-section UI:
  - Inputs
  - Output metrics
  - Cash flow table
- Backend-driven calculation via `POST /bond/calculate`
- Coupon rate validation:
  - Max 100
  - Up to 2 decimal places
- Indian number grouping in inputs and output values (for example `1,00,000`)
- Reusable currency prefix (`₹`) controlled from one constant
- Loading and API error states

## Tech Stack

- React (Create React App)
- React Testing Library + Jest

## Project Structure

```text
src/
  App.js
  features/
    bondYield/
      BondYieldCalculator.js
      BondYieldCalculator.css
      constants.js
      components/
        InputSection.js
        MetricsSection.js
        CashFlowSection.js
        CurrencyValue.js
      utils/
        calculations.js
        calculations.test.js
      BondYieldCalculator.test.js
```

## Run Locally

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

## Test

```bash
npm test -- --watchAll=false
```

## API Contract

### Endpoint

`POST http://localhost:8000/bond/calculate`

### Environment override (optional)

You can override the API URL using:

```bash
REACT_APP_BOND_API_URL=<your_url>
```

If env is not provided, the app falls back to:

`http://localhost:8000/bond/calculate`

### Request body

```json
{
  "faceValue": 1000,
  "annualCouponRate": 8.5,
  "marketPrice": 950,
  "yearsToMaturity": 5,
  "couponFrequency": "semi-annual"
}
```

### Response fields used by UI

- `currentYield`
- `ytm`
- `totalInterestEarned`
- `premiumOrDiscountIndicator`
- `cashFlowSchedule[]`

## Assumptions

- Backend owns all financial calculations.
- UI only validates input shape/range and renders backend response.
- `premiumOrDiscountIndicator` can be `DISCOUNT`, `PREMIUM`, or `PAR`.



