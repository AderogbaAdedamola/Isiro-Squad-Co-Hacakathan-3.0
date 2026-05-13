import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import { Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

const RecordSaleModal = ({ isOpen, onClose, onRecordSale }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    items: '',
    total: '',
    paymentMethod: 'Transfer',
    status: 'Completed'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      const newSale = {
        id: `SL-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        ...formData,
        total: Number(formData.total)
      };
      onRecordSale(newSale);
      toast.success('Sale recorded successfully!');
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Sale" maxWidth="max-w-xl">
      <div className="flex items-center gap-4 mb-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
          <Receipt size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-emerald-900 dark:text-emerald-400">Manual Sale Entry</h3>
          <p className="text-sm text-emerald-700 dark:text-emerald-500/80">Record a sale that happened offline or on another platform.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Customer Name</label>
            <input 
              type="text" 
              name="customer"
              required 
              value={formData.customer}
              onChange={handleChange}
              placeholder="e.g. Oluwaseun Adebayo" 
              className="app-input" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Items Purchased</label>
            <input 
              type="text" 
              name="items"
              required
              value={formData.items}
              onChange={handleChange}
              placeholder="e.g. Nike Dunk Panda (x2)" 
              className="app-input" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Total Amount (₦)</label>
              <input 
                type="number" 
                name="total"
                required
                min="0"
                value={formData.total}
                onChange={handleChange}
                placeholder="e.g. 170000" 
                className="app-input" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Payment Method</label>
              <select 
                name="paymentMethod" 
                value={formData.paymentMethod} 
                onChange={handleChange}
                className="app-input bg-white dark:bg-zinc-950"
              >
                <option value="Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="POS">POS</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="app-button-primary w-full"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              'Record Sale'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RecordSaleModal;
