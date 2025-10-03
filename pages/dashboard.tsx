import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Link from 'next/link';
import { useApp } from '../contexts/AppContext';
import { calculateNetWorth } from '../utils/netWorth';
import { getCurrentPayPeriod } from '../utils/payPeriod';
import { calculateFinancialHealthScore } from '../utils/financialHealthScore';
import { formatMoney } from '../utils/currency';
import { calculateBudgetProgress, getBudgetAlertLevel } from '../utils/budget';

export default function Dashboard() {
  const { aggregate, customerInfo, loading } = useApp();

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppLayout title="Dashboard | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-vault-green mb-4"></div>
              <p className="text-vault-gray-600 dark:text-vault-gray-400">Loading your dashboard...</p>
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  // Calculate metrics from real data
  const currency = customerInfo?.defaultCurrencyCode || 'AED';
  const netWorthData = calculateNetWorth(aggregate.accounts, currency, aggregate.exchangeRates);
  const currentPayPeriod = getCurrentPayPeriod(customerInfo?.dayOfMonthPaid || 1);

  // Calculate monthly income from transactions
  const currentMonthTransactions = aggregate.transactions.filter(t => t.payPeriod === currentPayPeriod);
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.amount.debitOrCredit === 'credit')
    .reduce((sum, t) => sum + t.amount.amount, 0);

  const monthlySpending = currentMonthTransactions
    .filter(t => t.amount.debitOrCredit === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount.amount), 0);

  const fhsData = calculateFinancialHealthScore(
    aggregate.accounts,
    aggregate.transactions,
    aggregate.categoryTotals,
    aggregate.goals,
    monthlyIncome
  );

  // Get top budget categories
  const topBudgetCategories = aggregate.categoryTotals
    .filter(ct => ct.payPeriod === currentPayPeriod && ct.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

  return (
    <ProtectedRoute>
      <AppLayout title="Dashboard | Vault22">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
            Good morning, {customerInfo?.preferredName || customerInfo?.firstname}! 👋
          </h1>
          <p className="text-vault-gray-600 dark:text-vault-gray-400">Here's what's happening with your money today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Net Worth</p>
              <span className="text-2xl">💎</span>
            </div>
            <p className="text-3xl font-bold text-vault-black dark:text-white mb-1">
              {formatMoney(netWorthData.netWorth, currency)}
            </p>
            <p className="text-sm text-vault-green flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              {netWorthData.netWorth > 0 ? '+' : ''}{((netWorthData.netWorth / netWorthData.totalAssets) * 100).toFixed(1)}%
            </p>
          </div>

          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Monthly Spending</p>
              <span className="text-2xl">💸</span>
            </div>
            <p className="text-3xl font-bold text-vault-black dark:text-white mb-1">
              {formatMoney(monthlySpending, currency)}
            </p>
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">This pay period</p>
          </div>

          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Monthly Income</p>
              <span className="text-2xl">🏦</span>
            </div>
            <p className="text-3xl font-bold text-vault-black dark:text-white mb-1">
              {formatMoney(monthlyIncome, currency)}
            </p>
            <p className="text-sm text-vault-green">
              Net: {formatMoney(monthlyIncome - monthlySpending, currency)}
            </p>
          </div>

          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Financial Health</p>
              <span className="text-2xl">❤️</span>
            </div>
            <p className="text-3xl font-bold text-vault-black dark:text-white mb-1">{fhsData.overallScore}/100</p>
            <p className="text-sm text-vault-green">
              {fhsData.overallScore >= 80 ? 'Excellent' : fhsData.overallScore >= 60 ? 'Good' : 'Fair'}
            </p>
          </div>
        </div>

        {/* Budget Overview */}
        {topBudgetCategories.length > 0 && (
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-vault-black dark:text-white">Top Spending Categories</h2>
              <Link href="/budget" className="text-sm text-vault-green hover:text-vault-green-dark font-semibold">
                View Budget →
              </Link>
            </div>
            <div className="space-y-4">
              {topBudgetCategories.map((category) => {
                const budgetAmount = category.plannedAmount || category.averageAmount || 0;
                const percentage = budgetAmount > 0 ? calculateBudgetProgress(category.totalAmount, budgetAmount) : 0;
                const alertLevel = getBudgetAlertLevel(category.totalAmount, budgetAmount);

                return (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-vault-gray-700 dark:text-vault-gray-300">
                        {category.categoryDescription || 'Uncategorized'}
                      </span>
                      <span className="text-sm font-bold text-vault-black dark:text-white">
                        {formatMoney(category.totalAmount, currency)}
                        {budgetAmount > 0 && ` / ${formatMoney(budgetAmount, currency)}`}
                      </span>
                    </div>
                    {budgetAmount > 0 && (
                      <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-600 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            alertLevel === 'over-budget' ? 'bg-red-500' :
                            alertLevel === 'warning-80' ? 'bg-orange-500' :
                            alertLevel === 'warning-50' ? 'bg-yellow-500' :
                            'bg-vault-green'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Accounts Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <h2 className="text-xl font-bold text-vault-black dark:text-white mb-4">Accounts</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-vault-gray-50 dark:bg-vault-gray-700 rounded-xl">
                <span className="text-sm font-medium text-vault-gray-700 dark:text-vault-gray-300">Total Assets</span>
                <span className="text-lg font-bold text-vault-green">
                  {formatMoney(netWorthData.totalAssets, currency)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-vault-gray-50 dark:bg-vault-gray-700 rounded-xl">
                <span className="text-sm font-medium text-vault-gray-700 dark:text-vault-gray-300">Total Liabilities</span>
                <span className="text-lg font-bold text-red-500">
                  {formatMoney(netWorthData.totalLiabilities, currency)}
                </span>
              </div>
              <Link
                href="/accounts"
                className="block w-full py-3 text-center bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all"
              >
                Manage Accounts
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <h2 className="text-xl font-bold text-vault-black dark:text-white mb-4">Active Goals</h2>
            <div className="space-y-3">
              {aggregate.goals.filter(g => !g.isNoGoal).slice(0, 3).map(goal => (
                <div key={goal.id} className="p-3 bg-vault-gray-50 dark:bg-vault-gray-700 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-vault-black dark:text-white">{goal.name}</span>
                    <span className="text-sm font-bold text-vault-green">{goal.percentageComplete.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-600 rounded-full h-2">
                    <div
                      className="bg-vault-green h-2 rounded-full"
                      style={{ width: `${goal.percentageComplete}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {aggregate.goals.filter(g => !g.isNoGoal).length === 0 && (
                <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 text-center py-4">
                  No active goals yet
                </p>
              )}
              <Link
                href="/goals"
                className="block w-full py-3 text-center bg-vault-gray-100 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-200 dark:hover:bg-vault-gray-500 transition-all"
              >
                View All Goals
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-vault-blue/10 to-vault-green/10 p-6 rounded-2xl border border-vault-green/20">
          <div className="flex items-start">
            <div className="text-4xl mr-4">💡</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-vault-black dark:text-white mb-2">Recommendations</h3>
              <div className="space-y-2">
                {fhsData.recommendations.slice(0, 2).map((rec, idx) => (
                  <p key={idx} className="text-sm text-vault-gray-700 dark:text-vault-gray-300">• {rec}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
