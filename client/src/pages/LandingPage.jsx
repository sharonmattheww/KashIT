import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Landing Navigation Header */}
      <header className="landing-nav">
        <div className="landing-nav__brand">
          <span className="landing-nav__mark">
            <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
              <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="3.5" opacity="0.3" />
              <path
                d="M16 5a11 11 0 0 1 9.5 16.5"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="landing-nav__wordmark">KashIT</span>
        </div>
        <div className="landing-nav__actions">
          <Link to="/app" className="btn btn--primary">
            Launch Dashboard →
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="landing-content">
        <section className="landing-hero">
          <h1 className="landing-hero__title">
            Take Complete Control of Your Personal Finances
          </h1>
          <p className="landing-hero__subtitle">
            Track daily spending velocity, analyze category breakdowns, and monitor historical 
            income vs. expense trends in a high-performance executive dashboard.
          </p>

          <div className="landing-hero__cta">
            <Link to="/app" className="btn btn--primary btn--lg">
              Launch Dashboard →
            </Link>
            <Link to="/app/transactions" className="btn btn--ghost btn--lg">
              View Transactions Ledger
            </Link>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="landing-features" aria-label="Key features">
          <div className="feature-card">
            <div className="feature-card__icon">⚡</div>
            <h3 className="feature-card__title">Spending Velocity</h3>
            <p className="feature-card__desc">
              Visualize daily and weekly spending momentum with smooth monotone bezier curves 
              and gradient flow indicators.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon">🍩</div>
            <h3 className="feature-card__title">Category Intelligence</h3>
            <p className="feature-card__desc">
              Toggle between interactive Donut and Horizontal Bar views to audit category 
              expense allocations instantly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon">📈</div>
            <h3 className="feature-card__title">Historical Trends</h3>
            <p className="feature-card__desc">
              Compare 6-month historical income versus expense growth powered by SQLite 
              database aggregations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-card__icon">💳</div>
            <h3 className="feature-card__title">Full Ledger Control</h3>
            <p className="feature-card__desc">
              Manage transactions with instantaneous search, multi-criteria category filtering, 
              and inline updates.
            </p>
          </div>
        </section>

        {/* Stat Highlights Bar */}
        <section className="landing-stats" aria-label="Platform highlights">
          <div className="landing-stat">
            <span className="landing-stat__val">100%</span>
            <span className="landing-stat__label">Privacy & Local Database</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat__val">&lt;20ms</span>
            <span className="landing-stat__label">SQLite Aggregation</span>
          </div>
          <div className="landing-stat">
            <span className="landing-stat__val">6+</span>
            <span className="landing-stat__label">Analytical Views</span>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>KashIT — Executive Personal Finance Dashboard</p>
      </footer>
    </div>
  );
}
