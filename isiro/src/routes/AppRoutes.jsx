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

// Placeholders for remaining Dashboard Pages
const Analytics = () => <div className=""><h1 className="text-3xl font-bold dark:text-white">Business Analytics</h1><p className="mt-4 text-zinc-500">Financial insights and credit identity.</p></div>;

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
      </Route>
    </Routes>
  );
};

export default AppRoutes;
