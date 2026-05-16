import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute — guards dashboard routes.
 * 
 * - While Zustand is still rehydrating from localStorage, shows a loading spinner
 *   (prevents a flash-redirect to /login on hard refresh).
 * - Once hydrated, redirects unauthenticated users to /login.
 * - Passes through for authenticated users.
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const location = useLocation();

  // Still loading persisted auth state — show a full-page loader
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-zinc-950 transition-colors">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400 animate-pulse">
            Loading your session…
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect to login, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
