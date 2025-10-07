import AppShell from '../../../../components/AppShell';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../../../contexts/AppContext';

export default function GoalSuccess() {
  const router = useRouter();
  const { goalId, goalName, productName } = router.query;
  const { loadAggregate } = useApp();
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    // Reload aggregate to get the new goal
    loadAggregate();

    // Generate confetti
    const confettiArray = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: ['#00D66E', '#FFCB05', '#0066FF', '#FF6B6B'][Math.floor(Math.random() * 4)],
    }));
    setConfetti(confettiArray);
  }, []);

  return (
    <ProtectedRoute>
      <AppShell title="Goal Created | Vault22">
        <div className="max-w-3xl mx-auto relative">
          {/* Confetti Animation */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {confetti.map((conf) => (
              <div
                key={conf.id}
                className="absolute w-2 h-2 rounded-full animate-confetti"
                style={{
                  left: `${conf.left}%`,
                  top: '-10px',
                  backgroundColor: conf.color,
                  animationDelay: `${conf.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Success Content */}
          <div className="text-center py-12">
            {/* Success Icon */}
            <div className="mb-8 animate-scale-in">
              <div className="w-32 h-32 mx-auto bg-vault-green/20 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-vault-green animate-check-draw" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold font-display text-vault-black dark:text-white mb-4 animate-fade-in">
              🎉 Congratulations!
            </h1>
            <p className="text-xl text-vault-gray-600 dark:text-vault-gray-400 mb-2 animate-fade-in-delay-1">
              Your goal has been created successfully
            </p>
            <p className="text-lg font-semibold text-vault-green mb-8 animate-fade-in-delay-2">
              {goalName}
            </p>

            {/* Goal Summary Card */}
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-8 mb-8 text-left animate-slide-up">
              <h2 className="text-2xl font-bold text-vault-black dark:text-white mb-6 text-center">
                What's Next?
              </h2>

              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-vault-green/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-vault-black dark:text-white mb-1">
                      Track Your Progress
                    </h3>
                    <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                      Monitor your goal's progress in real-time with detailed analytics and insights
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-vault-blue/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-vault-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-vault-black dark:text-white mb-1">
                      Automated Contributions
                    </h3>
                    <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                      Your recurring deposits will be automatically processed to keep you on track
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-vault-yellow/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-vault-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-vault-black dark:text-white mb-1">
                      Smart Insights
                    </h3>
                    <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                      Receive personalized recommendations to optimize your investment strategy
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-vault-gray-50 dark:bg-vault-gray-800 rounded-2xl p-6 mb-8 animate-slide-up-delay">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-1">
                    Investment Product
                  </p>
                  <p className="text-lg font-bold text-vault-black dark:text-white">
                    {productName}
                  </p>
                </div>
                <div className="w-12 h-12 bg-vault-green/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-3">
              <Link
                href="/app/goals"
                className="flex-1 px-6 py-4 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all text-center"
              >
                View All Goals
              </Link>
              <Link
                href="/app/dashboard"
                className="flex-1 px-6 py-4 bg-vault-gray-100 dark:bg-vault-gray-700 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-200 dark:hover:bg-vault-gray-600 transition-all text-center"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes confetti-fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes check-draw {
            0% {
              stroke-dasharray: 0 100;
            }
            100% {
              stroke-dasharray: 100 100;
            }
          }

          .animate-confetti {
            animation: confetti-fall 3s linear forwards;
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }

          .animate-fade-in-delay-1 {
            animation: fade-in 0.6s ease-out 0.2s forwards;
            opacity: 0;
          }

          .animate-fade-in-delay-2 {
            animation: fade-in 0.6s ease-out 0.4s forwards;
            opacity: 0;
          }

          .animate-fade-in-delay-3 {
            animation: fade-in 0.6s ease-out 0.6s forwards;
            opacity: 0;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out 0.3s forwards;
            opacity: 0;
          }

          .animate-slide-up-delay {
            animation: slide-up 0.6s ease-out 0.5s forwards;
            opacity: 0;
          }

          .animate-scale-in {
            animation: scale-in 0.5s ease-out forwards;
          }

          .animate-check-draw {
            animation: check-draw 0.5s ease-out 0.3s forwards;
            stroke-dasharray: 0 100;
          }
        `}</style>
      </AppShell>
    </ProtectedRoute>
  );
}
