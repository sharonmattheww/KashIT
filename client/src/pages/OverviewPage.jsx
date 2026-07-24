import { Link, useOutletContext } from 'react-router-dom';

import { useFinance } from '../context/FinanceContext.jsx';
import { formatMonth } from '../utils/format.js';
import SummaryCards from '../components/SummaryCards.jsx';
import CategoryChart from '../components/CategoryChart.jsx';
import DailySpendingChart from '../components/DailySpendingChart.jsx';
import MonthlyTrendChart from '../components/MonthlyTrendChart.jsx';
import TransactionList from '../components/TransactionList.jsx';
import Spinner from '../components/Spinner.jsx';

export default function OverviewPage() {
  const { summary, trend, daily, transactions, deleteTransaction } = useFinance();
  const { openForm } = useOutletContext();

  const recent = transactions.data ? transactions.data.slice(0, 6) : null;
  const currentMonthLabel = summary.data?.month ? formatMonth(summary.data.month) : '';
  const currentYear = summary.data?.month ? summary.data.month.slice(0, 4) : '2026';

  return (
    <div className="stack">
      {/* Featured Header Banner matching Reference Image 1 */}
      <div className="hero-banner">
        <div className="hero-banner__title-group">
          <span className="hero-banner__year">{currentYear}</span>
          <h1 className="hero-banner__heading">Monthly Financial Performance</h1>
          <p className="hero-banner__sub">{currentMonthLabel} Audit & Cashflow Intelligence</p>
        </div>
      </div>

      {/* Weekly & Daily Velocity Line Chart */}
      <DailySpendingChart dailyData={daily.data} />

      {/* 4 Summary Cards with Progress Bars */}
      <SummaryCards summary={summary.data} loading={summary.loading} />

      {/* Category Breakdown & Recent Activity */}
      <div className="overview-grid">
        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Spending by Category</h2>
            {summary.data?.month && <p className="panel__hint">{formatMonth(summary.data.month)}</p>}
          </div>
          <div className="panel__body">
            {summary.loading && !summary.data ? (
              <Spinner label="Building chart…" />
            ) : (
              <CategoryChart
                byCategory={summary.data?.byCategory}
                totalExpense={summary.data?.totalExpense}
              />
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Recent Activity</h2>
            <Link to="/transactions" className="panel__link">
              View all →
            </Link>
          </div>
          <div className="panel__body">
            <TransactionList
              transactions={recent}
              loading={transactions.loading}
              error={transactions.error}
              onEdit={openForm}
              onDelete={deleteTransaction}
              onAdd={() => openForm()}
            />
          </div>
        </section>
      </div>

      {/* Full-width 6-Month Income vs Expense Trend Bar Chart */}
      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Income vs Expenses — 6-Month Trend</h2>
          <p className="panel__hint">Historical Overview</p>
        </div>
        <div className="panel__body">
          {trend.loading && !trend.data ? (
            <Spinner label="Loading trend…" />
          ) : (
            <MonthlyTrendChart data={trend.data} />
          )}
        </div>
      </section>
    </div>
  );
}
