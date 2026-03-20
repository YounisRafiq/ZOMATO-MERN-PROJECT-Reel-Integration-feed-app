import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Theme manager component
function ThemeManager() {
  useEffect(() => {
    const setTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
    };

    // Initial theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => setTheme(e.matches ? 'dark' : 'light'));

    return () => mediaQuery.removeEventListener('change', () => {});
  }, []);

  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeManager />
    <App />
  </StrictMode>,
)
