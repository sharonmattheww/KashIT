import { useState } from 'react';

import { useFinance } from '../context/FinanceContext.jsx';

const today = () => new Date().toISOString().slice(0, 10);

// One form for both "Add" and "Edit": when `initial` is passed it pre-fills the
// fields and saves with PUT, otherwise it starts blank and saves with POST.
export default function TransactionForm({ initial, onClose }) {
  const { categories, addTransaction, updateTransaction } = useFinance();
  const isEditing = Boolean(initial);

  const [form, setForm] = useState({
    description: initial?.description ?? '',
    amount: initial?.amount ?? '',
    type: initial?.type ?? 'expense',
    categoryId: initial?.categoryId ?? '',
    date: initial?.date ?? today(),
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function clientError() {
    if (!form.description.trim()) return 'Please add a description.';
    if (!(Number(form.amount) > 0)) return 'Amount must be greater than zero.';
    if (!form.categoryId) return 'Please choose a category.';
    if (!form.date) return 'Please choose a date.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const message = clientError();
    if (message) {
      setError(message);
      return;
    }

    const payload = {
      description: form.description.trim(),
      amount: Number(form.amount),
      type: form.type,
      categoryId: Number(form.categoryId),
      date: form.date,
    };

    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        await updateTransaction(initial.id, payload);
      } else {
        await addTransaction(payload);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Could not save the transaction.');
    } finally {
      setSaving(false);
    }
  }

  const categoryOptions = categories.data ?? [];

  return (
    <form className="tx-form" onSubmit={handleSubmit} noValidate>
      <div className="segmented" role="group" aria-label="Transaction type">
        {['expense', 'income'].map((type) => (
          <button
            type="button"
            key={type}
            className={`segmented__option ${form.type === type ? 'is-active' : ''}`}
            aria-pressed={form.type === type}
            onClick={() => setForm((f) => ({ ...f, type }))}
          >
            {type === 'expense' ? 'Expense' : 'Income'}
          </button>
        ))}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="amount">
          Amount
        </label>
        <div className="field__money">
          <span className="field__prefix" aria-hidden="true">
            ₹
          </span>
          <input
            id="amount"
            className="input mono"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={update('amount')}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="description">
          Description
        </label>
        <input
          id="description"
          className="input"
          type="text"
          maxLength={120}
          placeholder="e.g. Weekly groceries"
          value={form.description}
          onChange={update('description')}
          required
        />
      </div>

      <div className="form-row">
        <div className="field">
          <label className="field__label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="input select"
            value={form.categoryId}
            onChange={update('categoryId')}
            required
          >
            <option value="" disabled>
              Choose…
            </option>
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            className="input"
            type="date"
            value={form.date}
            onChange={update('date')}
            required
          />
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="tx-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Add transaction'}
        </button>
      </div>
    </form>
  );
}
