import { TrendingUp, Activity, BarChart3, ShieldCheck, ArrowUpRight, Zap, RefreshCw, Layers } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const creditHistory = [
  { month: 'Jan', score: 680 },
  { month: 'Feb', score: 695 },
  { month: 'Mar', score: 710 },
  { month: 'Apr', score: 730 },
  { month: 'May', score: 748 },
];

const Analytics = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Credit Identity</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Your business creditworthiness and financial health analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={18} />
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">Verified Merchant</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Credit Score Card */}
        <div className="lg:col-span-1 app-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={120} />
          </div>
          
          <div className="relative mb-6">
             <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-zinc-100 dark:text-zinc-900"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 * (1 - 748 / 900)}
                  className="text-emerald-500"
                />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-zinc-900 dark:text-white">748</span>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Score</span>
             </div>
          </div>

          <div className="space-y-2">
             <h3 className="text-xl font-bold text-emerald-500">Excellent</h3>
             <p className="text-sm text-zinc-500 max-w-[200px]">Your business is in the top 5% of merchants on Isiro.</p>
          </div>

          <button className="mt-8 w-full py-3 bg-zinc-900 dark:bg-zinc-800 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all">
            Improve Your Score
          </button>
        </div>

        {/* Score History Chart */}
        <div className="lg:col-span-2 app-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-lg font-bold">Growth Projection</h2>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">+68 pts this year</span>
          </div>

          <div className="flex-1 min-h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={creditHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                  <YAxis domain={[600, 800]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FactorCard 
          title="Sales Consistency" 
          status="Strong" 
          icon={<Zap size={20} className="text-amber-500" />} 
          score={92}
        />
        <FactorCard 
          title="Inventory Turnover" 
          status="Moderate" 
          icon={<RefreshCw size={20} className="text-blue-500" />} 
          score={65}
        />
        <FactorCard 
          title="Identity Verification" 
          status="Perfect" 
          icon={<ShieldCheck size={20} className="text-emerald-500" />} 
          score={100}
        />
        <FactorCard 
          title="Match Rate" 
          status="Optimal" 
          icon={<Layers size={20} className="text-cyan-500" />} 
          score={88}
        />
      </div>

      <div className="app-card p-8 bg-zinc-900 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Unlock Business Loans</h2>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            With your current credit score of <span className="text-emerald-400 font-bold">748</span>, you are eligible for capital injection up to <span className="text-white font-bold text-lg">₦2,500,000</span> to scale your inventory.
          </p>
          <button className="px-8 py-3 bg-white text-zinc-900 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
            Apply for Capital
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-full bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2"></div>
      </div>
    </div>
  );
};

const FactorCard = ({ title, status, icon, score }) => (
  <div className="app-card p-5 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-bold text-zinc-400">{score}%</span>
    </div>
    <div>
      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">{title}</h4>
      <p className="text-xs text-zinc-500 mt-1">Status: <span className={status === 'Strong' || status === 'Perfect' ? 'text-emerald-500' : 'text-amber-500'}>{status}</span></p>
    </div>
    <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${score}%` }}></div>
    </div>
  </div>
);

export default Analytics;
