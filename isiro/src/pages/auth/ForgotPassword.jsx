import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { requestPasswordReset, resetPassword } from '../../api/authApi';
import { Loader2, ArrowLeft, Mail, Lock, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm({
    defaultValues: {
      email: '',
      otp: '',
      password: '',
      confirmPassword: ''
    }
  });

  const emailValue = watch('email');

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const handleRequestOtp = async () => {
    const isValid = await trigger('email');
    if (!isValid) return;

    setIsLoading(true);
    try {
      await requestPasswordReset({ email: emailValue });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (error) {
      console.error('Request OTP Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        email: data.email,
        otp: data.otp,
        password: data.password
      });
      toast.success('Password updated successfully');
      navigate('/login');
    } catch (error) {
      console.error('Reset Password Error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-10">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <KeyRound className="text-emerald-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Enter your email to receive a reset code</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  type="email" 
                  className="app-input pl-10"
                  placeholder="Email Address"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
              </div>

              <div className="pt-2">
                <button 
                  type="button" 
                  onClick={handleRequestOtp}
                  className="app-button-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Code'}
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <Link to="/login" className="text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 font-medium flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="text-emerald-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Enter the OTP sent to {emailValue}</p>
            </div>

            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Reset Code (OTP)</label>
                <input 
                  {...register('otp', { 
                    required: 'OTP is required',
                    minLength: { value: 6, message: 'OTP must be 6 digits' }
                  })}
                  type="text" 
                  maxLength="6"
                  className="w-full text-center text-2xl font-bold tracking-[0.5rem] py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-shadow"
                  placeholder="000000"
                />
                {errors.otp && <p className="text-red-500 text-xs text-center mt-1">{errors.otp.message}</p>}
              </div>

              <div className="relative group mt-4">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  {...register('password', { 
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  type="password" 
                  className="app-input pl-10"
                  placeholder="New Password"
                />
                {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password'
                  })}
                  type="password" 
                  className="app-input pl-10"
                  placeholder="Confirm New Password"
                />
                {errors.confirmPassword && <span className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</span>}
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setStep(1)} 
                  className="flex-1 app-button"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] app-button-primary"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPassword;
