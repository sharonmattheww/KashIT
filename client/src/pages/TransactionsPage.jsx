import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useFinance } from '../context/FinanceContext.jsx';
import SearchFilterBar from '../components/SearchFilterBar.jsx';
import TransactionList from '../components/TransactionList.jsx';

export default function TransactionsPage() {
  const { transactions, deleteTransaction, setFilters } = useFinance();
  const { openForm } = useOutletContext();

  // Filters belong to this view; clear them on the way out so the Overview
  // always reflects the whole month.
  useEffect(() => () => setFilters({ category: '', search: '', type: '' }), [setFilters]);

  const list = transactions.data;

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel__head">
          <h2 className="panel__title">All transactions</h2>
          {list && (
            <p className="panel__hint">
              {list.length} {list.length === 1 ? 'entry' : 'entries'}
            </p>
          )}
        </div>

        <div className="panel__filters">
          <SearchFilterBar />
        </div>

        <div className="panel__body">
          <TransactionList
            transactions={list}
            loading={transactions.loading}
            error={transactions.error}
            onEdit={openForm}
            onDelete={deleteTransaction}
            onAdd={() => openForm()}
          />
        </div>
      </section>
    </div>
  );
}
