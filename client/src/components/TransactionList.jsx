import { useState } from 'react';

import { formatCurrency, formatDate } from '../utils/format.js';
import Spinner from './Spinner.jsx';
import EmptyState from './EmptyState.jsx';

// Renders transactions as a ledger: colour accent per category, description and
// date on the left, the amount right-aligned in a monospaced figure so columns
// line up. Delete asks for confirmation inline rather than with a browser popup.
export default function TransactionList({ transactions, loading, error, onEdit, onDelete, onAdd }) {
  const [confirmingId, setConfirmingId] = useState(null);

  if (loading && !transactions) return <Spinner label="Loading transactions…" />;
  if (error) {
    return <EmptyState icon="!" title="Couldn’t load transactions" message={error} />;
  }
  if (!transactions?.length) {
    return (
      <EmptyState
        icon="+"
        title="No transactions to show"
        message="Nothing matches this month and these filters yet."
        action={
          onAdd && (
            <button type="button" className="btn btn--primary" onClick={onAdd}>
              Add a transaction
            </button>
          )
        }
      />
    );
  }

  return (
    <ul className="tx-list">
      {transactions.map((tx) => (
        <li className="tx-row" key={tx.id}>
          <span
            className="tx-row__accent"
            style={{ background: tx.categoryColor }}
            aria-hidden="true"
          />
          <div className="tx-row__main">
            <span className="tx-row__desc">{tx.description}</span>
            <span className="tx-row__sub">
              <span className="pill" style={{ '--pill-color': tx.categoryColor }}>
                {tx.category}
              </span>
              <span className="tx-row__date">{formatDate(tx.date)}</span>
            </span>
          </div>

          <span className={`tx-row__amount mono amount--${tx.type}`}>
            {tx.type === 'income' ? '+' : '−'}
            {formatCurrency(tx.amount)}
          </span>

          {confirmingId === tx.id ? (
            <div className="tx-row__actions tx-row__actions--confirm">
              <span className="tx-row__confirm-label">Delete?</span>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirmingId(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--danger btn--sm"
                onClick={() => {
                  onDelete(tx.id);
                  setConfirmingId(null);
                }}
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="tx-row__actions">
              <button
                type="button"
                className="btn btn--icon"
                onClick={() => onEdit(tx)}
                aria-label={`Edit ${tx.description}`}
              >
                ✎
              </button>
              <button
                type="button"
                className="btn btn--icon"
                onClick={() => setConfirmingId(tx.id)}
                aria-label={`Delete ${tx.description}`}
              >
                🗑
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
