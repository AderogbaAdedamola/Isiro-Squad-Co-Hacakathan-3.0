import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Filter, ArrowDownRight, Tag, X, Image as ImageIcon, Sparkles, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const initialProducts = [
  { id: '1', name: 'Air Jordan 4 Black', price: 150000, floorPrice: 135000, qty: 12, status: 'In Stock', aliases: ['jords', 'jordan black', 'aj4'] },
  { id: '2', name: 'Nike Dunk Panda', price: 85000, floorPrice: 80000, qty: 4, status: 'Low Stock', aliases: ['panda', 'dunks', 'black white dunk'] },
  { id: '3', name: 'Yeezy Slide Bone', price: 65000, floorPrice: 60000, qty: 0, status: 'Out of Stock', aliases: ['yzy', 'slide', 'bone slide'] },
  { id: '4', name: 'Air Force 1 White', price: 55000, floorPrice: 50000, qty: 24, status: 'In Stock', aliases: ['af1', 'white force', 'air force'] },
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

const Inventory = () => {
  const [products, setProducts] = useState(initialProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Derived metrics
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.qty), 0);
  const lowStockCount = products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock').length;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Inventory Master</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage your catalog and teach the AI how to recognize them.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
            <Filter size={18} />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="app-card p-5 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-zinc-500 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">{products.length}</p>
        </div>
        <div className="app-card p-5 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-zinc-500 mb-1">Estimated Stock Value</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-white">₦{totalValue.toLocaleString()}</p>
        </div>
        <div className="app-card p-5 border-amber-500/20 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-amber-600 dark:text-amber-500 mb-1">Needs Attention</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{lowStockCount}</p>
            <span className="text-xs bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">Low Stock</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="app-card overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
           <div className="relative w-full max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
             <input 
               type="text" 
               placeholder="Search by name or AI alias..." 
               className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
             />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">AI Aliases</th>
                <th className="px-6 py-4">Pricing</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              className="divide-y divide-zinc-200 dark:divide-zinc-800"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {products.map((product) => (
                <motion.tr variants={itemVariants} key={product.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-zinc-400 shrink-0 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-white text-sm">{product.name}</div>
                        <div className="text-xs text-zinc-500 mt-0.5 font-mono">ID: {product.id.padStart(4, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                      {product.aliases.map((alias, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {alias}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-zinc-900 dark:text-white">₦{product.price.toLocaleString()}</div>
                    <div className="text-[11px] font-medium text-zinc-500 flex items-center gap-1 mt-1">
                      <ArrowDownRight size={12} className="text-red-400" /> Floor: ₦{product.floorPrice.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-zinc-900 dark:text-white w-8">{product.qty}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        product.status === 'In Stock' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        product.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="app-card w-full max-w-3xl p-0 overflow-hidden shadow-2xl relative my-8"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">New Product Entry</h2>
                <p className="text-xs text-zinc-500 mt-1">Add inventory and configure AI match parameters.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <form className="p-6 md:p-8" onSubmit={(e) => { e.preventDefault(); toast.success('Product AI Model Trained & Saved!'); setIsAddModalOpen(false); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                
                {/* Left Column: Details */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <Package size={16} className="text-zinc-400" />
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">Basic Info</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">Product Name <span className="text-red-500">*</span></label>
                    <input type="text" required className="app-input py-2.5 text-sm" placeholder="e.g. Nike Dunk Low" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">Selling Price (₦) <span className="text-red-500">*</span></label>
                      <input type="number" required className="app-input py-2.5 text-sm" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">Floor Price (₦)</label>
                      <input type="number" required className="app-input py-2.5 text-sm" placeholder="Lowest acceptable" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">Initial Stock</label>
                    <input type="number" required className="app-input py-2.5 text-sm" placeholder="0" />
                  </div>
                </div>

                {/* Right Column: AI Config */}
                <div className="space-y-5">
                   <div className="flex items-center gap-2 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <Sparkles size={16} className="text-emerald-500" />
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">AI Matching</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-zinc-700 dark:text-zinc-300">
                      Match Aliases
                    </label>
                    <p className="text-[11px] text-zinc-500 mb-3 leading-relaxed">
                      Enter slang, abbreviations, or variations buyers might use in their bank transfer narrations. Separate by commas.
                    </p>
                    <textarea 
                      className="app-input text-sm min-h-[120px] resize-none" 
                      placeholder="e.g. dunks, panda, black white shoe, nk dunk" 
                    />
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl p-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed pt-0.5">
                        Our NLP engine will automatically map payments containing these terms to this product, deducting stock instantly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-6 mt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Save Product
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
