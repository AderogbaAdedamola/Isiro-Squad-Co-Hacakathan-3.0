import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const loginStore = useAuthStore(state => state.login);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerApi(data);
      // Auto-login after register for mockup purposes
      loginStore({ name: data.businessName }, 'fake-jwt-token');
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Create Account</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Start automating your ledger today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Business Name</label>
          <input 
            {...register('businessName', { required: 'Business name is required' })}
            type="text" 
            className="app-input"
            placeholder="e.g. Ade's Sneakers"
          />
          {errors.businessName && <span className="text-red-500 text-xs mt-1">{errors.businessName.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Email or Phone</label>
          <input 
            {...register('identifier', { required: 'This field is required' })}
            type="text" 
            className="app-input"
            placeholder="e.g. 08012345678"
          />
          {errors.identifier && <span className="text-red-500 text-xs mt-1">{errors.identifier.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Password</label>
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
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account? <Link to="/login" className="text-emerald-500 font-medium hover:text-emerald-600 transition-colors">Sign in</Link>
      </div>
    </div>
  );
};

export default Register;
