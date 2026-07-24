import { Link, useOutletContext } from 'react-router-dom';

import { useFinance } from '../context/FinanceContext.jsx';
import { formatMonth } from '../utils/format.js';
import SummaryCards from '../components/SummaryCards.jsx';
import CategoryChart from '../components/CategoryChart.jsx';
import MonthlyTrendChart from '../components/MonthlyTrendChart.jsx';
import DailySpendingChart from '../components/DailySpendingChart.jsx';
import TransactionList from '../components/TransactionList.jsx';
import Spinner from '../components/Spinner.jsx';

export default function OverviewPage() {
  const { summary, trend, daily, month, transactions, deleteTransaction } = useFinance();
  const { openForm } = useOutletContext();

  // Show the six most recent transactions
  const recent = transactions.data ? transactions.data.slice(0, 6) : null;

  return (
    <div className="stack">
      {/* KPI Cards row */}
      <SummaryCards summary={summary.data} loading={summary.loading} />

      {/* Main bento grid */}
      <div className="overview-grid">
        {/* Daily Spending Timeline (New Feature) */}
        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Daily Activity Timeline</h2>
            {month && <p className="panel__hint">{formatMonth(month)}</p>}
          </div>
          <div className="panel__body">
            {daily.loading && !daily.data ? (
              <Spinner label="Loading timeline…" />
            ) : (
              <DailySpendingChart data={daily.data} month={month} />
            )}
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Spending by category</h2>
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

        {/* Recent Transactions ledger snippet */}
        <section className="panel">
          <div className="panel__head">
            <h2 className="panel__title">Recent activity</h2>
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

      {/* 6-Month Income vs Expense Trend */}
      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">Income vs Expenses — 6-month trend</h2>
          <p className="panel__hint">Last 6 months</p>
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
