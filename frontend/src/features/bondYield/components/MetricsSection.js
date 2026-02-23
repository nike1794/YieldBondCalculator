import React from 'react';

function MetricsSection({ metrics }) {
  return (
    <section className="panel">
      <h2>Output Metrics</h2>
      <div className="metrics">
        {metrics.map((metric) => (
          <div className="metric-row" key={metric.label}>
            <span>{metric.label}</span>
            <strong className={metric.tone ? `status-${metric.tone}` : ''}>{metric.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MetricsSection;
