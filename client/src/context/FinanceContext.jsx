import { createContext, useContext, useMemo, useState } from 'react';

import { useFetch } from '../hooks/useFetch.js';
import { transactionsApi, categoriesApi, summaryApi } from '../api/transactionsApi.js';
import { currentMonth } from '../utils/format.js';

const FinanceContext = createContext(null);

/**
 * Holds the state shared by both views: the selected month, the active filters,
 * and the three data resources (categories, summary, transactions). Any change
 * to a transaction bumps `version`, which refetches the summary and the list
 * together so the numbers, chart and table never disagree.
 */
export function FinanceProvider({ children }) {
  const [month, setMonth] = useState(currentMonth());
  const [filters, setFilters] = useState({ category: '', search: '', type: '' });
  const [version, setVersion] = useState(0);

  const refresh = () => setVersion((v) => v + 1);

  const categories = useFetch(() => categoriesApi.list(), []);
  const summary = useFetch(() => summaryApi.get(month), [month, version]);
  const trend = useFetch(() => summaryApi.getTrend(6), [version]);
  const transactions = useFetch(
    () => transactionsApi.list({ month, ...filters }),
    [month, filters.category, filters.search, filters.type, version],
  );

  async function addTransaction(payload) {
    const created = await transactionsApi.create(payload);
    refresh();
    return created;
  }

  async function updateTransaction(id, payload) {
    const updated = await transactionsApi.update(id, payload);
    refresh();
    return updated;
  }

  async function deleteTransaction(id) {
    await transactionsApi.remove(id);
    refresh();
  }

  const value = useMemo(
    () => ({
      month,
      setMonth,
      filters,
      setFilters,
      categories,
      summary,
      trend,
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [month, filters, categories, summary, trend, transactions],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used inside a FinanceProvider');
  return ctx;
}
