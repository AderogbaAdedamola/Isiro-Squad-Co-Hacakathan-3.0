import { useState } from 'react';
import { Search, Filter, Download, Receipt, ExternalLink, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import RecordSaleModal from './components/RecordSaleModal';

const initialSales = [
  { id: 'SL-1029', date: '2026-05-10', customer: 'Oluwaseun Adebayo', items: 'Nike Dunk Panda (x2)', total: 170000, status: 'Completed', paymentMethod: 'Transfer (GTBank)' },
  { id: 'SL-1028', date: '2026-05-09', customer: 'Amina Yusuf', items: 'Air Force 1 White (x1)', total: 55000, status: 'Completed', paymentMethod: 'Transfer (Kuda)' },
  { id: 'SL-1027', date: '2026-05-08', customer: 'John Doe', items: 'Air Jordan 4 Black (x1)', total: 150000, status: 'Completed', paymentMethod: 'Transfer (Opay)' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

const Sales = () => {
  const [sales, setSales] = useState(initialSales);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const handleRecordSale = (newSale) => {
    setSales([newSale, ...sales]);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Sales History</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">A finalized record of all successful transactions and receipts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export CSV
          </button>
          <button 
            onClick={() => setIsRecordModalOpen(true)}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Record Sale
          </button>
        </div>
      </div>

      <div className="app-card overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
           <div className="relative w-full max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
             <input 
               type="text" 
               placeholder="Search receipt ID or customer..." 
               className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
             />
           </div>
           <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-colors">
             <Filter size={18} />
           </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="px-6 py-4">Receipt ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items Purchased</th>
                <th className="px-6 py-4">Payment Info</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <motion.tbody 
              className="divide-y divide-zinc-200 dark:divide-zinc-800"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {sales.map((sale) => (
                <motion.tr variants={itemVariants} key={sale.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm font-medium text-zinc-900 dark:text-white">{sale.id}</div>
                    <div className="text-xs text-zinc-500 mt-1">{sale.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-300">{sale.customer}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                      <Receipt size={14} className="text-emerald-500" />
                      {sale.items}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-sm text-zinc-900 dark:text-zinc-300">{sale.paymentMethod}</div>
                     <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-1 uppercase">
                       {sale.status}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-900 dark:text-white">₦{sale.total.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Receipt <ExternalLink size={12} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>

      <RecordSaleModal 
        isOpen={isRecordModalOpen} 
        onClose={() => setIsRecordModalOpen(false)} 
        onRecordSale={handleRecordSale} 
      />
    </div>
  );
};

export default Sales;
