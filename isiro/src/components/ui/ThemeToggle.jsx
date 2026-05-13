import { Moon, Sun, Monitor } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1 border border-zinc-200 dark:border-zinc-800">
      <button
        onClick={() => setTheme('light')}
        className={`flex-1 p-2 flex items-center justify-center rounded-md transition-all ${theme === 'light' ? 'bg-white shadow-sm text-zinc-900 dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`flex-1 p-2 flex items-center justify-center rounded-md transition-all ${theme === 'system' ? 'bg-white shadow-sm text-zinc-900 dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
      >
        <Monitor size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex-1 p-2 flex items-center justify-center rounded-md transition-all ${theme === 'dark' ? 'bg-white shadow-sm text-zinc-900 dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'}`}
      >
        <Moon size={16} />
      </button>
    </div>
  );
};

export default ThemeToggle;
