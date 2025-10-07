import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../contexts/AppContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { calculateNetWorth } from '../utils/netWorth';
import { formatMoney } from '../utils/currency';
import { useState, useEffect } from 'react';
import CurrencySelector from './CurrencySelector';

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
  const { aggregate, customerInfo, logout } = useApp();
  const { selectedCurrency } = useCurrency();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  const isActive = (path: string) => router.pathname === path;

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

  const navItems = [
    { href: '/app/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/app/accounts', label: 'Accounts', icon: '🏦' },
    { href: '/app/transactions', label: 'Transactions', icon: '💳' },
    { href: '/app/budget', label: 'Budget', icon: '💰' },
    { href: '/app/goals', label: 'Goals', icon: '🎯' },
    { href: '/app/investments', label: 'Investments', icon: '📈' },
    { href: '/app/health-score', label: 'Health Score', icon: '❤️' }
  ];

  // Calculate real net worth
  const netWorthData = aggregate?.accounts
    ? calculateNetWorth(aggregate.accounts, selectedCurrency, aggregate.exchangeRates)
    : null;

  // Auto-logout when navigating away from app routes
  useEffect(() => {
    const handleRouteChange = async (url: string) => {
      // If navigating from /app/* to non-app route, logout
      if (router.pathname.startsWith('/app') && !url.startsWith('/app')) {
        await logout();
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, logout]);

  const handleBack = () => {
    // If there's history, go back
    if (window.history.length > 1) {
      router.back();
    } else {
      // Otherwise go to dashboard
      router.push('/app/dashboard');
    }
  };

  const handleExitClick = () => {
    // Show confirmation modal
    setShowExitModal(true);
  };

  const handleConfirmExit = async () => {
    // Close modal
    setShowExitModal(false);
    // Logout (will redirect to homepage automatically)
    await logout();
  };

  const handleCancelExit = () => {
    // Just close the modal
    setShowExitModal(false);
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
      <div className="min-h-screen flex flex-col bg-white dark:bg-thanos-950 transition-colors">
        {/* Top App Bar with Back Button */}
        <header className="sticky top-0 z-50 bg-gray-100 dark:bg-thanos-800 border-b border-gray-200 dark:border-thanos-700 transition-colors">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Left: Back Button or Menu */}
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-thanos-700 hover:bg-gray-300 dark:hover:bg-thanos-600 transition-colors"
                  aria-label="Go back"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-thanos-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-thanos-700 hover:bg-gray-300 dark:hover:bg-thanos-600 transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-thanos-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Center: Logo */}
            <Link href="/app/dashboard" className="flex items-center">
              <span className="text-2xl font-bold font-display text-yellow">Vault22</span>
            </Link>

            {/* Right: Theme Toggle + Currency Selector + User Info */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-200 dark:bg-thanos-700 hover:bg-gray-300 dark:hover:bg-thanos-600 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              )}
              <CurrencySelector />
              <Link href="/app/settings" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-bulbasaur-500 to-sonic-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {customerInfo?.firstname?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-grow flex">
          {/* Sidebar Navigation */}
          <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-50 dark:bg-thanos-800 border-r border-gray-200 dark:border-thanos-700 md:h-auto transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out`}>
            <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
              {/* Net Worth Card */}
              <div className="px-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-bulbasaur-100 to-sonic-100 dark:from-bulbasaur-900/40 dark:to-sonic-900/40 rounded-2xl border border-bulbasaur-200 dark:border-bulbasaur-700/40">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-thanos-200 mb-1">Total Net Worth</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-thanos-50">
                      {netWorthData ? formatMoney(netWorthData.netWorth, selectedCurrency) : '—'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-thanos-200">
                      {netWorthData && new Date(netWorthData.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-3xl">💎</div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive(item.href)
                        ? 'bg-yellow text-gray-900 dark:text-thanos-900 shadow-lg'
                        : 'text-gray-700 dark:text-thanos-100 hover:bg-gray-200 dark:hover:bg-thanos-700 hover:text-yellow'
                    }`}
                  >
                    <span className="text-2xl mr-3">{item.icon}</span>
                    {item.label}
                    {isActive(item.href) && (
                      <span className="ml-auto w-2 h-2 bg-gray-900 dark:bg-thanos-900 rounded-full"></span>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Settings Link */}
              <div className="px-3 mt-auto pt-4 border-t border-gray-200 dark:border-thanos-700">
                <Link
                  href="/app/settings"
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive('/app/settings') || isActive('/app/profile')
                      ? 'bg-yellow text-gray-900 dark:text-thanos-900 shadow-lg'
                      : 'text-gray-700 dark:text-thanos-100 hover:bg-gray-200 dark:hover:bg-thanos-700 hover:text-yellow'
                  }`}
                >
                  <span className="text-2xl mr-3">⚙️</span>
                  Settings
                  {(isActive('/app/settings') || isActive('/app/profile')) && (
                    <span className="ml-auto w-2 h-2 bg-gray-900 dark:bg-thanos-900 rounded-full"></span>
                  )}
                </Link>
              </div>

              {/* Exit App Button */}
              <div className="px-3 mt-4">
                <button
                  onClick={handleExitClick}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all bg-red-50 dark:bg-peach-900/20 hover:bg-red-100 dark:hover:bg-peach-900/30 text-red-600 dark:text-peach-400 border border-red-200 dark:border-peach-700/40"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Exit to Website
                </button>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>

        {/* App Footer (minimal) */}
        <footer className="bg-gray-100 dark:bg-thanos-800 border-t border-gray-200 dark:border-thanos-700 py-4 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-thanos-200">
              <p>© 2024 Vault22. All rights reserved.</p>
              <div className="flex space-x-4">
                <Link href="/app/settings" className="hover:text-yellow transition-colors">Settings</Link>
                <button onClick={handleExitClick} className="hover:text-yellow transition-colors">Exit App</button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-thanos-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-200 dark:border-thanos-700 transform transition-all animate-fade-in">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-peach-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600 dark:text-peach-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>

            {/* Title & Message */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-thanos-50 text-center mb-3">
              Exit App?
            </h3>
            <p className="text-gray-600 dark:text-thanos-200 text-center mb-8">
              Are you sure you want to exit the app? You will be logged out and redirected to the homepage.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelExit}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-thanos-700 text-gray-700 dark:text-thanos-100 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-thanos-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExit}
                className="flex-1 px-6 py-3 bg-red-600 dark:bg-peach-600 text-white rounded-xl font-semibold hover:bg-red-700 dark:hover:bg-peach-700 transition-all hover:shadow-lg"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
