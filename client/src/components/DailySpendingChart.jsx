import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { formatCurrency } from '../utils/format.js';
import EmptyState from './EmptyState.jsx';

function VelocityTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const expense = payload.find((p) => p.dataKey === 'expense')?.value ?? 0;
  const income = payload.find((p) => p.dataKey === 'income')?.value ?? 0;

  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip__name">{label}</span>
      <div className="chart-tooltip__row">
        <span style={{ color: '#EF4444' }}>● Spent:</span>
        <span className="mono">{formatCurrency(expense)}</span>
      </div>
      {income > 0 && (
        <div className="chart-tooltip__row">
          <span style={{ color: '#10B981' }}>● Income:</span>
          <span className="mono">{formatCurrency(income)}</span>
        </div>
      )}
    </div>
  );
}

export default function DailySpendingChart({ dailyData }) {
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' | 'daily'

  const daily = dailyData?.daily || [];
  const weekly = dailyData?.weekly || [];

  const hasData = daily.some((d) => d.expense > 0 || d.income > 0);

  if (!hasData) {
    return (
      <EmptyState
        icon="⚡"
        title="No velocity data"
        message="Add expenses in this month to track your spending velocity curves."
      />
    );
  }

  const chartData = viewMode === 'weekly'
    ? weekly.map((w) => ({ name: w.week, expense: w.expense, income: w.income }))
    : daily.map((d) => ({ name: d.label, expense: d.expense, income: d.income }));

  return (
    <div className="velocity-chart-card">
      <div className="velocity-chart-card__head">
        <div>
          <h3 className="velocity-chart-card__title">Spending Velocity</h3>
          <p className="velocity-chart-card__sub">Distribution across the month</p>
        </div>
        <div className="chart-tabs" role="tablist">
          <button
            type="button"
            className={`chart-tab ${viewMode === 'weekly' ? 'is-active' : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`chart-tab ${viewMode === 'daily' ? 'is-active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            Daily
          </button>
        </div>
      </div>

      <div className="velocity-chart-card__body">
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--muted)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--muted)' }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
            />
            <Tooltip content={<VelocityTooltip />} />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#A78BFA"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#expenseGrad)"
              dot={{ r: 4, fill: '#FFFFFF', stroke: '#8B5CF6', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#A78BFA', strokeWidth: 3 }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#incomeGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
