import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ui/ThemeToggle';
import { LayoutDashboard, Package, ListRestart, BellRing, PieChart, Activity, Menu, X, Receipt, Wallet } from 'lucide-react';

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, exact: true },
    { name: 'Inventory', path: '/dashboard/inventory', icon: <Package size={20} /> },
    { name: 'Live Ledger', path: '/dashboard/transactions', icon: <ListRestart size={20} /> },
    { name: 'Sales History', path: '/dashboard/sales', icon: <Receipt size={20} /> },
    { name: 'Virtual Accounts', path: '/dashboard/accounts', icon: <Wallet size={20} /> },
    { name: 'Pending Queue', path: '/dashboard/pending', icon: <BellRing size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 app-sidebar p-4 flex flex-col gap-6 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-sm">i</div>
            <span className="text-2xl font-bold tracking-tight">Isiro</span>
          </div>
          <button className="md:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-1 flex-grow mt-4">
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-4">Menu</p>
          {navItems.map((item) => {
            const active = item.exact ? location.pathname === item.path : isActive(item.path);
            return (
              <Link 
                key={item.path}
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${active ? 'bg-white dark:bg-zinc-900 shadow-sm text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-800' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100 border border-transparent'}`}
              >
                <div className={`${active ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <ThemeToggle />
          
          {/* User Profile Snippet */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              DT
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">Demo Trader</p>
              <p className="text-xs text-zinc-500 truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 md:px-8 justify-between shrink-0 z-10 transition-colors">
           <div className="flex items-center gap-4">
             <button 
               className="md:hidden text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
               onClick={() => setIsMobileMenuOpen(true)}
             >
               <Menu size={24} />
             </button>
             <h2 className="text-lg font-semibold flex items-center gap-2">
               <Activity size={20} className="text-emerald-500 hidden sm:block" />
               <span className="hidden sm:inline">System Activity</span>
             </h2>
           </div>

           <div className="flex items-center gap-4">
             {/* Search/Quick Action Placeholder */}
             <div className="hidden md:flex items-center px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
               <span className="mr-2 text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1.5 py-0.5">⌘</span>
               <span className="mr-2 text-xs border border-zinc-300 dark:border-zinc-700 rounded px-1.5 py-0.5">K</span>
               Search
             </div>

             {/* Notification Bell */}
             <div className="relative w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
               <BellRing size={20} />
               <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-950"></div>
             </div>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
