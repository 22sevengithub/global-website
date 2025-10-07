import AppShell from '../../../components/AppShell';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LinkSuccess() {
  const router = useRouter();
  const { providerName } = router.query;
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ProtectedRoute>
      <AppShell title="Account Linked | Vault22" showBackButton={false}>
        <div className="max-w-3xl mx-auto text-center py-12 relative">
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                    backgroundColor: ['#00D66E', '#FFCB05', '#0066FF', '#FF6B6B'][Math.floor(Math.random() * 4)],
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Success Icon with Animation */}
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-vault-green to-vault-green-dark rounded-full flex items-center justify-center animate-scale-in shadow-2xl">
              <svg className="w-16 h-16 text-white animate-check-draw" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* Animated Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-vault-green animate-ping opacity-20"></div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold font-display text-vault-black dark:text-white mb-3 animate-fade-in-up">
            Account Connected Successfully!
          </h1>
          <p className="text-lg text-vault-gray-600 dark:text-vault-gray-400 mb-12 animate-fade-in-up animation-delay-100">
            {providerName || 'Your bank account'} has been linked to your Vault22 account
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up animation-delay-200">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-vault-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-bold text-vault-black dark:text-white mb-2">Auto-Sync</h3>
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                Your transactions will be automatically synchronized daily
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-vault-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-vault-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-bold text-vault-black dark:text-white mb-2">Smart Insights</h3>
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                Get personalized insights based on your spending patterns
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-vault-black dark:text-white mb-2">Budget Tracking</h3>
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                Track your spending against your budgets in real-time
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-br from-vault-green/5 to-vault-blue/5 border border-vault-green/20 rounded-2xl p-8 mb-8 text-left animate-fade-in-up animation-delay-300">
            <h2 className="text-2xl font-bold font-display text-vault-black dark:text-white mb-4 flex items-center">
              <svg className="w-7 h-7 text-vault-green mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              What's Next?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-6 h-6 bg-vault-green rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-vault-black dark:text-white">Review Your Accounts</p>
                  <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Check that all your account balances are correct</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-vault-green rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-vault-black dark:text-white">Set Up Your Budget</p>
                  <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Create budgets for your spending categories</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 bg-vault-green rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-vault-black dark:text-white">Explore Your Dashboard</p>
                  <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Discover insights about your financial health</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Link
              href="/app/accounts"
              className="px-8 py-4 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all hover:shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              View My Accounts
            </Link>
            <Link
              href="/app/dashboard"
              className="px-8 py-4 border-2 border-vault-gray-300 dark:border-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
              </svg>
              Go to Dashboard
            </Link>
          </div>

          {/* Add Another Account Link */}
          <div className="mt-8">
            <Link
              href="/app/link-account"
              className="inline-flex items-center text-vault-green hover:text-vault-green-dark transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Link Another Account
            </Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }

          @keyframes scale-in {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes check-draw {
            0% {
              stroke-dasharray: 0 100;
            }
            100% {
              stroke-dasharray: 100 0;
            }
          }

          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-confetti {
            animation: confetti linear forwards;
          }

          .animate-scale-in {
            animation: scale-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }

          .animate-check-draw {
            stroke-dasharray: 100;
            animation: check-draw 0.6s ease-in-out 0.3s forwards;
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }

          .animation-delay-100 {
            animation-delay: 0.1s;
            opacity: 0;
          }

          .animation-delay-200 {
            animation-delay: 0.2s;
            opacity: 0;
          }

          .animation-delay-300 {
            animation-delay: 0.3s;
            opacity: 0;
          }

          .animation-delay-400 {
            animation-delay: 0.4s;
            opacity: 0;
          }
        `}</style>
      </AppShell>
    </ProtectedRoute>
  );
}
