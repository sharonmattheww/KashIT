// One place that knows how to talk to the REST API. Every request goes through
// here so error handling and JSON parsing are not repeated in each hook.

const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (res.status === 204) return null; // No Content (delete)

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Prefer the server's validation messages when it sent them.
    const message = data?.errors?.join(' ') || data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
};
