import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import LoadingAnimation from './LoadingAnimation';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, logout } = useApp();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
              href="/app/dashboard"
              className="px-4 py-2 rounded-lg font-medium transition-colors text-vault-gray-700 dark:text-vault-gray-300 hover:text-vault-green hover:bg-vault-gray-50 dark:hover:bg-vault-gray-800"
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

            {/* CTA Buttons */}
            {isAuthenticated ? (
              <button
                onClick={handleLogoutClick}
                className="ml-4 px-5 py-2 border-2 border-red-500 text-red-500 dark:text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition-all hover:shadow-md"
              >
                Logout
              </button>
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
