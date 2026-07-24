// Thin, named wrappers around the REST endpoints. Components and hooks call
// these instead of building URLs themselves.

import { api } from './client.js';

function toQuery(params) {
  const clean = Object.entries(params).filter(([, v]) => v !== '' && v != null);
  const search = new URLSearchParams(clean).toString();
  return search ? `?${search}` : '';
}

export const transactionsApi = {
  list: (filters = {}) => api.get(`/transactions${toQuery(filters)}`),
  create: (payload) => api.post('/transactions', payload),
  update: (id, payload) => api.put(`/transactions/${id}`, payload),
  remove: (id) => api.del(`/transactions/${id}`),
};

export const categoriesApi = {
  list: () => api.get('/categories'),
};

export const summaryApi = {
  get: (month) => api.get(`/summary${toQuery({ month })}`),
  getTrend: (months = 6) => api.get(`/summary/trend${toQuery({ months })}`),
  getDaily: (month) => api.get(`/summary/daily${toQuery({ month })}`),
};
