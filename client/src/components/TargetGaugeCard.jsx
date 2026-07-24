import { formatCurrency } from '../utils/format.js';

function GaugeCircle({ percent, label, color = '#10B981', sublabel }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="gauge-item">
      <div className="gauge-item__circle">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="10"
          />
          {/* Active arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="gauge-item__val mono">{percent}%</div>
      </div>
      <div className="gauge-item__meta">
        <span className="gauge-item__title">{label}</span>
        {sublabel && <span className="gauge-item__sublabel mono">{sublabel}</span>}
      </div>
    </div>
  );
}

export default function TargetGaugeCard({ summary }) {
  const income = summary?.totalIncome ?? 0;
  const expense = summary?.totalExpense ?? 0;
  const net = summary?.net ?? 0;

  // Savings rate calculation (% of income saved)
  const savingsRate = income > 0 ? Math.max(0, Math.min(100, Math.round((net / income) * 100))) : 0;
  
  // Budget usage (% of income spent)
  const budgetUsage = income > 0 ? Math.min(100, Math.round((expense / income) * 100)) : (expense > 0 ? 100 : 0);

  return (
    <div className="target-gauge-card">
      <div className="target-gauge-card__head">
        <h3 className="target-gauge-card__title">Financial Target Efficiency</h3>
        <span className="target-gauge-card__badge">Monthly Audit</span>
      </div>
      <div className="target-gauge-card__body">
        <GaugeCircle
          percent={savingsRate}
          label="Savings Rate"
          color="#10B981"
          sublabel={`${formatCurrency(Math.max(0, net))} saved`}
        />
        <GaugeCircle
          percent={budgetUsage}
          label="Budget Spent"
          color={budgetUsage > 90 ? '#EF4444' : '#8B5CF6'}
          sublabel={`${formatCurrency(expense)} of ${formatCurrency(income)}`}
        />
      </div>
    </div>
  );
}
