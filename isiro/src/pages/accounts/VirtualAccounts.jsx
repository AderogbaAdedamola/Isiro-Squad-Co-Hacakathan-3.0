import { useState } from 'react';
import { Plus, Copy, Check, Building2, MoreHorizontal, ArrowUpRight, Lock, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { deleteVirtualAccount } from '../../api/accountApi';

import CreateAccountModal from './components/CreateAccountModal';
import WithdrawModal from './components/WithdrawModal';
import SetPinModal from './components/SetPinModal';
import UpdateAccountModal from './components/UpdateAccountModal';

const initialAccounts = [
  { id: 'VA-001', name: 'Main Storefront', bank: 'Wema Bank', accountNumber: '0123456789', balance: 425000, status: 'Active' },
  { id: 'VA-002', name: 'Instagram Sales', bank: 'GTBank', accountNumber: '0987654321', balance: 140000, status: 'Active' },
];

const VirtualAccounts = () => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [copiedId, setCopiedId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedWithdrawAccount, setSelectedWithdrawAccount] = useState(null);
  const [selectedPinAccount, setSelectedPinAccount] = useState(null);
  const [selectedEditAccount, setSelectedEditAccount] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this virtual account?")) {
      try {
        await deleteVirtualAccount(id);
        setAccounts(accounts.filter(acc => acc.id !== id));
        toast.success("Account deleted successfully");
      } catch (error) {
        console.error('Delete Account Error:', error.response?.data || error.message);
        toast.error(error.response?.data?.message || 'Failed to delete account.');
      }
    }
  };

  const handleUpdateAccount = (updatedAccount) => {
    setAccounts(accounts.map(acc => acc.id === updatedAccount.id ? updatedAccount : acc));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Account number copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Virtual Accounts</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage your dedicated bank accounts for receiving payments.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2 max-w-max"
        >
          <Plus size={16} /> Create Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {accounts.map((account, index) => (
          <motion.div 
            key={account.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="app-card p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors flex flex-col"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
               <button 
                 onClick={() => setOpenDropdownId(openDropdownId === account.id ? null : account.id)}
                 className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
               >
                 <MoreHorizontal size={18} />
               </button>
               {openDropdownId === account.id && (
                 <div className="absolute right-4 top-12 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-1 z-20">
                   <button 
                     onClick={() => {
                       setSelectedEditAccount(account);
                       setOpenDropdownId(null);
                     }}
                     className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                   >
                     <Edit2 size={14} /> Edit Account
                   </button>
                   <button 
                     onClick={() => {
                       handleDelete(account.id);
                       setOpenDropdownId(null);
                     }}
                     className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                   >
                     <Trash2 size={14} /> Delete Account
                   </button>
                 </div>
               )}
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white">{account.name}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-1">
                  {account.status}
                </span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800/60 relative">
                <p className="text-xs text-zinc-500 mb-1">{account.bank}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-mono font-bold text-zinc-900 dark:text-white tracking-widest">{account.accountNumber}</p>
                  <button 
                    onClick={() => handleCopy(account.accountNumber, account.id)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    {copiedId === account.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-end justify-between px-1 pt-2">
                <div>
                  <p className="text-xs text-zinc-500 mb-1 font-medium">Available Balance</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">₦{account.balance.toLocaleString()}</p>
                </div>
                <button className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 mb-1">
                  History <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/60">
              <button 
                onClick={() => setSelectedWithdrawAccount(account)}
                className="flex-1 py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowUpRight size={16} /> Withdraw
              </button>
              <button 
                onClick={() => setSelectedPinAccount(account)}
                className="flex-1 py-2.5 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock size={16} /> Set PIN
              </button>
            </div>
          </motion.div>
        ))}

        {/* Create New Account Card */}
        <motion.div 
          onClick={() => setIsCreateModalOpen(true)}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: accounts.length * 0.1 }}
          className="app-card p-6 flex flex-col items-center justify-center text-center border-dashed border-2 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 cursor-pointer transition-all min-h-[320px]"
        >
          <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4 transition-colors group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50">
            <Plus size={28} />
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Create New Account</h3>
          <p className="text-sm text-zinc-500 max-w-[220px]">Generate a dedicated virtual account number for a new sales channel.</p>
        </motion.div>
      </div>

      {/* Modals */}
      <CreateAccountModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      <WithdrawModal 
        isOpen={!!selectedWithdrawAccount} 
        onClose={() => setSelectedWithdrawAccount(null)} 
        account={selectedWithdrawAccount} 
      />
      <SetPinModal 
        isOpen={!!selectedPinAccount} 
        onClose={() => setSelectedPinAccount(null)} 
        accountId={selectedPinAccount?.id} 
      />
      <UpdateAccountModal 
        isOpen={!!selectedEditAccount} 
        onClose={() => setSelectedEditAccount(null)} 
        account={selectedEditAccount} 
        onUpdate={handleUpdateAccount}
      />
    </div>
  );
};

export default VirtualAccounts;
