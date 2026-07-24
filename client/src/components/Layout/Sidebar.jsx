import { NavLink } from 'react-router-dom';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const OverviewIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

const LedgerIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
            <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="4" opacity="0.28" />
            <path
              d="M16 5a11 11 0 0 1 9.5 16.5"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="sidebar__wordmark">KashIT</span>
      </div>

      <nav className="sidebar__nav" aria-label="Primary">
        <NavLink to="/welcome" className="nav-link">
          <HomeIcon />
          <span>Home</span>
        </NavLink>
        <NavLink to="/" end className="nav-link">
          <OverviewIcon />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/transactions" className="nav-link">
          <LedgerIcon />
          <span>Transactions</span>
        </NavLink>
      </nav>
    </aside>
  );
}
