// Pure validation helpers. Kept free of Express and the database so they are
// trivial to unit test and can be reused by any route.

const TYPES = new Set(['income', 'expense']);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate and normalise a transaction payload from the client.
 * Returns `{ value, errors }`: `errors` is an array of human-readable strings
 * (empty when valid) and `value` is the cleaned data ready for the model.
 */
export function validateTransaction(body = {}) {
  const errors = [];
  const value = {};

  const description = typeof body.description === 'string' ? body.description.trim() : '';
  if (!description) {
    errors.push('Description is required.');
  } else if (description.length > 120) {
    errors.push('Description must be 120 characters or fewer.');
  }
  value.description = description;

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    errors.push('Amount must be a number greater than zero.');
  }
  value.amount = amount;

  if (!TYPES.has(body.type)) {
    errors.push("Type must be either 'income' or 'expense'.");
  }
  value.type = body.type;

  const categoryId = Number(body.categoryId);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    errors.push('A valid category is required.');
  }
  value.categoryId = categoryId;

  if (!DATE_RE.test(body.date) || Number.isNaN(Date.parse(body.date))) {
    errors.push('Date must be a real date in YYYY-MM-DD format.');
  }
  value.date = body.date;

  return { value, errors };
}

/** A month query param, when present, must look like 'YYYY-MM'. */
export function isValidMonth(month) {
  return /^\d{4}-\d{2}$/.test(month);
}
