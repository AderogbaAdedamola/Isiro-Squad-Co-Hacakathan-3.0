import { User, Shield, Bell, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Settings = () => {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const sections = [
    {
      title: 'Account Settings',
      items: [
        { name: 'Profile Information', icon: <User size={20} />, description: 'Update your name, email and phone number' },
        { name: 'Security', icon: <Shield size={20} />, description: 'Manage your password and security preferences' },
        { name: 'Notifications', icon: <Bell size={20} />, description: 'Choose how you want to be notified' },
      ]
    },
    {
      title: 'Business & Billing',
      items: [
        { name: 'Plan & Subscription', icon: <CreditCard size={20} />, description: 'Current plan: Free (Upgradable)' },
        { name: 'Business Details', icon: <User size={20} />, description: 'Edit your business name and category' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest px-1">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.name} className="app-card p-4 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 cursor-pointer group transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-zinc-300" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-3 rounded-xl transition-colors w-full"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default Settings;
