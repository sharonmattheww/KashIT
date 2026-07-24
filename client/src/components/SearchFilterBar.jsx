import { useEffect, useState } from 'react';

import { useFinance } from '../context/FinanceContext.jsx';

// Search + category + type filters. Each one just adds a query parameter to the
// same GET /api/transactions request — the filtering happens in SQL, not here.
export default function SearchFilterBar() {
  const { filters, setFilters, categories } = useFinance();
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce the search box so we send one request after typing stops, not one
  // per keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput.trim() }));
    }, 250);
    return () => clearTimeout(id);
  }, [searchInput, setFilters]);

  const categoryOptions = categories.data ?? [];
  const hasFilters = filters.search || filters.category || filters.type;

  function clearAll() {
    setSearchInput('');
    setFilters({ category: '', search: '', type: '' });
  }

  return (
    <div className="filterbar">
      <div className="filterbar__search">
        <span className="filterbar__search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          className="input"
          placeholder="Search descriptions…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search transactions by description"
        />
      </div>

      <select
        className="input select"
        value={filters.type}
        onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        aria-label="Filter by type"
      >
        <option value="">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        className="input select"
        value={filters.category}
        onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {categoryOptions.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button type="button" className="btn btn--ghost" onClick={clearAll}>
          Clear
        </button>
      )}
    </div>
  );
}
