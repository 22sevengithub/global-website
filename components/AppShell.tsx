import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../contexts/AppContext';
import { useState, useEffect } from 'react';
import CurrencySelector from './CurrencySelector';
import BottomNav from './BottomNav';
import Icon from './Icon';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export default function AppShell({
  children,
  title = 'Dashboard | Vault22',
  description = 'Manage your finances with Vault22',
  showBackButton = true
}: AppShellProps) {
  const router = useRouter();
  const { customerInfo, logout } = useApp();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // Theme management
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('appTheme') as 'light' | 'dark';
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('appTheme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Bottom navigation items (5 tabs like Flutter app)
  const bottomNavItems = [
    { href: '/app/dashboard', label: 'Home', icon: 'v22Logo' },
    { href: '/app/accounts', label: 'Portfolio', icon: 'acc' },
    { href: '/app/transactions', label: 'Transactions', icon: 'tracking' },
    { href: '/app/budget', label: 'Budget', icon: 'budget' },
    { href: '/app/more', label: 'Menu', icon: 'ic_menu' },
  ];

  // NOTE: Auto-logout removed - users must explicitly confirm exit via More page

  const handleBack = () => {
    // If there's history, go back
    if (window.history.length > 1) {
      router.back();
    } else {
      // Otherwise go to dashboard
      router.push('/app/dashboard');
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/vault22.png" />
      </Head>

      {/* App with theme support */}
      <div className="min-h-screen flex flex-col bg-white dark:bg-thanos-950 transition-colors pb-20">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 bg-white dark:bg-thanos-900 border-b border-gray-200 dark:border-thanos-700 transition-colors">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Left: Back Button */}
            <div className="flex items-center space-x-2">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-thanos-800 hover:bg-gray-200 dark:hover:bg-thanos-700 transition-colors"
                  aria-label="Go back"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-thanos-50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Center: Logo */}
            <Link href="/app/dashboard" className="flex items-center absolute left-1/2 transform -translate-x-1/2">
              <span className="text-2xl font-bold font-display text-yellow">Vault22</span>
            </Link>

            {/* Right: Theme Toggle + Currency Selector + User Info */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-100 dark:bg-thanos-800 hover:bg-gray-200 dark:hover:bg-thanos-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  <Icon name="ic_theme" size={20} className={theme === 'dark' ? 'text-yellow' : 'text-gray-700'} />
                </button>
              )}
              <CurrencySelector />
              <Link href="/app/profile" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-bulbasaur-500 to-sonic-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {customerInfo?.firstname?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>

        {/* Bottom Navigation */}
        <BottomNav items={bottomNavItems} />
      </div>
    </>
  );
}
