import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Package, RefreshCw, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

const revenueData = [
  { name: 'Mon', total: 45000 },
  { name: 'Tue', total: 52000 },
  { name: 'Wed', total: 38000 },
  { name: 'Thu', total: 65000 },
  { name: 'Fri', total: 48000 },
  { name: 'Sat', total: 85000 },
  { name: 'Sun', total: 92000 },
];

const topProducts = [
  { name: 'Air Jordan 4', sales: 120 },
  { name: 'Nike Dunk Low', sales: 98 },
  { name: 'Yeezy Slide', sales: 86 },
  { name: 'Air Force 1', sales: 75 },
];

const recentTransactions = [
  { id: '1', amount: 8500, product: 'Air Jordan Black', status: 'Auto Approved', time: '2 mins ago', match: '98%' },
  { id: '2', amount: 12000, product: 'Nike Dunk Panda', status: 'Pending Review', time: '15 mins ago', match: '45%' },
  { id: '3', amount: 5500, product: 'Yeezy Slide Bone', status: 'Auto Approved', time: '1 hour ago', match: '92%' },
];

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm">
            <RefreshCw size={16} /> Sync Bank
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Total Revenue" value={425000} prefix="₦" trend="+12.5%" isPositive={true} icon={<TrendingUp size={20} className="text-emerald-500" />} />
        <KpiCard title="Transactions" value={1248} trend="+5.2%" isPositive={true} icon={<RefreshCw size={20} className="text-blue-500" />} />
        <KpiCard title="AI Match Rate" value={92} suffix="%" trend="+2.1%" isPositive={true} icon={<Zap size={20} className="text-cyan-500" />} />
        <KpiCard title="Low Stock Items" value={4} trend="-1" isPositive={false} icon={<AlertTriangle size={20} className="text-amber-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 app-card p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <select className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(value) => `₦${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                  formatter={(value) => [`₦${value.toLocaleString()}`, 'Revenue']}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="app-card p-6 flex flex-col h-[400px]">
          <h2 className="text-lg font-semibold mb-6">Top Selling Products</h2>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} width={90} />
                <Tooltip 
                  cursor={{ fill: 'rgba(6, 182, 212, 0.1)' }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="sales" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Transactions Feed */}
      <div className="app-card overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Live Transactions</h2>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <button className="text-sm text-emerald-600 dark:text-emerald-500 font-medium hover:underline">View All</button>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Package size={20} />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">₦{tx.amount.toLocaleString()}</p>
                  <p className="text-sm text-zinc-500">{tx.product}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-8 justify-between sm:justify-end w-full sm:w-auto">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    {tx.status === 'Auto Approved' ? (
                       <span className="text-emerald-500 flex items-center gap-1.5"><Zap size={14}/> {tx.status}</span>
                    ) : (
                       <span className="text-amber-500 flex items-center gap-1.5"><AlertTriangle size={14}/> {tx.status}</span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">Confidence: {tx.match}</p>
                </div>
                <span className="text-xs text-zinc-400 min-w-[70px] text-right">{tx.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable KPI Card Component
const KpiCard = ({ title, value, prefix = "", suffix = "", trend, isPositive, icon }) => {
  return (
    <div className="app-card p-5 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {prefix}
          {Number(value).toLocaleString(undefined, { minimumFractionDigits: title.includes('Rate') ? 1 : 0, maximumFractionDigits: title.includes('Rate') ? 1 : 0 })}
          {suffix}
        </h3>
      </div>
    </div>
  );
};

export default DashboardOverview;
