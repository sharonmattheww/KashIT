# Personal Finance Dashboard

A responsive web app for tracking personal income and expenses. Add transactions,
filter and search them, see a monthly summary at a glance, and visualise spending
by category — all backed by a small REST API and a local SQLite database.

## Features

- **Full CRUD** for transactions (add, edit, delete) with client- and server-side validation.
- **Categories** with their own colours, kept in sync between the chart, the breakdown list, and the ledger.
- **Monthly summary cards** — income, expenses, net balance, and top spending category — computed in SQL.
- **Spending-by-category donut chart** plus a ranked breakdown with per-category share.
- **Search and filtering** by description, category, and type, all handled as query parameters on one endpoint.
- **Month switcher** that drives every view from a single source of truth.
- **Responsive layout** — a sidebar on desktop that becomes a bottom navigation bar on mobile; cards and panels reflow rather than shrink.
- **Accessibility touches** — semantic controls, labelled icon buttons, visible keyboard focus, a focus-trapping modal, and respected `prefers-reduced-motion`.
- **Tests** on both sides — API/model logic and pure UI helpers.

## Tech stack

| Layer     | Choice                                              |
| --------- | --------------------------------------------------- |
| Frontend  | React 18 (Vite), React Router, Recharts, plain CSS  |
| Backend   | Node.js + Express                                   |
| Database  | SQLite via `better-sqlite3`                         |
| Tests     | Node's built-in test runner (API), Vitest + Testing Library (UI) |

## Architecture

```
  Browser (React)  ──HTTP/REST──►  Express API  ──SQL──►  SQLite (finance.db)
  UI, chart, forms                 routes → controllers      transactions
  filters, month switch            → models (queries)        categories
```

The frontend only displays and collects data; the backend owns validation, querying,
and aggregation. In development the Vite dev server proxies `/api` to Express, so the
frontend uses relative URLs and there is no CORS setup to worry about.

## Why SQLite?

The data is naturally relational — a transaction has an amount, a type, a date, and
belongs to exactly one category — and the summary view leans on SQL's `GROUP BY` / `SUM`
to total spending per category. SQLite gives full SQL power with **zero setup**: it is a
single file, not a server anyone has to install and run. The database layer takes the
connection as a parameter, so moving to PostgreSQL later would mainly be a connection
change rather than a query rewrite.

## Getting started

**Prerequisites:** Node.js 20 or newer.

The backend and frontend are separate apps and each needs its dependencies installed.
Run them in two terminals.

### 1. Backend (API)

```bash
cd server
npm install
npm run seed     # creates and populates db/finance.db with sample data
npm run dev      # starts the API on http://localhost:5000
```

### 2. Frontend (React app)

```bash
cd client
npm install
npm run dev      # starts Vite on http://localhost:5173
```

Open **http://localhost:5173**. The dev server proxies API calls to the backend, so both
need to be running.

## REST API

Base URL: `http://localhost:5000/api`

| Method | Endpoint             | Description                                                        |
| ------ | -------------------- | ----------------------------------------------------------------- |
| GET    | `/transactions`      | List transactions. Optional query: `month`, `category`, `search`, `type`. |
| POST   | `/transactions`      | Create a transaction.                                             |
| PUT    | `/transactions/:id`  | Update a transaction.                                             |
| DELETE | `/transactions/:id`  | Delete a transaction.                                             |
| GET    | `/categories`        | List categories.                                                 |
| GET    | `/summary?month=YYYY-MM` | Monthly totals + per-category spending breakdown.            |

Example:

```bash
curl "http://localhost:5000/api/transactions?month=2026-07&category=Groceries&search=weekly"
```

Transaction payload (POST / PUT):

```json
{
  "description": "Weekly groceries",
  "amount": 82.40,
  "type": "expense",
  "categoryId": 4,
  "date": "2026-07-03"
}
```

## Database schema

Two tables. A transaction references a category by id rather than repeating the name on
every row (normalisation), so a category can be renamed or recoloured in one place.

```sql
categories(id, name, color)
transactions(id, description, amount, type, category_id → categories.id, date, created_at)
```

- `amount` is always stored **positive**; `type` (`income` | `expense`) carries the direction.
- `date` is stored as a `YYYY-MM-DD` string, which sorts and month-filters cleanly.
- `date` and `category_id` are indexed — those are the columns the month view and the
  summary group on.

## Project structure

```
personal-finance-dashboard/
├── server/                     # Express + SQLite REST API
│   ├── db/                     # schema.sql, connection, seed script (finance.db is generated)
│   ├── models/                 # SQL queries (transactions, categories, summary)
│   ├── controllers/            # request handling + validation wiring
│   ├── routes/                 # endpoint definitions
│   ├── lib/                    # pure validation helpers
│   ├── tests/                  # API/model tests (in-memory database)
│   ├── app.js                  # builds the Express app
│   └── server.js               # starts it
└── client/                     # React (Vite) frontend
    └── src/
        ├── api/                # one place that talks to the REST API
        ├── components/         # SummaryCards, CategoryChart, TransactionList/Form, Layout, ...
        ├── context/            # shared month + filters + data
        ├── hooks/              # generic data-fetching hook
        ├── pages/              # Overview, Transactions
        ├── utils/              # currency/date formatting
        └── styles/             # design system
```

## Testing

```bash
cd server && npm test      # API + model + validation tests (Node's built-in runner)
cd client && npm test      # formatting utils + component render tests (Vitest)
```

The API tests run against an **in-memory** SQLite database seeded with a small, known
dataset, so they never touch `finance.db` and assert against numbers computed by hand.

## Assumptions

- A transaction belongs to exactly one category.
- Amounts are stored positive; income vs. expense is the `type` column.
- Dates are handled as `YYYY-MM-DD` strings and filtered by month prefix.
- Single user, no authentication — a local dashboard, per the assessment scope.

## Possible next steps

- Pagination on the transactions endpoint for very large histories.
- User-managed categories (add / rename / recolour) from the UI.
- Month-over-month comparison and simple budgets per category.
