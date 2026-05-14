import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Loader2, CheckCircle2, Phone, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';

const WhatsappVerificationModal = ({ isOpen, onClose }) => {
  const { isWhatsappVerified, whatsappNumber, verifyWhatsapp, updateWhatsapp } = useAuthStore();
  const [number, setNumber] = useState(whatsappNumber || '');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(isWhatsappVerified ? 'verified' : 'input');

  const handleVerify = async () => {
    if (!number || number.length < 10) {
      toast.error('Please enter a valid WhatsApp number');
      return;
    }

    setIsLoading(true);
    // Simulate WhatsApp OTP send and verify
    setTimeout(() => {
      setIsLoading(false);
      verifyWhatsapp(number);
      setStep('verified');
      toast.success('WhatsApp number verified!');
    }, 2000);
  };

  const handleChangeNumber = () => {
    setStep('input');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
            <MessageCircle size={24} />
            <h2 className="text-xl font-bold">WhatsApp Verification</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'input' ? (
              <motion.div 
                key="input"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Verify your WhatsApp number to receive real-time sales alerts and customer messages.
                  </p>
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input 
                    type="tel"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="WhatsApp Number (e.g. +234...)"
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                  />
                </div>

                <button 
                  onClick={handleVerify}
                  disabled={isLoading}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : (
                    <>Send Verification Code <ArrowRight size={20} /></>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="verified"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Verified!</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                    {whatsappNumber}
                  </p>
                </div>
                <div className="pt-4 space-y-3">
                  <button 
                    onClick={onClose}
                    className="w-full py-4 bg-zinc-900 dark:bg-zinc-800 text-white rounded-2xl font-bold transition-all hover:opacity-90"
                  >
                    Done
                  </button>
                  <button 
                    onClick={handleChangeNumber}
                    className="text-emerald-500 font-bold hover:underline"
                  >
                    Change Number
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default WhatsappVerificationModal;
