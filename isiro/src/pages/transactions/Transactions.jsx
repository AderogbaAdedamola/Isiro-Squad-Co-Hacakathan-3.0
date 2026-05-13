import { useState } from 'react';
import { ArrowDownLeft, Search, AlertTriangle, CheckCircle2, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialTransactions = [
  { 
    id: 'TRX-8923', 
    sender: 'Oluwaseun Adebayo', 
    bank: 'GTBank',
    narration: 'Payment for 2 panda dunks size 42',
    amount: 170000,
    time: 'Just now',
    status: 'Auto-Matched',
    matchConfidence: 98,
    matchedProduct: 'Nike Dunk Panda (x2)'
  },
  { 
    id: 'TRX-8922', 
    sender: 'Chinedu Eze', 
    bank: 'Opay',
    narration: 'Jordans',
    amount: 140000,
    time: '5 mins ago',
    status: 'Pending Review',
    matchConfidence: 45,
    matchedProduct: 'Air Jordan 4 Black (Underpaid)'
  },
  { 
    id: 'TRX-8921', 
    sender: 'Amina Yusuf', 
    bank: 'Kuda Bank',
    narration: 'white force 1',
    amount: 55000,
    time: '12 mins ago',
    status: 'Auto-Matched',
    matchConfidence: 95,
    matchedProduct: 'Air Force 1 White (x1)'
  },
  { 
    id: 'TRX-8920', 
    sender: 'Ibrahim Musa', 
    bank: 'Zenith Bank',
    narration: 'balance for shoes',
    amount: 25000,
    time: '1 hour ago',
    status: 'Unmatched',
    matchConfidence: 12,
    matchedProduct: null
  },
];

const Transactions = () => {
  const [transactions] = useState(initialTransactions);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Live Ledger</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Real-time bank transfers and AI narration matching.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Webhook Active</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative w-full sm:w-80">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
           <input 
             type="text" 
             placeholder="Search narration, sender, or ID..." 
             className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
           />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <button className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg text-sm font-medium shrink-0 shadow-sm">All</button>
          <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium shrink-0 transition-colors">Auto-Matched</button>
          <button className="px-4 py-2 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-500/20 rounded-lg text-sm font-medium shrink-0 flex items-center gap-1.5 transition-colors"><AlertTriangle size={14}/> Needs Review</button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        <AnimatePresence>
          {transactions.map((trx, index) => (
            <motion.div 
              key={trx.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="app-card p-0 overflow-hidden hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 justify-between lg:items-center">
                
                {/* Left: Sender Info */}
                <div className="flex items-start gap-4 lg:w-1/3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
                    <ArrowDownLeft size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">₦{trx.amount.toLocaleString()}</h3>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{trx.sender}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{trx.bank} • {trx.time}</p>
                  </div>
                </div>

                {/* Middle: Narration */}
                <div className="lg:w-1/3 bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/60 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-zinc-200 dark:bg-zinc-700 rounded-l-xl"></div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">Bank Narration</p>
                  <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium italic">"{trx.narration}"</p>
                  <p className="text-[10px] text-zinc-400 mt-2 font-mono">{trx.id}</p>
                </div>

                {/* Right: AI Match Result */}
                <div className="lg:w-1/3 flex flex-col lg:items-end">
                   {trx.status === 'Auto-Matched' && (
                     <div className="flex flex-col lg:items-end">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                         <Zap size={14} /> Auto-Matched ({trx.matchConfidence}%)
                       </span>
                       <p className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                         <CheckCircle2 size={16} className="text-emerald-500" />
                         {trx.matchedProduct}
                       </p>
                     </div>
                   )}
                   {trx.status === 'Pending Review' && (
                     <div className="flex flex-col lg:items-end">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-2">
                         <AlertTriangle size={14} /> Needs Review ({trx.matchConfidence}%)
                       </span>
                       <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                         {trx.matchedProduct}
                       </p>
                     </div>
                   )}
                   {trx.status === 'Unmatched' && (
                     <div className="flex flex-col lg:items-end">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 mb-2">
                         <Clock size={14} /> Unmatched
                       </span>
                       <p className="text-sm font-medium text-zinc-500">
                         No AI correlation found
                       </p>
                     </div>
                   )}
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Transactions;
