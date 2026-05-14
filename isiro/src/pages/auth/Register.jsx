import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, ArrowLeft, Mail, Phone, Lock, User, Briefcase, BarChart3, ChevronRight, Building2, MapPin, Calendar, Fingerprint, MessageCircle, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Register = () => {
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1); // For Step 3 sub-navigation
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const loginStore = useAuthStore(state => state.login);
  const setOnboardingStep = useAuthStore(state => state.setOnboardingStep);
  
  useEffect(() => {
    setOnboardingStep(step);
  }, [step, setOnboardingStep]);
  
  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      businessName: '',
      category: '',
      revenue: '',
      otp: '',
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
      if (subStep === 3) fieldsToValidate = ['accountName', 'accountDescription', 'beneficiaryAccount'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (step === 1) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          toast.success('Verification code sent to your email!');
          setStep(1.5);
        }, 1500);
      } else if (step === 1.5) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          toast.success('Email verified successfully!');
          setStep(2);
        }, 1000);
      } else if (step === 2) {
        setStep(3);
      } else if (step === 3) {
        if (subStep < 3) {
          setSubStep(subStep + 1);
        } else {
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            setStep(4);
          }, 1500);
        }
      } else if (step === 4) {
        setStep(5);
      }
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

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const currentValues = watch();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-20">
      {/* Progress Indicator - only show once email is verified and onboarding starts */}
      {step >= 2 && (
        <div className="flex items-center justify-between mb-12 px-2 relative">
          <div className="absolute top-4 left-0 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10 mx-auto" />
          {[2, 3, 4, 5].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${
                step >= s 
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400'
              }`}>
                {s === 2 ? 1 : s === 3 ? 2 : s === 4 ? 3 : 4}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s ? 'text-emerald-500' : 'text-zinc-400'}`}>
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
                  {...register('fullName', { required: 'Full name is required' })}
                  type="text" 
                  className="app-input pl-10"
                  placeholder="Full Name"
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
                  {...register('phone', { required: 'Phone number is required' })}
                  type="tel" 
                  className="app-input pl-10"
                  placeholder="Phone Number"
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
                Enter the code sent to <span className="font-semibold text-zinc-900 dark:text-white">{watch('email')}</span>
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
                className="w-full text-center text-2xl font-bold tracking-[0.75rem] py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-shadow"
                placeholder="000000"
              />
              {errors.otp && <p className="text-red-500 text-xs text-center mt-1">{errors.otp.message}</p>}
              
              <p className="text-center text-sm text-zinc-500">
                Didn't receive the code? <button type="button" className="text-emerald-500 font-medium hover:underline transition-all">Resend OTP</button>
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

            <div className="flex gap-4 pt-4">
              <button onClick={prevStep} className="flex-1 px-4 py-4 border border-zinc-200 dark:border-zinc-800 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2">
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                onClick={nextStep}
                disabled={isLoading}
                className="flex-[2] app-button-primary py-4 text-lg"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                  <span className="flex items-center justify-center gap-2">
                    Next Step <ArrowRight size={20} />
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
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 block mb-1.5">First Name</label>
                            <input {...register('firstName', { required: 'First name is required' })} className="app-input" placeholder="e.g. Oluwaseun" />
                            {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName.message}</p>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 block mb-1.5">Last Name</label>
                            <input {...register('lastName', { required: 'Last name is required' })} className="app-input" placeholder="e.g. Adebayo" />
                            {errors.lastName && <p className="text-red-500 text-[10px] mt-1">{errors.lastName.message}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 block mb-1.5">Middle Name (Optional)</label>
                          <input {...register('middleName')} className="app-input" placeholder="e.g. Omotayo" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 block mb-1.5">BVN (11 Digits)</label>
                            <input 
                              {...register('bvn', { 
                                required: 'BVN is required', 
                                minLength: { value: 11, message: 'BVN must be 11 digits' },
                                maxLength: { value: 11, message: 'BVN must be 11 digits' }
                              })} 
                              type="text"
                              className="app-input" 
                              placeholder="222XXXXXXXX" 
                            />
                            {errors.bvn && <p className="text-red-500 text-[10px] mt-1">{errors.bvn.message}</p>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 block mb-1.5">Email Address</label>
                            <input 
                              {...register('kycEmail', { required: 'KYC email is required' })} 
                              type="email"
                              className="app-input" 
                              placeholder="name@example.com" 
                            />
                            {errors.kycEmail && <p className="text-red-500 text-[10px] mt-1">{errors.kycEmail.message}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 block mb-1.5">Date of Birth</label>
                            <input {...register('dob', { required: 'DOB is required' })} type="date" className="app-input" />
                            {errors.dob && <p className="text-red-500 text-[10px] mt-1">{errors.dob.message}</p>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 block mb-1.5">Gender</label>
                            <select {...register('gender', { required: 'Gender is required' })} className="app-input bg-white dark:bg-zinc-950">
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-[10px] mt-1">{errors.gender.message}</p>}
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
                  className="space-y-6"
                >
                   <div className="app-card p-6 md:p-8 space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white">Contact & Address</h3>
                          <p className="text-xs text-zinc-500">We need your current location for KYC requirements.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                          <input {...register('mobileNumber', { required: true })} className="app-input pl-10" placeholder="Mobile Number" />
                        </div>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-4 text-zinc-400" size={18} />
                          <textarea 
                            {...register('address', { required: true })} 
                            className="app-input pl-10 min-h-[120px] py-4 resize-none" 
                            placeholder="Residential Address (e.g. 12, Adekunle St, Yaba, Lagos)" 
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
                  className="space-y-6"
                >
                   <div className="app-card p-6 md:p-8 space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white">Account Configuration</h3>
                          <p className="text-xs text-zinc-500">How would you like your virtual account to appear?</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase ml-1 mb-1.5 block">Account Display Name</label>
                          <input {...register('accountName', { required: true })} className="app-input" placeholder="e.g. Ade's Store Main" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase ml-1 mb-1.5 block">Purpose / Description</label>
                          <input {...register('accountDescription', { required: true })} className="app-input" placeholder="e.g. For Instagram customer payments" />
                        </div>
                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                           <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                             <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Settlement Bank Account (Optional)</label>
                             <input {...register('beneficiaryAccount')} className="app-input bg-white dark:bg-zinc-950" placeholder="10-digit Account Number" />
                             <p className="text-[10px] text-zinc-400 mt-2 italic">Funds will be settled here automatically from your wallet.</p>
                           </div>
                        </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 pt-4">
              <button onClick={prevStep} className="flex-1 px-4 py-4 border border-zinc-200 dark:border-zinc-800 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2">
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                onClick={nextStep}
                disabled={isLoading}
                className="flex-[2] app-button-primary py-4 text-lg"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                  <span className="flex items-center justify-center gap-2">
                    {subStep === 3 ? 'Review Summary' : 'Continue'} <ArrowRight size={20} />
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
                     <button className="text-emerald-500 font-bold text-[10px] hover:underline uppercase tracking-tighter">Copy</button>
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
