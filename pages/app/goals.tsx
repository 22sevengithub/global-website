import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import LoadingAnimation from '../../components/LoadingAnimation';
import Link from 'next/link';
import { useApp } from '../../contexts/AppContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { formatMoney } from '../../utils/currency';

export default function Goals() {
  const { aggregate, customerInfo, loading } = useApp();
  const { selectedCurrency } = useCurrency();

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Goals | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <LoadingAnimation size={200} />
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  const currency = selectedCurrency;

  // Filter out "No Goal" entries
  const goals = aggregate.goals.filter(g => !g.isNoGoal);

  const totalGoals = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalRemaining = totalGoals - totalSaved;

  // Get icon for goal type
  const getGoalIcon = (goalType: string) => {
    const icons: Record<string, string> = {
      'Emergency': '🛡️',
      'Retirement': '🌴',
      'Travel': '✈️',
      'Home': '🏡',
      'Vehicle': '🚗',
      'Education': '🎓',
      'Wedding': '💍',
      'Investment': '📈',
      'Custom': '🎯'
    };
    return icons[goalType] || '🎯';
  };

  const getGoalColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <ProtectedRoute>
      <AppShell title="Goals | Vault22">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
            Financial Goals
          </h1>
          <p className="text-vault-gray-600 dark:text-vault-gray-400">Track your progress towards your dreams</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 animate-stagger-1 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Active Goals</p>
            <p className="text-3xl font-bold text-vault-black dark:text-white">{goals.length}</p>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 animate-stagger-2 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Total Target</p>
            <p className="text-3xl font-bold text-vault-black dark:text-white">{formatMoney(totalGoals, currency)}</p>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 animate-stagger-3 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Total Saved</p>
            <p className="text-3xl font-bold text-vault-green">{formatMoney(totalSaved, currency)}</p>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 animate-stagger-4 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Remaining</p>
            <p className="text-3xl font-bold text-vault-gray-700 dark:text-vault-gray-300">{formatMoney(totalRemaining, currency)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6 animate-stagger-5">
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-vault-gray-200 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-lg font-medium hover:bg-vault-gray-300 dark:hover:bg-vault-gray-500 transition-all duration-200">
              All Goals
            </button>
            <button className="px-4 py-2 text-vault-gray-600 dark:text-vault-gray-400 rounded-lg font-medium hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all duration-200">
              On Track
            </button>
            <button className="px-4 py-2 text-vault-gray-600 dark:text-vault-gray-400 rounded-lg font-medium hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all duration-200">
              Needs Attention
            </button>
          </div>
          <Link
            href="/app/goals/create/select-type"
            className="px-6 py-2 bg-vault-green text-vault-black dark:text-white rounded-full font-semibold hover:bg-vault-green-light transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Goal
          </Link>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.length === 0 ? (
            <div className="col-span-2 bg-white dark:bg-vault-gray-800 p-12 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 text-center animate-stagger-6 hover:shadow-lg transition-all duration-300">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-vault-black dark:text-white mb-2">No Goals Yet</h3>
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-6">Start setting financial goals to track your progress</p>
              <Link
                href="/app/goals/create/select-type"
                className="px-6 py-3 bg-vault-green text-vault-black dark:text-white rounded-full font-semibold hover:bg-vault-green-light transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block"
              >
                Create Your First Goal
              </Link>
            </div>
          ) : (
            goals.map((goal, index) => {
              const percentage = goal.percentageComplete;
              const monthsRemaining = goal.targetDate ? Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0;
              const monthlyRequired = monthsRemaining > 0 ? (goal.targetAmount - goal.currentAmount) / monthsRemaining : 0;

              return (
                <div
                  key={goal.id}
                  className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg hover:scale-105 transition-all duration-300"
                  style={{ animation: `fadeInUp 0.3s ease-out ${0.5 + index * 0.1}s both` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-14 h-14 ${getGoalColor(index)} rounded-xl flex items-center justify-center text-3xl mr-4`}>
                        {getGoalIcon(goal.goalType)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-vault-black dark:text-white">{goal.name}</h3>
                        <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">{goal.goalType}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-vault-gray-100 dark:hover:bg-vault-gray-600 rounded-lg transition-all duration-200">
                      <svg className="w-5 h-5 text-vault-gray-600 dark:text-vault-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300">Progress</span>
                      <span className="text-2xl font-bold text-vault-black dark:text-white">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-600 rounded-full h-4 mb-2">
                      <div
                        className={`${getGoalColor(index)} h-4 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-vault-gray-600 dark:text-vault-gray-400">{formatMoney(goal.currentAmount, currency)} saved</span>
                      <span className="font-bold text-vault-black dark:text-white">{formatMoney(goal.targetAmount, currency)} target</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-vault-gray-50 dark:bg-vault-gray-700 rounded-xl hover:shadow-md transition-all duration-200">
                      <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400 mb-1">Monthly Required</p>
                      <p className="text-lg font-bold text-vault-black dark:text-white">{formatMoney(monthlyRequired, currency)}</p>
                    </div>
                    <div className="p-3 bg-vault-gray-50 dark:bg-vault-gray-700 rounded-xl hover:shadow-md transition-all duration-200">
                      <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400 mb-1">Target Date</p>
                      <p className="text-lg font-bold text-vault-black dark:text-white">
                        {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'No date'}
                      </p>
                    </div>
                  </div>

                  {goal.productId && (
                    <div className="mb-4 p-3 bg-vault-green/10 rounded-xl border border-vault-green/20 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400 mb-1">Invested in</p>
                          <p className="text-sm font-semibold text-vault-black dark:text-white">Investment Product</p>
                        </div>
                        <span className="text-xl">📈</span>
                      </div>
                    </div>
                  )}

                  <div className={`p-3 rounded-xl hover:shadow-md transition-all duration-200 ${percentage >= 80 ? 'bg-vault-green/10 border border-vault-green/20' : percentage >= 50 ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400 mb-1">
                          {percentage >= 80 ? 'Great Progress!' : percentage >= 50 ? 'On Track' : 'Keep Going'}
                        </p>
                        <p className="text-sm font-semibold text-vault-black dark:text-white">
                          {monthsRemaining > 0 ? `${monthsRemaining} months remaining` : 'Target date passed'}
                        </p>
                      </div>
                      <span className="text-2xl">
                        {percentage >= 80 ? '🎉' : percentage >= 50 ? '✅' : '💪'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 py-2 bg-vault-green text-vault-black dark:text-white rounded-lg font-semibold hover:bg-vault-green-light transition-all duration-200 hover:shadow-lg hover:scale-105">
                      Add Funds
                    </button>
                    <button className="flex-1 py-2 bg-vault-gray-100 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-lg font-semibold hover:bg-vault-gray-200 dark:hover:bg-vault-gray-500 transition-all duration-200 hover:shadow-lg hover:scale-105">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </AppShell>
    </ProtectedRoute>
  );
}
