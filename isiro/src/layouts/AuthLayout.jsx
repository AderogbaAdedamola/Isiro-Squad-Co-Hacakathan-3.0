import { Outlet, Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import logo from '../assets/isiro_logo_fav.png';

const AuthLayout = () => {
  const location = useLocation();
  const { currentOnboardingStep } = useAuthStore();
  const isRegisterPage = location.pathname === '/register';
  
  // Show back button on all auth pages EXCEPT when onboarding has moved past Step 1
  const showBackButton = !isRegisterPage || (isRegisterPage && currentOnboardingStep === 1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Top Header Controls */}
      <div className="fixed top-0 left-0 w-full flex items-center justify-between p-4 md:p-6 z-50">
        {showBackButton ? (
          <Link to="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all text-xs font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        ) : <div />}
        <ThemeToggle />
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-emerald-50 dark:from-emerald-950/20 to-transparent -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md app-card p-6 md:p-8">
        <div className="flex justify-center mb-6">
           <img src={logo} alt="Isiro Logo" className="w-12 h-12 object-contain" />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
