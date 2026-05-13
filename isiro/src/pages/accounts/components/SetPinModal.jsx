import { useState, useRef, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const SetPinModal = ({ isOpen, onClose, accountId }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [step, setStep] = useState(1); // 1: Set PIN, 2: Confirm PIN
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setConfirmPin(['', '', '', '']);
      setStep(1);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handlePinChange = (index, value, isConfirm) => {
    if (!/^\d*$/.test(value)) return;

    const currentArray = isConfirm ? confirmPin : pin;
    const setter = isConfirm ? setConfirmPin : setPin;
    const newPin = [...currentArray];
    
    // Handle paste
    if (value.length > 1) {
      const pastedValue = value.slice(0, 4).split('');
      pastedValue.forEach((digit, i) => {
        if (index + i < 4) newPin[index + i] = digit;
      });
      setter(newPin);
      const nextEmpty = newPin.findIndex(v => v === '');
      inputRefs.current[nextEmpty !== -1 ? nextEmpty : 3]?.focus();
      return;
    }

    newPin[index] = value;
    setter(newPin);

    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    } else if (value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Auto proceed or submit
    if (newPin.every(v => v !== '')) {
      if (!isConfirm) {
        setTimeout(() => {
          setStep(2);
          inputRefs.current[0]?.focus();
        }, 300);
      } else {
        handleSubmit(pin.join(''), newPin.join(''));
      }
    }
  };

  const handleKeyDown = (index, e, isConfirm) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (original, confirmation) => {
    if (original !== confirmation) {
      toast.error('PINs do not match. Try again.');
      setConfirmPin(['', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Transaction PIN set successfully!');
      onClose();
    }, 1500);
  };

  const currentValues = step === 1 ? pin : confirmPin;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Transaction PIN">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
          <Lock size={32} />
        </div>
        
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
          {step === 1 ? 'Create a 4-Digit PIN' : 'Confirm your PIN'}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm mb-8">
          {step === 1 
            ? 'This PIN will be required to authorize withdrawals and sensitive actions for this account.'
            : 'Please enter the same PIN again to confirm.'}
        </p>

        <div className="flex gap-4 mb-8">
          {currentValues.map((digit, index) => (
            <input
              key={`${step}-${index}`}
              ref={el => inputRefs.current[index] = el}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value, step === 2)}
              onKeyDown={(e) => handleKeyDown(index, e, step === 2)}
              className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-zinc-200 focus:border-emerald-500 focus:ring-0 outline-none transition-colors dark:bg-zinc-900 dark:border-zinc-700 dark:text-white dark:focus:border-emerald-500"
            />
          ))}
        </div>

        {isSubmitting && (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            Securing account...
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SetPinModal;
