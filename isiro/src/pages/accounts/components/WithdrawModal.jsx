import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import { ArrowUpRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const WithdrawModal = ({ isOpen, onClose, account }) => {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (parseFloat(amount) > account?.balance) {
      toast.error('Insufficient funds.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Withdrawal initiated successfully!');
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Withdraw Funds">
      {account && (
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800/60 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">From Account</p>
            <p className="font-medium text-zinc-900 dark:text-white">{account.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Available Balance</p>
            <p className="font-bold text-emerald-600 dark:text-emerald-400">₦{account.balance.toLocaleString()}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Withdrawal Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-zinc-500 sm:text-lg">₦</span>
            </div>
            <input
              type="number"
              required
              min="100"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="app-input pl-10 text-lg font-bold"
              placeholder="0.00"
            />
          </div>
          <div className="flex justify-end mt-2">
             <button 
               type="button"
               onClick={() => setAmount(account?.balance || 0)}
               className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
             >
               Withdraw Maximum
             </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Destination Account</label>
          <select 
            required
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
            className="app-input appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1.5em_1.5em]"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")` }}
          >
            <option value="" disabled>Select beneficiary account...</option>
            <option value="saved_1">Wema Bank - 0123***890 (My Main Account)</option>
            <option value="saved_2">GTBank - 0987***321 (Business Partner)</option>
            <option value="new">+ Add New Account</option>
          </select>
        </div>

        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex gap-3">
          <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-amber-800 dark:text-amber-300">
            <p className="font-semibold mb-1">Transaction Notice</p>
            <p>Withdrawals are processed instantly but may take up to 5 minutes to reflect in the destination account depending on the recipient bank's network.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Transaction PIN</label>
          <input
            type="password"
            required
            maxLength="4"
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            className="app-input text-center text-xl tracking-[1em] font-mono"
            placeholder="****"
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting || !amount || !beneficiary || pin.length !== 4}
            className="app-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Withdraw ₦{amount ? parseFloat(amount).toLocaleString() : '0.00'}
                <ArrowUpRight size={18} />
              </span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WithdrawModal;
