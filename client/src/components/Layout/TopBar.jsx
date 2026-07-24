import { useLocation } from 'react-router-dom';

import { useFinance } from '../../context/FinanceContext.jsx';
import { formatMonth, recentMonths } from '../../utils/format.js';

const TITLES = {
  '/': 'Overview',
  '/transactions': 'Transactions',
  '/welcome': 'Welcome',
};

export default function TopBar({ onAdd }) {
  const { month, setMonth } = useFinance();
  const { pathname } = useLocation();
  const months = recentMonths(12);

  return (
    <header className="topbar">
      <div className="topbar__heading">
        <h1 className="topbar__title">{TITLES[pathname] ?? 'Overview'}</h1>
        <p className="topbar__subtitle">Personal finance dashboard</p>
      </div>

      <div className="topbar__actions">
        <label className="month-select">
          <span className="sr-only">Select month</span>
          <select
            className="input select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            aria-label="Select month"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {formatMonth(m)}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="btn btn--primary" onClick={onAdd}>
          <span aria-hidden="true">＋</span> Add transaction
        </button>
      </div>
    </header>
  );
}
