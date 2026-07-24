import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { formatCurrency } from '../utils/format.js';
import EmptyState from './EmptyState.jsx';

// ---- Helpers ---------------------------------------------------------------

/** "2026-02" → "Feb" */
function shortMonth(yyyyMM) {
  const [year, month] = yyyyMM.split('-');
  return new Date(Number(year), Number(month) - 1, 1).toLocaleString('default', {
    month: 'short',
  });
}

// ---- Custom tooltip --------------------------------------------------------
function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const income = payload.find((p) => p.dataKey === 'totalIncome');
  const expense = payload.find((p) => p.dataKey === 'totalExpense');
  const net = (income?.value ?? 0) - (expense?.value ?? 0);
  return (
    <div className="chart-tooltip trend-tooltip">
      <span className="chart-tooltip__name">{label}</span>
      {income && (
        <span className="trend-tooltip__row">
          <span className="trend-tooltip__dot" style={{ background: income.fill }} />
          <span>Income</span>
          <span className="mono">{formatCurrency(income.value)}</span>
        </span>
      )}
      {expense && (
        <span className="trend-tooltip__row">
          <span className="trend-tooltip__dot" style={{ background: expense.fill }} />
          <span>Expenses</span>
          <span className="mono">{formatCurrency(expense.value)}</span>
        </span>
      )}
      <span className="trend-tooltip__row trend-tooltip__net">
        <span>Net</span>
        <span className={`mono ${net >= 0 ? 'trend-tooltip__pos' : 'trend-tooltip__neg'}`}>
          {net >= 0 ? '+' : ''}
          {formatCurrency(net)}
        </span>
      </span>
    </div>
  );
}

// ---- Main component --------------------------------------------------------
/**
 * Grouped bar chart: income vs expenses per month over the last N months.
 * `data` is the array returned by GET /api/summary/trend.
 */
export default function MonthlyTrendChart({ data = [] }) {
  // Only show months that have at least some data so we don't render 6 empty bars
  // on a fresh install. Fall back to the full array once data starts coming in.
  const hasAnyData = data.some((d) => d.totalIncome > 0 || d.totalExpense > 0);

  if (!hasAnyData) {
    return (
      <EmptyState
        icon="📈"
        title="No trend data yet"
        message="Add transactions across a few months and your income vs. spending trend will appear here."
      />
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    name: shortMonth(d.month),
  }));

  return (
    <div className="trend-chart">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          barCategoryGap="28%"
          barGap={4}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--line)"
            strokeDasharray="4 3"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--faint)', fontFamily: 'var(--font-sans)' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={64}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
            tick={{ fontSize: 11, fill: 'var(--faint)', fontFamily: 'var(--font-mono)' }}
          />
          <Tooltip content={<TrendTooltip />} cursor={{ fill: 'var(--brand-tint)', radius: 4 }} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '0.8rem', paddingTop: '12px', color: 'var(--muted)' }}
            formatter={(value) => (value === 'totalIncome' ? 'Income' : 'Expenses')}
          />
          <Bar
            dataKey="totalIncome"
            name="totalIncome"
            fill="var(--income)"
            radius={[5, 5, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey="totalExpense"
            name="totalExpense"
            fill="var(--expense)"
            radius={[5, 5, 0, 0]}
            maxBarSize={40}
            opacity={0.82}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
