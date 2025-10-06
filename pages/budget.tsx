import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingAnimation from '../components/LoadingAnimation';
import Link from 'next/link';
import { useApp } from '../contexts/AppContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { getCurrentPayPeriod, getDaysRemainingInPeriod, formatPayPeriod, getStartDateOfPayPeriod, getEndDateOfPayPeriod } from '../utils/payPeriod';
import { getBudgetBreakdown, calculateBudgetProgress, getBudgetAlertLevel, getTotalBudgetForPeriod } from '../utils/budget';
import { formatMoney } from '../utils/currency';

export default function Budget() {
  const { aggregate, customerInfo, loading } = useApp();
  const { selectedCurrency } = useCurrency();

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppLayout title="Budget | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <LoadingAnimation size={200} />
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  const currency = selectedCurrency;
  const dayOfMonthPaid = customerInfo?.dayOfMonthPaid || 1;
  const currentPayPeriod = getCurrentPayPeriod(dayOfMonthPaid);
  const daysRemaining = getDaysRemainingInPeriod(currentPayPeriod, dayOfMonthPaid);
  const startDate = getStartDateOfPayPeriod(currentPayPeriod, dayOfMonthPaid);
  const endDate = getEndDateOfPayPeriod(currentPayPeriod, dayOfMonthPaid);

  // Debug: Log category totals
  console.log('📊 Budget Debug - Total categoryTotals:', aggregate.categoryTotals.length);
  console.log('📊 Budget Debug - Sample category:', aggregate.categoryTotals[0]);
  console.log('📊 Budget Debug - Current pay period:', currentPayPeriod);

  // Helper function to get budget amount (matches Flutter's getBudgetedOrAverageAmount)
  const getBudgetAmount = (ct: any) => {
    if (ct.isTrackedForPayPeriod && ct.plannedAmount != null && ct.plannedAmount > 0) {
      return ct.plannedAmount;
    } else if (ct.averageAmount != null && ct.averageAmount > 0) {
      return ct.averageAmount;
    }
    return 0;
  };

  // Filter categories that have values (matches Flutter's getAllWithValues logic)
  // Show categories that have: (plannedAmount > 0 OR averageAmount > 0) OR totalAmount > 0
  const allCategoryTotals = aggregate.categoryTotals.filter(ct => {
    const budgetAmount = getBudgetAmount(ct);
    const hasValue = budgetAmount > 0 || ct.totalAmount > 0;
    if (hasValue) {
      console.log('✅ Including category:', ct.categoryDescription, 'budget:', budgetAmount, 'spent:', ct.totalAmount);
    }
    return hasValue;
  });

  console.log('📊 Budget Debug - Filtered categoryTotals:', allCategoryTotals.length);

  // Check if we should show empty state (like Flutter's budget_landing.dart)
  const hasAccounts = aggregate.accounts.length > 0;
  const hasCategoryTotals = allCategoryTotals.length > 0;

  if (!hasAccounts || !hasCategoryTotals) {
    return (
      <ProtectedRoute>
        <AppLayout title="Budget | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-6">💰</div>
              <h2 className="text-2xl font-bold text-vault-black dark:text-white mb-4">
                No Budget Data Yet
              </h2>
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-6">
                {!hasAccounts
                  ? "Connect your accounts to start tracking your budget."
                  : "Your budget data is being calculated. Check back soon!"}
              </p>
              <Link href={!hasAccounts ? "/accounts" : "/dashboard"} className="px-6 py-3 bg-vault-green text-vault-black dark:text-white rounded-full font-semibold hover:bg-vault-green-light transition-all inline-block">
                {!hasAccounts ? "Connect Accounts" : "Go to Dashboard"}
              </Link>
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  // Get budget breakdown by spending groups (from filtered categories)
  const budgetBreakdown = getBudgetBreakdown(allCategoryTotals, currentPayPeriod);

  // Calculate totals from ALL categories with budgets
  const totalBudget = allCategoryTotals.reduce((sum, ct) => sum + getBudgetAmount(ct), 0);
  const totalSpent = allCategoryTotals.reduce((sum, ct) => sum + ct.totalAmount, 0);

  const remaining = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Get individual categories (all that have values, not just current period)
  const budgetCategories = allCategoryTotals
    .map(ct => {
      const category = aggregate.categories.find(c => c.id === ct.categoryId);
      const spendingGroup = aggregate.spendingGroups.find(sg => sg.id === category?.spendingGroupId);
      return {
        ...ct,
        categoryName: category?.description || 'Uncategorized',
        spendingGroupName: spendingGroup?.description || 'Other',
        budgetAmount: getBudgetAmount(ct)
      };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount);

  // Get icon for category
  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, string> = {
      'Groceries': '🛒',
      'Housing': '🏠',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Health': '💪',
      'Savings': '💰',
      'Debt': '💳',
      'Utilities': '💡',
      'Dining': '🍽️'
    };
    return icons[categoryName] || '📊';
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-vault-green',
      'bg-vault-blue',
      'bg-vault-yellow',
      'bg-purple-500',
      'bg-pink-500',
      'bg-green-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500',
      'bg-orange-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <ProtectedRoute>
      <AppLayout title="Budget | Vault22">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
            Budget Management
          </h1>
          <p className="text-vault-gray-600 dark:text-vault-gray-400">Track your spending and stay on target</p>
        </div>

        {/* Budget Period & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-vault-green to-vault-green-dark p-6 rounded-2xl text-white">
            <p className="text-sm opacity-90 mb-2">Budget Period</p>
            <p className="text-2xl font-bold mb-1">
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p className="text-sm opacity-75">{daysRemaining} days remaining</p>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Total Budget</p>
            <p className="text-3xl font-bold text-vault-black dark:text-white mb-1">{formatMoney(totalBudget, currency)}</p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-vault-gray-600 dark:text-vault-gray-400">Spent: {formatMoney(totalSpent, currency)}</span>
                <span className="font-semibold text-vault-black dark:text-white">{percentUsed.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${percentUsed > 90 ? 'bg-red-500' : percentUsed > 75 ? 'bg-yellow-500' : 'bg-vault-green'}`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Remaining</p>
            <p className="text-3xl font-bold text-vault-green mb-1">{formatMoney(remaining, currency)}</p>
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
              Average {formatMoney(daysRemaining > 0 ? remaining / daysRemaining : 0, currency)}/day
            </p>
          </div>
        </div>

        {/* Spending Groups */}
        <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 mb-8">
          <h2 className="text-xl font-bold text-vault-black dark:text-white mb-6">Spending Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgetBreakdown.map((group) => {
              const percentage = group.targetAmount > 0 ? (group.actualSpending / group.targetAmount) * 100 : 0;
              return (
                <div key={group.spendingGroupId} className="p-4 bg-vault-gray-50 dark:bg-vault-gray-700 rounded-xl">
                  <p className="text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-3">{group.spendingGroupName}</p>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-bold text-vault-black dark:text-white">{formatMoney(group.actualSpending, currency)}</span>
                    <span className="text-sm text-vault-gray-600 dark:text-vault-gray-400">/ {formatMoney(group.targetAmount, currency)}</span>
                  </div>
                  <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-vault-green'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-vault-gray-500 mt-1">{percentage.toFixed(0)}% used</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Budgets */}
        <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-vault-black dark:text-white">Category Budgets</h2>
            <button className="px-4 py-2 bg-vault-green text-vault-black dark:text-white rounded-full font-semibold hover:bg-vault-green-light transition-all">
              Edit Budgets
            </button>
          </div>
          <div className="space-y-6">
            {budgetCategories.map((category, index) => {
              const percentage = category.budgetAmount > 0 ? calculateBudgetProgress(category.totalAmount, category.budgetAmount) : 0;
              const alertLevel = getBudgetAlertLevel(category.totalAmount, category.budgetAmount);
              const isOverBudget = alertLevel === 'over-budget';
              const isWarning = alertLevel === 'warning-80';

              return (
                <div key={category.id} className="pb-6 border-b border-vault-gray-200 dark:border-vault-gray-700 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${getCategoryColor(index)} rounded-xl flex items-center justify-center text-2xl mr-4`}>
                        {getCategoryIcon(category.categoryName)}
                      </div>
                      <div>
                        <h3 className="font-bold text-vault-black dark:text-white">{category.categoryName}</h3>
                        <p className="text-xs text-vault-gray-500">{category.spendingGroupName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-vault-black dark:text-white">
                        {formatMoney(category.totalAmount, currency)} / {formatMoney(category.budgetAmount, currency)}
                      </p>
                      <p className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : isWarning ? 'text-yellow-600' : 'text-vault-green'}`}>
                        {isOverBudget ? `Over by ${formatMoney(category.totalAmount - category.budgetAmount, currency)}` : `${formatMoney(category.budgetAmount - category.totalAmount, currency)} left`}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-600 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${isOverBudget ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-vault-green'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    {percentage > 50 && (
                      <div
                        className="absolute top-0 h-3 w-0.5 bg-vault-gray-400"
                        style={{ left: '50%' }}
                      ></div>
                    )}
                    {percentage > 80 && (
                      <div
                        className="absolute top-0 h-3 w-0.5 bg-vault-gray-400"
                        style={{ left: '80%' }}
                      ></div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-vault-gray-500">
                    <span>{percentage.toFixed(1)}% used</span>
                    {alertLevel === 'warning-50' && (
                      <span className="text-yellow-600 font-semibold">⚠️ 50% threshold reached</span>
                    )}
                    {alertLevel === 'warning-80' && (
                      <span className="text-orange-600 font-semibold">⚠️ 80% alert</span>
                    )}
                    {alertLevel === 'over-budget' && (
                      <span className="text-red-600 font-semibold">🚨 Budget exceeded</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-vault-blue/10 to-vault-green/10 p-6 rounded-2xl border border-vault-green/20">
            <div className="flex items-start">
              <span className="text-3xl mr-3">💡</span>
              <div>
                <h3 className="font-bold text-vault-black dark:text-white mb-2">Budget Tip</h3>
                <p className="text-sm text-vault-gray-700 dark:text-vault-gray-300">
                  {remaining > 0
                    ? `You're on track to save ${formatMoney(remaining, currency)} this period if you maintain your current spending pace.`
                    : `You've exceeded your budget by ${formatMoney(Math.abs(remaining), currency)}. Consider reviewing your spending.`
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start">
              <span className="text-3xl mr-3">{percentUsed > 80 ? '⚠️' : '✅'}</span>
              <div>
                <h3 className="font-bold text-vault-black dark:text-white mb-2">
                  {percentUsed > 80 ? 'Watch Out' : 'Great Progress'}
                </h3>
                <p className="text-sm text-vault-gray-700 dark:text-vault-gray-300">
                  {percentUsed > 80
                    ? `You've used ${percentUsed.toFixed(0)}% of your budget with ${daysRemaining} days left in the period.`
                    : `You've used ${percentUsed.toFixed(0)}% of your budget. Keep up the good work!`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
