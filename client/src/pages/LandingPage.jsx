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
      </main>
    </div>
  );
}
