import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setOnboardingStep = useAuthStore(state => state.setOnboardingStep);
  const loginStore = useAuthStore(state => state.login);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const payload = {
      email: String(data.email).trim(),
      password: String(data.password)
    };
    try {
      const response = await login(payload);
      const user = response.data.user;
      
      // Save user to store
      loginStore(user, response.data.token || null);
      
      toast.success('Welcome back!');

      // Redirection Logic based on onboarding progress
      if (!user.businessName || !user.businessCategory) {
        setOnboardingStep(2);
        navigate('/dashboard'); // DEMO MODE: was '/register'
      } else if (!user.virtualAccount) { 
        setOnboardingStep(3);
        navigate('/dashboard'); // DEMO MODE: was '/register'
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      toast.error('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Sign in to your Isiro dashboard</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Email Address</label>
          <input 
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
            })}
            type="email" 
            className="app-input"
            placeholder="e.g. name@example.com"
          />
          {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <Link to="/forgot-password" className="text-xs text-emerald-500 hover:text-emerald-600 font-medium transition-colors">Forgot Password?</Link>
          </div>
          <input 
            {...register('password', { required: 'Password is required' })}
            type="password" 
            className="app-input"
            placeholder="••••••••"
          />
          {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            className="app-button-primary"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don't have an account? <Link to="/register" className="text-emerald-500 font-medium hover:text-emerald-600 transition-colors">Create one</Link>
      </div>
    </div>
  );
};

export default Login;
