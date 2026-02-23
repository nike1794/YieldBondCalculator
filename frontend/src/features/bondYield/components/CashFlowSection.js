import React from 'react';
import CurrencyValue from './CurrencyValue';

function CashFlowSection({ result }) {
  const schedule = result?.cashFlowSchedule ?? [];

  return (
    <section className="panel">
      <h2>Cash Flow Schedule</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Payment Date</th>
              <th>Coupon Payment</th>
              <th>Cumulative Interest</th>
              <th>Remaining Principal</th>
              <th>Principal Returned</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, index) => {
              const previousRemainingPrincipal =
                index === 0 ? result.faceValue : schedule[index - 1].remainingPrincipal;
              const principalReturned = Math.max(0, previousRemainingPrincipal - row.remainingPrincipal);

              return (
                <tr
                  key={row.period}
                  className={index === schedule.length - 1 || row.remainingPrincipal === 0 ? 'last-row' : ''}
                >
                <td>{row.period}</td>
                <td>{row.paymentDate}</td>
                <td><CurrencyValue amount={row.couponPayment} /></td>
                <td><CurrencyValue amount={row.cumulativeInterest} /></td>
                <td><CurrencyValue amount={row.remainingPrincipal} /></td>
                <td><CurrencyValue amount={principalReturned} /></td>
                </tr>
              );
            })}
            {!result && (
              <tr>
                <td colSpan="6" className="empty-cell">
                  Click Calculate to generate the schedule.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CashFlowSection;
