import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { formatCurrency } from '../utils/format.js';
import EmptyState from './EmptyState.jsx';

// ---- Shared tooltip --------------------------------------------------------
function ChartTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const slice = payload[0].payload;
  const percent = total ? Math.round((slice.total / total) * 100) : 0;
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip__name">{slice.category}</span>
      <span className="chart-tooltip__value mono">
        {formatCurrency(slice.total)} · {percent}%
      </span>
    </div>
  );
}

// ---- Horizontal bar tooltip ------------------------------------------------
function BarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip__name">{item.payload.category}</span>
      <span className="chart-tooltip__value mono">{formatCurrency(item.value)}</span>
    </div>
  );
}

// ---- Donut view ------------------------------------------------------------
function DonutView({ byCategory, totalExpense }) {
  return (
    <div className="chart">
      <div className="chart__donut">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={byCategory}
              dataKey="total"
              nameKey="category"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={1.5}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {byCategory.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip total={totalExpense} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="chart__center">
          <span className="chart__center-label">Spent</span>
          <span className="chart__center-value mono">{formatCurrency(totalExpense)}</span>
        </div>
      </div>

      <ul className="breakdown">
        {byCategory.map((item) => {
          const percent = totalExpense ? (item.total / totalExpense) * 100 : 0;
          return (
            <li className="breakdown__item" key={item.category}>
              <span className="breakdown__dot" style={{ background: item.color }} aria-hidden="true" />
              <span className="breakdown__name">{item.category}</span>
              <span className="breakdown__amount mono">{formatCurrency(item.total)}</span>
              <span className="breakdown__percent mono">{Math.round(percent)}%</span>
              <span className="breakdown__bar" aria-hidden="true">
                <span
                  className="breakdown__bar-fill"
                  style={{ width: `${percent}%`, background: item.color }}
                />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---- Horizontal bar view ---------------------------------------------------
function HBarView({ byCategory, totalExpense }) {
  // Max 8 categories to keep the chart readable; rest aggregated.
  const sorted = [...byCategory].sort((a, b) => b.total - a.total);
  const shown = sorted.slice(0, 8);

  return (
    <div className="chart chart--bar">
      <ResponsiveContainer width="100%" height={Math.max(180, shown.length * 38)}>
        <BarChart
          data={shown}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          barCategoryGap="22%"
        >
          <CartesianGrid
            horizontal={false}
            stroke="var(--line)"
            strokeDasharray="4 3"
          />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
            tick={{ fontSize: 11, fill: 'var(--faint)', fontFamily: 'var(--font-mono)' }}
          />
          <YAxis
            type="category"
            dataKey="category"
            axisLine={false}
            tickLine={false}
            width={80}
            tick={{ fontSize: 12, fill: 'var(--ink)', fontFamily: 'var(--font-sans)' }}
          />
          <Tooltip content={<BarTooltip />} cursor={{ fill: 'var(--brand-tint)' }} />
          <Bar
            dataKey="total"
            radius={[0, 5, 5, 0]}
            maxBarSize={20}
          >
            {shown.map((entry) => (
              <Cell key={entry.category} fill={entry.color} opacity={0.88} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Mini legend: total displayed + share */}
      <ul className="breakdown">
        {shown.map((item) => {
          const percent = totalExpense ? (item.total / totalExpense) * 100 : 0;
          return (
            <li className="breakdown__item" key={item.category}>
              <span className="breakdown__dot" style={{ background: item.color }} aria-hidden="true" />
              <span className="breakdown__name">{item.category}</span>
              <span className="breakdown__amount mono">{formatCurrency(item.total)}</span>
              <span className="breakdown__percent mono">{Math.round(percent)}%</span>
              <span className="breakdown__bar" aria-hidden="true">
                <span
                  className="breakdown__bar-fill"
                  style={{ width: `${percent}%`, background: item.color }}
                />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---- Tab toggle ------------------------------------------------------------
const TABS = [
  { id: 'donut', label: '🍩 Donut' },
  { id: 'bar', label: '📊 Bar' },
];

// The donut and the breakdown read the same `byCategory` array (one source of
// truth). Each category keeps the colour it was given in the database, so the
// slice, the legend swatch and the bar always match.
export default function CategoryChart({ byCategory = [], totalExpense = 0 }) {
  const [activeTab, setActiveTab] = useState('donut');

  if (!byCategory.length) {
    return (
      <EmptyState
        icon="○"
        title="No spending to chart"
        message="Add an expense this month and it will appear here."
      />
    );
  }

  return (
    <div>
      {/* Tab toggle */}
      <div className="chart-tabs" role="tablist" aria-label="Chart type">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`chart-tab ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart body */}
      {activeTab === 'donut' ? (
        <DonutView byCategory={byCategory} totalExpense={totalExpense} />
      ) : (
        <HBarView byCategory={byCategory} totalExpense={totalExpense} />
      )}
    </div>
  );
}
