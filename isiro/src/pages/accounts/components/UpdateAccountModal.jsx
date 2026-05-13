import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import { Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UpdateAccountModal = ({ isOpen, onClose, account, onUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    beneficiaryAccount: ''
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || '',
        description: account.description || '',
        beneficiaryAccount: account.beneficiaryAccount || ''
      });
    }
  }, [account]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onUpdate({ ...account, ...formData });
      toast.success('Virtual account updated successfully!');
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Virtual Account" maxWidth="max-w-xl">
      <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <Building2 size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-400">Update Account Settings</h3>
          <p className="text-sm text-blue-700 dark:text-blue-500/80">Modify your dedicated account details and settlement preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Account Name</label>
            <input 
              type="text" 
              name="name"
              required 
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Main Store" 
              className="app-input" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. For receiving payments from Instagram customers" 
              className="app-input min-h-[80px] resize-none" 
            />
            <p className="text-xs text-zinc-500 mt-1">Briefly describe the purpose of this account.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Beneficiary Account Number</label>
            <input 
              type="text" 
              name="beneficiaryAccount"
              maxLength="10" 
              value={formData.beneficiaryAccount}
              onChange={handleChange}
              placeholder="10-digit Account Number" 
              className="app-input" 
            />
            <p className="text-xs text-zinc-500 mt-1">Update where funds are settled to automatically (optional).</p>
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Updating...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateAccountModal;
