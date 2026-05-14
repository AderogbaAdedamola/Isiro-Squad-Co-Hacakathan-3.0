import { Routes, Route } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import DashboardOverview from '../pages/dashboard/DashboardOverview';
import Inventory from '../pages/inventory/Inventory';
import Transactions from '../pages/transactions/Transactions';
import Sales from '../pages/sales/Sales';
import VirtualAccounts from '../pages/accounts/VirtualAccounts';
import PendingQueue from '../pages/pending/PendingQueue';
import Notifications from '../pages/notifications/Notifications';
import Settings from '../pages/settings/Settings';
import Analytics from '../pages/analytics/Analytics';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="sales" element={<Sales />} />
        <Route path="accounts" element={<VirtualAccounts />} />
        <Route path="pending" element={<PendingQueue />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
