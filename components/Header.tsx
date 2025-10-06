import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import CurrencySelector from './CurrencySelector';
import LoadingAnimation from './LoadingAnimation';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, customerInfo, logout } = useApp();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemPreference;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    setShowLogoutModal(false);
    await logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const isActive = (path: string) => router.pathname === path;

  return (
    <header className="bg-white/95 dark:bg-vault-gray-900/95 backdrop-blur-md border-b border-vault-gray-100 dark:border-vault-gray-700 sticky top-0 z-50 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <img src="/vault22.png" alt="Vault22" className="h-8 w-8 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-vault-green opacity-0 group-hover:opacity-20 rounded-full transition-opacity" />
            </div>
            <span className="ml-2 text-xl font-bold font-display text-vault-black dark:text-white">
              Vault22
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                isActive('/')
                  ? 'text-vault-green bg-vault-green-50 dark:bg-vault-green/10'
                  : 'text-vault-gray-700 dark:text-vault-gray-300 hover:text-vault-green hover:bg-vault-gray-50 dark:hover:bg-vault-gray-800'
              }`}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                router.pathname.startsWith('/dashboard') || router.pathname.startsWith('/accounts') || router.pathname.startsWith('/transactions') || router.pathname.startsWith('/budget') || router.pathname.startsWith('/goals') || router.pathname.startsWith('/investments') || router.pathname.startsWith('/health-score')
                  ? 'text-vault-green bg-vault-green/10'
                  : 'text-vault-gray-700 dark:text-vault-gray-300 hover:text-vault-green hover:bg-vault-gray-50 dark:hover:bg-vault-gray-800'
              }`}
            >
              App
            </Link>
            <Link
              href="/about"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                isActive('/about')
                  ? 'text-vault-green bg-vault-green-50 dark:bg-vault-green/10'
                  : 'text-vault-gray-700 dark:text-vault-gray-300 hover:text-vault-green hover:bg-vault-gray-50 dark:hover:bg-vault-gray-800'
              }`}
            >
              About
            </Link>
            <Link
              href="/products"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                isActive('/products')
                  ? 'text-vault-green bg-vault-green-50 dark:bg-vault-green/10'
                  : 'text-vault-gray-700 dark:text-vault-gray-300 hover:text-vault-green hover:bg-vault-gray-50 dark:hover:bg-vault-gray-800'
              }`}
            >
              Products
            </Link>
            <Link
              href="/faq"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                isActive('/faq')
                  ? 'text-vault-green bg-vault-green-50 dark:bg-vault-green/10'
                  : 'text-vault-gray-700 dark:text-vault-gray-300 hover:text-vault-green hover:bg-vault-gray-50 dark:hover:bg-vault-gray-800'
              }`}
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                isActive('/contact')
                  ? 'text-vault-green bg-vault-green-50 dark:bg-vault-green/10'
                  : 'text-vault-gray-700 dark:text-vault-gray-300 hover:text-vault-green hover:bg-vault-gray-50 dark:hover:bg-vault-gray-800'
              }`}
            >
              Contact
            </Link>

            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="ml-4 p-2.5 rounded-full border-2 border-vault-gray-300 dark:border-vault-gray-600 hover:border-vault-green dark:hover:border-vault-green transition-all hover:shadow-lg"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                <svg className="w-5 h-5 text-vault-yellow" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-vault-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
              </button>
            )}

            {/* CTA Buttons */}
            {isAuthenticated ? (
              <>
                {/* Currency Selector */}
                <div className="ml-4">
                  <CurrencySelector />
                </div>

                {customerInfo && (
                  <div className="ml-4 flex items-center">
                    <span className="text-sm text-vault-gray-700 dark:text-vault-gray-300 mr-3">
                      {customerInfo.preferredName || customerInfo.firstname}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogoutClick}
                  className="ml-2 px-5 py-2 border-2 border-red-500 text-red-500 dark:text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition-all hover:shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="ml-2 px-5 py-2 border-2 border-vault-green text-vault-green dark:text-vault-green rounded-lg text-sm font-semibold hover:bg-vault-green hover:text-white dark:hover:text-vault-black transition-all hover:shadow-md"
                >
                  Login
                </Link>
                <Link
                  href="/contact"
                  className="ml-2 px-5 py-2 bg-vault-green text-white rounded-lg text-sm font-semibold hover:bg-vault-green-dark transition-all hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-md text-vault-gray-700 dark:text-vault-gray-300 hover:bg-vault-gray-50 dark:hover:bg-vault-gray-800">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-vault-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-vault-gray-200 dark:border-vault-gray-700 transform transition-all animate-fade-in">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>

            {/* Title & Message */}
            <h3 className="text-2xl font-bold text-vault-black dark:text-white text-center mb-3">
              Confirm Logout
            </h3>
            <p className="text-vault-gray-600 dark:text-vault-gray-400 text-center mb-8">
              Are you sure you want to log out of your account? You'll need to sign in again to access your financial data.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleLogoutCancel}
                className="flex-1 px-6 py-3 bg-vault-gray-100 dark:bg-vault-gray-700 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-200 dark:hover:bg-vault-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all hover:shadow-lg"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Loading Screen */}
      {loggingOut && (
        <div className="fixed inset-0 bg-vault-gray-50 dark:bg-vault-gray-900 flex items-center justify-center z-[70]">
          <div className="text-center">
            <LoadingAnimation size={200} />
            <p className="mt-6 text-vault-gray-600 dark:text-vault-gray-400 text-lg">Logging out...</p>
          </div>
        </div>
      )}
    </header>
  );
}
