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
  const loginStore = useAuthStore(state => state.login);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      loginStore(response.data.user, response.data.token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to login. Please try again.');
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
