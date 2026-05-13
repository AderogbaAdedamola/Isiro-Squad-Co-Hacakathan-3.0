import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import { Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateAccountModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Virtual account created successfully!');
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Virtual Account" maxWidth="max-w-2xl">
      <div className="flex items-center gap-4 mb-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
          <Building2 size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-emerald-900 dark:text-emerald-400">Dedicated Account</h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-500/80">Generate a unique account number for receiving payments directly into your wallet.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Account Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Account Name</label>
              <input type="text" required placeholder="e.g. Main Store" className="app-input" />
              <p className="text-xs text-zinc-500 mt-1">This will help you identify the account.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">BVN (Bank Verification Number)</label>
              <input type="text" required maxLength="11" placeholder="11-digit BVN" className="app-input" />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">First Name</label>
              <input type="text" required placeholder="John" className="app-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Middle Name</label>
              <input type="text" placeholder="Doe" className="app-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Last Name</label>
              <input type="text" required placeholder="Smith" className="app-input" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Date of Birth</label>
              <input type="date" required className="app-input" />
            </div>
             <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Beneficiary Account Number</label>
              <input type="text" required maxLength="10" placeholder="10-digit Account Number" className="app-input" />
              <p className="text-xs text-zinc-500 mt-1">For automatic settlements (optional).</p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="app-button-primary"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              'Create Virtual Account'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAccountModal;
