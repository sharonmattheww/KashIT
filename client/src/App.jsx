import { Routes, Route } from 'react-router-dom';

import { FinanceProvider } from './context/FinanceContext.jsx';
import AppLayout from './components/Layout/AppLayout.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';

export default function App() {
  return (
    <FinanceProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="*" element={<OverviewPage />} />
        </Route>
      </Routes>
    </FinanceProvider>
  );
}
