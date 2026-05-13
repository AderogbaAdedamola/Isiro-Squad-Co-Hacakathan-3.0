import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import { useThemeStore } from './store/themeStore'

function App() {
  const { actualTheme, updateSystemTheme } = useThemeStore()

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateSystemTheme();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [updateSystemTheme])

  useEffect(() => {
    // Apply dark/light mode to root HTML element
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(actualTheme)
  }, [actualTheme])

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: actualTheme === 'dark' ? '#18181b' : '#ffffff',
            color: actualTheme === 'dark' ? '#ffffff' : '#09090b',
            border: actualTheme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
          }
        }}
      />
      <AppRoutes />
    </>
  )
}

export default App
