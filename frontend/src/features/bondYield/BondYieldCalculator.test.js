import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BondYieldCalculator from './BondYieldCalculator';
import { BOND_CALCULATE_API_URL } from './constants';

describe('BondYieldCalculator', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('enforces coupon rate max 100 and two decimals', () => {
    render(<BondYieldCalculator />);

    const couponInput = screen.getByLabelText(/Coupon Rate %/i);

    fireEvent.change(couponInput, { target: { value: '12.27' } });
    expect(couponInput).toHaveValue('12.27');

    fireEvent.change(couponInput, { target: { value: '12.278' } });
    expect(couponInput).toHaveValue('12.27');

    fireEvent.change(couponInput, { target: { value: '101' } });
    expect(couponInput).toHaveValue('12.27');
  });

  test('submits payload and renders API response', async () => {
    const apiResponse = {
      success: true,
      statusCode: 200,
      data: {
        currentYield: 8.947368421052632,
        ytm: null,
        totalInterestEarned: 425,
        premiumOrDiscountIndicator: 'DISCOUNT',
        couponFrequency: 'semi-annual',
        couponPaymentPerPeriod: 42.5,
        numberOfPeriods: 2,
        cashFlowSchedule: [
          {
            period: 1,
            paymentDate: '2026-08-23',
            couponPayment: 42.5,
            cumulativeInterest: 42.5,
            remainingPrincipal: 1000,
          },
          {
            period: 2,
            paymentDate: '2027-02-23',
            couponPayment: 42.5,
            cumulativeInterest: 85,
            remainingPrincipal: 0,
          },
        ],
      },
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => apiResponse,
    });

    render(<BondYieldCalculator />);

    fireEvent.change(screen.getByLabelText(/Face Value/i), { target: { value: '1,000' } });
    fireEvent.change(screen.getByLabelText(/Coupon Rate %/i), { target: { value: '8.5' } });
    fireEvent.change(screen.getByLabelText(/Market Price/i), { target: { value: '950' } });
    fireEvent.change(screen.getByLabelText(/Years to Maturity/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Coupon Frequency/i), { target: { value: 'semiAnnual' } });

    fireEvent.click(screen.getByRole('button', { name: /Calculate/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(global.fetch).toHaveBeenCalledWith(BOND_CALCULATE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        faceValue: 1000,
        annualCouponRate: 8.5,
        marketPrice: 950,
        yearsToMaturity: 5,
        couponFrequency: 'semi-annual',
      }),
    });

    expect(await screen.findByText('8.95%')).toBeInTheDocument();
    expect(screen.getByText('DISCOUNT')).toBeInTheDocument();
    expect(screen.getByText('2027-02-23')).toBeInTheDocument();
  });

  test('shows backend error message on failed API response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Invalid request payload' }),
    });

    render(<BondYieldCalculator />);

    fireEvent.change(screen.getByLabelText(/Face Value/i), { target: { value: '1,000' } });
    fireEvent.change(screen.getByLabelText(/Coupon Rate %/i), { target: { value: '8.5' } });
    fireEvent.change(screen.getByLabelText(/Market Price/i), { target: { value: '950' } });
    fireEvent.change(screen.getByLabelText(/Years to Maturity/i), { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: /Calculate/i }));

    expect(await screen.findByText('Invalid request payload')).toBeInTheDocument();
  });
});
