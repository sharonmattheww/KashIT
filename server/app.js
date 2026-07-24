import express from 'express';
import cors from 'cors';

import transactionsRouter from './routes/transactions.js';
import categoriesRouter from './routes/categories.js';
import summaryRouter from './routes/summary.js';

// The Express app is built here and exported separately from the server that
// listens on a port, which keeps it importable for tests.
export function createApp() {
  const app = express();

  app.use(cors()); // dev frontend runs on a different port
  app.use(express.json());

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.use('/api/transactions', transactionsRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/summary', summaryRouter);

  // Unknown /api route -> clean 404 rather than an HTML error page.
  app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

  // Central error handler so a thrown error never crashes the process.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  });

  return app;
}
