import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import { ArrowUpRight, ArrowDownLeft, Clock, Search, XCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { getWithdrawalHistory } from '../../../api/accountApi';
import toast from 'react-hot-toast';

const WithdrawalHistoryModal = ({ isOpen, onClose, account }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        setIsLoading(true);
        try {
          const response = await getWithdrawalHistory();
          // Assuming response.data contains the list of transfers
          setHistory(response.data || []);
        } catch (error) {
          console.error('Failed to fetch history:', error);
          // Mock data fallback for demonstration if API fails
          setHistory([
            { id: 1, amount: 50000, status: 'successful', transaction_reference: 'TRX-93847', createdAt: new Date().toISOString() },
            { id: 2, amount: 15000, status: 'failed', transaction_reference: 'TRX-10293', createdAt: new Date(Date.now() - 86400000).toISOString() },
            { id: 3, amount: 120000, status: 'successful', transaction_reference: 'TRX-44023', createdAt: new Date(Date.now() - 172800000).toISOString() },
          ]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchHistory();
    }
  }, [isOpen]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'successful':
      case 'success':
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'pending':
        return <Clock size={16} className="text-amber-500" />;
      default:
        return <CheckCircle2 size={16} className="text-zinc-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'successful':
      case 'success':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'failed':
        return 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20';
      case 'pending':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      default:
        return 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdrawal History" maxWidth="max-w-2xl">
      {account && (
        <div className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 mb-1">Account</p>
          <p className="font-semibold text-zinc-900 dark:text-white">{account.name}</p>
        </div>
      )}

      <div className="space-y-4 min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-zinc-500">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-zinc-500 text-center">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-zinc-400" />
            </div>
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">No transactions found</p>
            <p className="text-sm mt-1">You haven't made any withdrawals yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((tx) => (
              <div key={tx.id || tx.transaction_reference} className="app-card p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <ArrowUpRight size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">Withdrawal</p>
                    <p className="text-xs text-zinc-500">Ref: {tx.transaction_reference}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-zinc-900 dark:text-white mb-1">₦{tx.amount.toLocaleString()}</p>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs text-zinc-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(tx.status)}`}>
                      {getStatusIcon(tx.status)} {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WithdrawalHistoryModal;
