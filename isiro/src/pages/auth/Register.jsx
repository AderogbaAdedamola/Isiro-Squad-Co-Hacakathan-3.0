import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { createVirtualAccount } from '../../api/accountApi';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, ArrowLeft, Mail, Phone, Lock, User, Briefcase, BarChart3, ChevronRight, Building2, MapPin, Calendar, Fingerprint, MessageCircle, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Register = () => {
  const currentOnboardingStep = useAuthStore(state => state.currentOnboardingStep);
  const user = useAuthStore(state => state.user);
  
  const [step, setStep] = useState(currentOnboardingStep || 1);
  const [subStep, setSubStep] = useState(1); // For Step 3 sub-navigation
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const loginStore = useAuthStore(state => state.login);
  const setOnboardingStep = useAuthStore(state => state.setOnboardingStep);
  
  useEffect(() => {
    setOnboardingStep(step);
  }, [step, setOnboardingStep]);
  
  const { register, handleSubmit, trigger, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: user?.email || '',
      password: '',
      phone: user?.phoneNumber || '',
      businessName: user?.businessName || '',
      category: user?.businessCategory || '',
      revenue: user?.targetMonthlyRevenue ? `₦${user.targetMonthlyRevenue.toLocaleString()}` : '',
      otp: '',
      // ... existing fields
      // Screen 3 Fields
      accountName: '',
      accountDescription: '',
      firstName: '',
      lastName: '',
      middleName: '',
      mobileNumber: '',
      dob: '',
      bvn: '',
      gender: '',
      address: '',
      beneficiaryAccount: '',
      kycEmail: '' // For Squad API specific email if different
    }
  });

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['fullName', 'email', 'password', 'phone'];
    if (step === 1.5) fieldsToValidate = ['otp'];
    if (step === 2) fieldsToValidate = ['businessName', 'category', 'revenue'];
    
    // Step 3 Sub-step validation
    if (step === 3) {
      if (subStep === 1) {
        fieldsToValidate = ['firstName', 'lastName', 'middleName', 'bvn', 'dob', 'gender', 'kycEmail'];
      }
      if (subStep === 2) fieldsToValidate = ['mobileNumber', 'address'];
      if (subStep === 3) fieldsToValidate = ['accountName', 'accountDescription', 'beneficiaryAccount', 'beneficiaryBankCode', 'withdrawalPin'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (!isValid) {
      toast.error('Please fill all required fields correctly');
      return;
    }
    
    if (isValid) {
      if (step === 1) {
        setIsLoading(true);
        try {
          const payload = {
            name: watch('fullName'),
            email: watch('email'),
            phoneNumber: watch('phone'),
            password: watch('password')
          };
          
          console.log('Sending Registration Payload:', payload);

          const response = await api.post('/users/register', payload);
          
          toast.success(response.data?.message || 'Verification code sent to your email!');
          setStep(1.5);
        } catch (error) {
          console.error('Registration Error:', error.response?.data || error.message);
          toast.error('Something went wrong. Please try again.');
        } finally {
          setIsLoading(false);
        }
      } else if (step === 1.5) {
        setIsLoading(true);
        try {
          const payload = {
            email: watch('email'),
            otp: watch('otp')
          };

          const response = await api.post('/users/verify-email', payload);
          
          toast.success(response.data?.message || 'Email verified successfully!');

          // Auto-login after verification to establish session cookies/token
          try {
            const loginResponse = await api.post('/users/login', {
              email: watch('email'),
              password: watch('password')
            });
            const user = loginResponse.data.user;
            loginStore(user, loginResponse.data.token || null);
          } catch (loginErr) {
            console.error('Auto-login after verify failed:', loginErr.response?.data || loginErr.message);
          }

          setStep(2);
        } catch (error) {
          console.error('Verification Error:', error.response?.data || error.message);
          toast.error('Verification failed. Please try again.');
        } finally {
          setIsLoading(false);
        }
      } else if (step === 2) {
        setIsLoading(true);
        try {
          const revenueStr = watch('revenue');
          const nums = revenueStr.replace(/[,₦]/g, '').match(/\d+/g);
          const highestRevenue = nums ? Math.max(...nums.map(Number)) : 0;

          const currentToken = localStorage.getItem('token');
          console.log('🔑 Token present:', !!currentToken, currentToken ? `${currentToken.substring(0, 20)}...` : 'NONE');

          await api.post('/users/update-business-details', {
            businessName: watch('businessName'),
            businessCategory: watch('category'),
            targetMonthlyRevenue: highestRevenue
          });
          
          toast.success('Business details updated!');
          setStep(3);
        } catch (error) {
          console.error('Business Update Error:', error.response?.data || error.message);
          console.error('Response Status:', error.response?.status);
          // If the interceptor couldn't refresh the token, ask user to re-login
          if (error.response?.status === 401 || error.response?.status === 403) {
            toast.error('Session expired. Please log in again to continue.');
          } else {
            toast.error('Something went wrong. Please try again.');
          }
        } finally {
          setIsLoading(false);
        }
      } else if (step === 3) {
        if (subStep < 3) {
          setSubStep(subStep + 1);
        } else {
          setIsLoading(true);
          try {
            const formData = watch();
            
            const payload = {
              first_name: formData.firstName,
              last_name: formData.lastName,
              middle_name: formData.middleName || "",
              mobile_num: formData.mobileNumber,
              dob: formData.dob,
              email: formData.kycEmail || formData.email,
              bvn: formData.bvn,
              gender: formData.gender === "Male" ? "1" : "2", // Adjust gender format if needed by API
              address: formData.address,
              beneficiary_account: formData.beneficiaryAccount || "0000000000",
              beneficiary_bank_code: formData.beneficiaryBankCode || "058", // Default to GTB if not provided
              withdrawal_pin: formData.withdrawalPin || "1234"
            };

            await createVirtualAccount(payload);
            toast.success('Virtual account created successfully!');
            setStep(4);
          } catch (error) {
            console.error('Virtual Account Creation Error:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to create virtual account. Please try again.');
          } finally {
            setIsLoading(false);
          }
        }
      } else if (step === 4) {
        setStep(5);
      }
    }
  };

  const resendOtp = async () => {
    const email = watch('email');
    if (!email) {
      toast.error('Email not found. Please go back to the first step.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/users/register', {
        name: watch('fullName'),
        email: watch('email'),
        phoneNumber: watch('phone'),
        password: watch('password')
      });
      toast.success(response.data?.message || 'New code sent to your email!');
    } catch (error) {
      console.error('Resend OTP Error:', error.response?.data || error.message);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    if (step === 1.5) setStep(1);
    if (step === 2) setStep(1.5);
    if (step === 3) {
      if (subStep > 1) setSubStep(subStep - 1);
      else setStep(2);
    }
    if (step === 4) setStep(3);
    if (step === 5) setStep(4);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Simulate Final API Registration
      setTimeout(() => {
        setIsLoading(false);
        loginStore({ name: data.businessName, email: data.email }, 'fake-jwt-token');
        toast.success('Welcome to Isiro! Your account is ready.');
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to create account.');
    }
  };

  const categories = [
    'Fashion & Apparel',
    'Food & Beverage',
    'Electronics & Gadgets',
    'Home & Living',
    'Beauty & Personal Care',
    'Professional Services',
    'Other'
  ];

  const revenueRanges = [
    '₦0 - ₦500,000',
    '₦500,000 - ₦2,000,000',
    '₦2,000,000 - ₦5,000,000',
    '₦5,000,000+'
  ];

  const handleCopyAccount = (number) => {
    navigator.clipboard.writeText(number);
    toast.success('Account number copied!');
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const currentValues = watch();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-10">
      {/* Progress Indicator - only show once email is verified and onboarding starts */}
      {step >= 2 && (
        <div className="flex items-center justify-between mb-8 px-2 relative max-w-sm mx-auto">
          <div className="absolute top-3 left-0 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10 mx-auto" />
          {[2, 3, 4, 5].map((s) => (
            <div key={s} className="flex flex-col items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border-2 ${
                step >= s 
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400'
              }`}>
                {s === 2 ? 1 : s === 3 ? 2 : s === 4 ? 3 : 4}
              </div>
              <span className={`text-[8px] font-bold uppercase tracking-wider ${step >= s ? 'text-emerald-500' : 'text-zinc-400'}`}>
                {s === 2 ? 'Business' : s === 3 ? 'Virtual' : s === 4 ? 'Verify' : 'Finish'}
              </span>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4 max-w-md mx-auto"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-extrabold tracking-tight mb-1">Join Isiro</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">Create your personal account</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  {...register('fullName', { 
                    required: 'Full name is required',
                    validate: value => value.trim().split(' ').length >= 2 || 'Please enter both first and last name'
                  })}
                  type="text" 
                  placeholder="Full Name"
                  className="app-input pl-10"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>

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
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: { value: /^[0-9]+$/, message: 'Only numbers allowed' },
                    minLength: { value: 10, message: 'Too short' }
                  })}
                  type="tel" 
                  className="app-input pl-10"
                  placeholder="Phone Number (e.g. 08012345678)"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  type="password" 
                  className="app-input pl-10"
                  placeholder="Password"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <button 
              onClick={nextStep}
              disabled={isLoading}
              className="app-button-primary w-full py-3.5 text-base"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                <span className="flex items-center justify-center gap-2">
                  Continue <ArrowRight size={18} />
                </span>
              )}
            </button>
          </motion.div>
        )}

        {step === 1.5 && (
          <motion.div
            key="step1.5"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4 max-w-md mx-auto"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="text-emerald-500" size={24} />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight mb-1">Verify Email</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                Enter the 6-digit code sent to <span className="font-semibold text-zinc-900 dark:text-white">{watch('email')}</span>
              </p>
            </div>

            <div className="space-y-4">
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
              
              <p className="text-center text-sm text-zinc-500">
                Didn't receive the code? <button 
                  type="button" 
                  onClick={resendOtp}
                  disabled={isLoading}
                  className="text-emerald-500 font-medium hover:underline transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Resend OTP'}
                </button>
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="flex-1 px-4 py-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2 text-sm">
                <ArrowLeft size={18} /> Back
              </button>
              <button 
                onClick={nextStep}
                disabled={isLoading}
                className="flex-[2] app-button-primary py-3.5 text-base"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Verify'}
              </button>
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
            className="space-y-4 max-w-md mx-auto"
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-extrabold tracking-tight mb-1">Business Details</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">Tell us about your trade</p>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  {...register('businessName', { required: 'Business name is required' })}
                  type="text" 
                  className="app-input pl-10"
                  placeholder="Business Name"
                />
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
              </div>

              <div className="relative group">
                <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <select 
                  {...register('category', { required: 'Please select a category' })}
                  className="app-input pl-10 appearance-none bg-white dark:bg-zinc-950"
                >
                  <option value="" disabled>Business Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                   <ChevronRight size={18} className="rotate-90" />
                </div>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Target Monthly Revenue</label>
                <div className="grid grid-cols-2 gap-3">
                  {revenueRanges.map(range => (
                    <label key={range} className={`cursor-pointer group relative`}>
                      <input 
                        {...register('revenue', { required: 'Please select a range' })}
                        type="radio" 
                        value={range} 
                        className="peer sr-only" 
                      />
                      <div className="p-4 text-xs text-center border border-zinc-200 dark:border-zinc-800 rounded-xl peer-checked:border-emerald-500 peer-checked:bg-emerald-500/5 peer-checked:text-emerald-600 dark:peer-checked:text-emerald-400 transition-all group-hover:bg-zinc-50 dark:group-hover:bg-zinc-900 font-semibold shadow-sm">
                        {range}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.revenue && <p className="text-red-500 text-xs mt-1 text-center">{errors.revenue.message}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={prevStep} className="flex-1 app-button">
                <ArrowLeft size={18} className="mr-2" /> Back
              </button>
              <button 
                onClick={nextStep}
                disabled={isLoading}
                className="flex-[2] app-button-primary"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <span className="flex items-center justify-center gap-2">
                    Next Step <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4 max-w-lg mx-auto"
          >
            <div className="text-center mb-6 px-4">
              <h2 className="text-xl font-extrabold tracking-tight mb-1">Virtual Account Setup</h2>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-300 ${subStep === i ? 'w-5 bg-emerald-500' : 'w-2.5 bg-zinc-200 dark:bg-zinc-800'}`} />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {subStep === 1 && (
                <motion.div 
                  key="sub1" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                   <div className="app-card p-5 md:p-6 space-y-4">
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <Fingerprint size={16} />
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Identity Details</h3>
                          <p className="text-[10px] text-zinc-500">Provide your official KYC information.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1 block mb-1">First Name</label>
                            <input {...register('firstName', { required: 'First name is required' })} className="app-input py-2.5 text-sm" placeholder="e.g. Oluwaseun" />
                            {errors.firstName && <p className="text-red-500 text-[9px] mt-0.5">{errors.firstName.message}</p>}
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1 block mb-1">Last Name</label>
                            <input {...register('lastName', { required: 'Last name is required' })} className="app-input py-2.5 text-sm" placeholder="e.g. Adebayo" />
                            {errors.lastName && <p className="text-red-500 text-[9px] mt-0.5">{errors.lastName.message}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-1">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1 block mb-1">Middle Name</label>
                            <input {...register('middleName')} className="app-input py-2.5 text-sm" placeholder="Optional" />
                          </div>
                          <div className="col-span-1">
                            <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1 block mb-1">BVN</label>
                            <input 
                              {...register('bvn', { 
                                required: 'BVN is required', 
                                minLength: { value: 11, message: 'Must be 11 digits' },
                                maxLength: { value: 11, message: 'Must be 11 digits' }
                              })} 
                              type="text"
                              className="app-input py-2.5 text-sm" 
                              placeholder="222XXXXXXXX" 
                            />
                            {errors.bvn && <p className="text-red-500 text-[9px] mt-0.5">{errors.bvn.message}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1 block mb-1">Email Address</label>
                            <input 
                              {...register('kycEmail', { 
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                              })} 
                              type="email"
                              className="app-input py-2.5 text-sm" 
                              placeholder="name@example.com" 
                            />
                            {errors.kycEmail && <p className="text-red-500 text-[9px] mt-0.5">{errors.kycEmail.message}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1 block mb-1">Date of Birth</label>
                            <input {...register('dob', { required: 'DOB is required' })} type="date" className="app-input py-2 text-xs" />
                            {errors.dob && <p className="text-red-500 text-[9px] mt-0.5">{errors.dob.message}</p>}
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1 block mb-1">Gender</label>
                            <select {...register('gender', { required: 'Gender is required' })} className="app-input py-2 text-xs bg-white dark:bg-zinc-950">
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-[9px] mt-0.5">{errors.gender.message}</p>}
                          </div>
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {subStep === 2 && (
                <motion.div 
                  key="sub2" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                   <div className="app-card p-5 md:p-6 space-y-4">
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Contact & Address</h3>
                          <p className="text-[10px] text-zinc-500">KYC residency requirements.</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                          <input {...register('mobileNumber', { required: true })} className="app-input pl-10" placeholder="Mobile Number" />
                        </div>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3.5 text-zinc-400" size={16} />
                          <textarea 
                            {...register('address', { required: true })} 
                            className="app-input pl-10 min-h-[90px] py-3 resize-none text-sm" 
                            placeholder="Residential Address" 
                          />
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {subStep === 3 && (
                <motion.div 
                  key="sub3" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                   <div className="app-card p-5 md:p-6 space-y-4">
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Account Configuration</h3>
                          <p className="text-[10px] text-zinc-500">Virtual account display settings.</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1 mb-1 block">Account Display Name</label>
                            <input {...register('accountName', { required: true })} className="app-input text-sm" placeholder="e.g. Ade's Store Main" />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-zinc-500 uppercase ml-1 mb-1 block">Purpose / Description</label>
                            <input {...register('accountDescription', { required: true })} className="app-input text-sm" placeholder="e.g. For Instagram customer payments" />
                          </div>
                        </div>
                        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                           <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 space-y-3">
                             <div className="grid grid-cols-2 gap-3">
                               <div>
                                 <label className="text-[9px] font-bold text-zinc-500 uppercase mb-1 block">Settlement Bank Account (Optional)</label>
                                 <input {...register('beneficiaryAccount')} className="app-input bg-white dark:bg-zinc-950 text-sm" placeholder="Account Number" />
                               </div>
                               <div>
                                 <label className="text-[9px] font-bold text-zinc-500 uppercase mb-1 block">Bank Code (Optional)</label>
                                 <input {...register('beneficiaryBankCode')} className="app-input bg-white dark:bg-zinc-950 text-sm" placeholder="e.g. 058 (GTB)" />
                               </div>
                             </div>
                             <div>
                               <label className="text-[9px] font-bold text-zinc-500 uppercase mb-1 block">Withdrawal PIN (4 digits)</label>
                               <input 
                                 {...register('withdrawalPin', { 
                                   required: 'Withdrawal PIN is required',
                                   minLength: { value: 4, message: 'Must be 4 digits' },
                                   maxLength: { value: 4, message: 'Must be 4 digits' },
                                   pattern: { value: /^[0-9]+$/, message: 'Only numbers allowed' }
                                 })} 
                                 type="password"
                                 className="app-input bg-white dark:bg-zinc-950 text-center tracking-[0.5em] text-lg py-2" 
                                 placeholder="••••" 
                                 maxLength={4}
                               />
                               {errors.withdrawalPin && <p className="text-red-500 text-[9px] mt-0.5">{errors.withdrawalPin.message}</p>}
                             </div>
                           </div>
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={prevStep} className="flex-1 app-button">
                <ArrowLeft size={16} className="mr-1.5" /> Back
              </button>
              <button 
                type="button"
                onClick={nextStep}
                disabled={isLoading}
                className="flex-[2] app-button-primary"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                  <span className="flex items-center justify-center gap-1.5">
                    {subStep === 3 ? 'Review Summary' : 'Continue'} <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4 max-w-md mx-auto"
          >
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-500">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight mb-1">Account Created!</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">Successfully provisioned.</p>
            </div>

            <div className="app-card overflow-hidden border-emerald-500/20 shadow-lg">
               <div className="bg-emerald-500 p-4 text-white relative">
                  <div className="absolute top-2 right-2 opacity-20">
                    <Building2 size={40} />
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Squad Virtual Account</p>
                  <h3 className="text-xl font-bold">{currentValues.accountName}</h3>
               </div>
               <div className="p-5 space-y-4 bg-white dark:bg-zinc-950">
                  <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                     <div>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mb-0.5">Account Number</p>
                        <p className="text-xl font-mono font-bold text-zinc-900 dark:text-white tracking-wider">0123456789</p>
                     </div>
                     <button 
                       onClick={() => handleCopyAccount('0123456789')}
                       className="text-emerald-500 font-bold text-[10px] hover:underline uppercase tracking-tighter flex items-center gap-1 bg-emerald-500/5 px-2 py-1 rounded-md"
                     >
                       Copy
                     </button>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                     <div>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mb-0.5">Bank Name</p>
                        <p className="text-base font-bold text-zinc-900 dark:text-white">Squad / GTBank</p>
                     </div>
                  </div>
                  <div>
                     <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mb-0.5">Beneficiary Name</p>
                     <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        Isiro / {currentValues.firstName} {currentValues.lastName}
                     </p>
                  </div>
               </div>
            </div>

            <button 
              onClick={nextStep}
              className="w-full app-button-primary py-3.5 text-base shadow-lg shadow-emerald-500/10"
            >
              Verify Identity via WhatsApp <ArrowRight size={18} className="ml-2" />
            </button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6 max-w-md mx-auto text-center"
          >
            <div className="space-y-2">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-500 shadow-inner">
                <MessageCircle size={36} />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">One Last Step!</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Verify your business by sending your code to our agent.
              </p>
            </div>

            <div className="app-card p-6 space-y-6 border-emerald-500/30 bg-emerald-500/5 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
               <div className="space-y-1">
                 <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Verification Link Ready</p>
                 <p className="text-xs text-zinc-600 dark:text-zinc-400">
                   Click below and hit "Send" in WhatsApp.
                 </p>
               </div>

               <a 
                href={`https://wa.me/2348000000000?text=Hi Isiro, I'm verifying my business account. My unique code is ISR-${Math.floor(100000 + Math.random() * 900000)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setTimeout(() => onSubmit(currentValues), 2000);
                }}
                className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl font-black text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <MessageCircle size={24} /> Open WhatsApp
              </a>
              
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-[10px] text-zinc-400 italic">
                  Verification usually takes less than 2 minutes. Once sent, you'll be automatically redirected.
                </p>
              </div>
            </div>

            <button onClick={prevStep} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-sm flex items-center justify-center gap-1 transition-colors">
              <ArrowLeft size={14} /> Back to account details
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {step === 1 && (
        <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Already have an account? <Link to="/login" className="text-emerald-500 font-medium hover:text-emerald-600 transition-colors">Sign in</Link>
        </div>
      )}
    </div>
  );
};

export default Register;
