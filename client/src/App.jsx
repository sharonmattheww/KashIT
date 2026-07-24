import { Routes, Route, Navigate } from 'react-router-dom';

import { FinanceProvider } from './context/FinanceContext.jsx';
import AppLayout from './components/Layout/AppLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';

export default function App() {
  return (
    <FinanceProvider>
      <Routes>
        {/* Landing Page */}
        <Route path="/welcome" element={<LandingPage />} />

        {/* Main Dashboard Shell */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/app" element={<OverviewPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/app/transactions" element={<TransactionsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </FinanceProvider>
  );
}
