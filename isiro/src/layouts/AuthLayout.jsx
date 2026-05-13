import { Outlet, Link } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import { ArrowLeft } from 'lucide-react';
import logo from '../assets/isiro_logo_fav.png';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Background Decor */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-emerald-50 dark:from-emerald-950/20 to-transparent -z-10 pointer-events-none"></div>

      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>
      <div className="absolute top-6 right-6 w-32 hidden md:block">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md app-card p-8">
        <div className="flex justify-center mb-8">
           <img src={logo} alt="Isiro Logo" className="w-14 h-14 object-contain" />
        </div>
        <Outlet />
      </div>
      
      <div className="mt-8 w-full max-w-md md:hidden">
         <ThemeToggle />
      </div>
    </div>
  );
};

export default AuthLayout;
