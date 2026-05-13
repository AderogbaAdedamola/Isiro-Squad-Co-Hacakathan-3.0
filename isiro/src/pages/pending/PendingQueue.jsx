import { useState } from 'react';
import { AlertTriangle, Check, X, Search, ChevronDown, MessageSquareText, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const initialPending = [
  { 
    id: 'TRX-8922', 
    sender: 'Chinedu Eze', 
    bank: 'Opay',
    narration: 'Jordans',
    amount: 140000,
    time: '2 hours ago',
    matchConfidence: 45,
    suggestion: 'Air Jordan 4 Black',
    issue: 'Underpaid (Price is ₦150,000)'
  },
  { 
    id: 'TRX-8915', 
    sender: 'Sarah Johnson', 
    bank: 'Access Bank',
    narration: 'sneakers payment',
    amount: 85000,
    time: '5 hours ago',
    matchConfidence: 20,
    suggestion: 'Nike Dunk Panda',
    issue: 'Vague narration. Multiple items match price.'
  }
];

const PendingQueue = () => {
  const [pendingItems, setPendingItems] = useState(initialPending);

  const handleResolve = (id, action) => {
    if (action === 'approve') {
      toast.success('Transaction resolved and inventory updated!');
    } else {
      toast.error('Transaction marked as rejected/unmatched.');
    }
    setPendingItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            Pending Queue
            <span className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-500 text-xs px-2 py-0.5 rounded-full font-bold">
              {pendingItems.length}
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Review transactions where the AI needed human verification.</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
           <input 
             type="text" 
             placeholder="Search pending..." 
             className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
           />
        </div>
      </div>

      {pendingItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="app-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]"
        >
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-4">
            <Check size={32} />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">You're all caught up!</h3>
          <p className="text-zinc-500">The AI successfully matched all recent transactions.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {pendingItems.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="app-card overflow-hidden border-amber-200 dark:border-amber-900/50"
              >
                <div className="p-4 sm:p-6 flex flex-col xl:flex-row gap-6">
                  
                  {/* Left: Transaction Info */}
                  <div className="xl:w-1/3 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                        <MessageSquareText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{item.sender}</p>
                        <p className="text-xs text-zinc-500">{item.bank} • {item.id}</p>
                      </div>
                    </div>
                    
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Narration</p>
                      <p className="text-sm font-medium italic text-zinc-900 dark:text-white">"{item.narration}"</p>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs text-zinc-500">Amount Received</span>
                      <span className="text-lg font-bold text-zinc-900 dark:text-white">₦{item.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Middle: AI Analysis */}
                  <div className="xl:w-1/3 flex flex-col justify-center px-4 xl:px-8 xl:border-x border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={18} className="text-amber-500" />
                      <h3 className="font-bold text-zinc-900 dark:text-white">AI Analysis</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Identified Issue</p>
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg inline-block">
                          {item.issue}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">AI Suggestion ({item.matchConfidence}% Match)</p>
                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-3 py-2 rounded-lg">
                          <Check size={14} className="text-emerald-500" />
                          <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{item.suggestion}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Resolution Actions */}
                  <div className="xl:w-1/3 flex flex-col justify-center">
                    <p className="text-sm font-semibold mb-4 text-zinc-900 dark:text-white">Resolution Actions</p>
                    <div className="space-y-3">
                      <button 
                        onClick={() => handleResolve(item.id, 'approve')}
                        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors"
                      >
                        <span className="flex items-center gap-2"><Check size={16} /> Approve Suggestion</span>
                        <ArrowRight size={16} className="opacity-50" />
                      </button>
                      
                      <button className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl text-sm font-medium transition-colors">
                        <span className="flex items-center gap-2"><Search size={16} className="text-zinc-400" /> Manual Assign</span>
                        <ChevronDown size={16} className="opacity-50" />
                      </button>

                      <button 
                        onClick={() => handleResolve(item.id, 'reject')}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors"
                      >
                        <X size={16} /> Reject & Mark Unmatched
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default PendingQueue;
