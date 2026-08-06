import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    // Listen for theme changes from other instances of the toggle
    const handleThemeChange = (e: CustomEvent<{ theme: 'dark' | 'light' }>) => {
      setTheme(e.detail.theme);
    };
    
    window.addEventListener('theme-changed' as any, handleThemeChange);
    return () => {
      window.removeEventListener('theme-changed' as any, handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('theme', nextTheme);

    // Broadcast the update to all other toggle buttons
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: nextTheme } }));
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line/60 bg-panel text-ink transition-all duration-200 hover:border-circuit/50 hover:bg-panel2 hover:text-circuit-bright hover:shadow-glow-sm"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
