import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { formatCurrency } from '../utils/format.js';
import EmptyState from './EmptyState.jsx';

// ---- Fill in zero-gap days ------------------------------------------------
function buildFullMonthData(raw, month) {
  if (!raw?.length) return [];

  // How many days in this month?
  const [y, m] = month.split('-').map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();

  // Build a lookup from the API response
  const lookup = {};
  for (const row of raw) lookup[row.date] = row;

  const result = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${month}-${String(d).padStart(2, '0')}`;
    result.push({
      day: d,
      label: d % 5 === 1 || d === daysInMonth ? String(d) : '', // tick every 5 days
      expense: lookup[dateStr]?.expense ?? 0,
      income:  lookup[dateStr]?.income  ?? 0,
    });
  }
  return result;
}

// ---- Custom tooltip --------------------------------------------------------
function DailyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const exp = payload.find((p) => p.dataKey === 'expense');
  const inc = payload.find((p) => p.dataKey === 'income');
  return (
    <div className="chart-tooltip trend-tooltip">
      <span className="chart-tooltip__name">Day {label}</span>
      {inc?.value > 0 && (
        <span className="trend-tooltip__row">
          <span>
            <span className="trend-tooltip__dot" style={{ background: '#10b981' }} />
            Income
          </span>
          <span className="mono" style={{ color: '#10b981' }}>{formatCurrency(inc.value)}</span>
        </span>
      )}
      {exp?.value > 0 && (
        <span className="trend-tooltip__row">
          <span>
            <span className="trend-tooltip__dot" style={{ background: '#f43f5e' }} />
            Expense
          </span>
          <span className="mono" style={{ color: '#f43f5e' }}>{formatCurrency(exp.value)}</span>
        </span>
      )}
    </div>
  );
}

// ---- Main component --------------------------------------------------------
/**
 * Area chart showing per-day expense and income within the selected month.
 * All days in the month are plotted; days with no activity show zero.
 */
export default function DailySpendingChart({ data, month }) {
  const hasData = data?.some((d) => d.expense > 0 || d.income > 0);

  if (!hasData) {
    return (
      <EmptyState
        icon="📅"
        title="No daily data yet"
        message="Add transactions and your day-by-day activity will appear here."
      />
    );
  }

  const chartData = buildFullMonthData(data, month);

  return (
    <div className="daily-chart">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={chartData}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradExp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.03} />
            </linearGradient>
            <linearGradient id="gradInc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="rgba(139,92,246,0.1)"
            strokeDasharray="4 3"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={58}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
            tick={{ fontSize: 11, fill: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}
          />
          <Tooltip content={<DailyTooltip />} cursor={{ stroke: 'var(--border-hover)', strokeWidth: 1 }} />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: '0.78rem', paddingTop: '10px', color: 'var(--text-3)' }}
            formatter={(v) => v === 'income' ? 'Income' : 'Expenses'}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gradInc)"
            dot={false}
            activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#f43f5e"
            strokeWidth={2}
            fill="url(#gradExp)"
            dot={false}
            activeDot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
