import { Bell, CheckCircle, Info, AlertCircle, Clock } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      title: 'Welcome to Isiro!',
      message: 'Your business account is ready. Start tracking your inventory and sales today.',
      time: '2 hours ago',
      type: 'success',
      icon: <CheckCircle className="text-emerald-500" size={20} />
    },
    {
      id: 2,
      title: 'WhatsApp Verification Pending',
      message: 'Please verify your WhatsApp number to receive real-time alerts.',
      time: '5 hours ago',
      type: 'warning',
      icon: <AlertCircle className="text-amber-500" size={20} />
    },
    {
      id: 3,
      title: 'New Feature: AI Ledger',
      message: 'Try our new AI-powered ledger for automatic transaction matching.',
      time: '1 day ago',
      type: 'info',
      icon: <Info className="text-blue-500" size={20} />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Notifications</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Stay updated with your business activities.</p>
        </div>
        <button className="text-sm font-medium text-emerald-600 dark:text-emerald-500 hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div key={n.id} className="app-card p-6 flex items-start gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
            <div className="mt-1">{n.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-zinc-900 dark:text-white">{n.title}</h3>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock size={12} /> {n.time}
                </span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
