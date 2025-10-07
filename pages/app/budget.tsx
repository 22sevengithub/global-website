import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import LoadingAnimation from '../../components/LoadingAnimation';
import Link from 'next/link';
import { useApp } from '../../contexts/AppContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { getCurrentPayPeriod, getDaysRemainingInPeriod, formatPayPeriod, getStartDateOfPayPeriod, getEndDateOfPayPeriod } from '../../utils/payPeriod';
import { getBudgetBreakdown, calculateBudgetProgress, getBudgetAlertLevel, getCurrentBudgetBreakdown, getCategoriesWithValues, getBudgetedOrAverageAmount } from '../../utils/budget';
import { formatMoney } from '../../utils/currency';
import { isIncomeGroup, getSpendingGroupIcon, getSpendingGroupColor } from '../../utils/spendingGroups';

export default function Budget() {
  const { aggregate, customerInfo, loading } = useApp();
  const { selectedCurrency } = useCurrency();

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Budget | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <LoadingAnimation size={200} />
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  const currency = selectedCurrency;
  const dayOfMonthPaid = customerInfo?.dayOfMonthPaid || 1;
  const currentPayPeriod = getCurrentPayPeriod(dayOfMonthPaid);
  const daysRemaining = getDaysRemainingInPeriod(currentPayPeriod, dayOfMonthPaid);
  const startDate = getStartDateOfPayPeriod(currentPayPeriod, dayOfMonthPaid);
  const endDate = getEndDateOfPayPeriod(currentPayPeriod, dayOfMonthPaid);

  // Get categories with values (matches Flutter's getAllWithValues logic)
  const allCategoryTotals = getCategoriesWithValues(aggregate.categoryTotals);

  // Check if we should show empty state (like Flutter's budget_landing.dart)
  const hasAccounts = aggregate.accounts.length > 0;
  const hasCategoryTotals = allCategoryTotals.length > 0;

  if (!hasAccounts || !hasCategoryTotals) {
    return (
      <ProtectedRoute>
        <AppShell title="Budget | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md animate-scale-in">
              <div className="text-6xl mb-6 animate-fade-in-down">💰</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-thanos-50 mb-4 animate-stagger-1">
                No Budget Data Yet
              </h2>
              <p className="text-gray-600 dark:text-thanos-200 mb-6 animate-stagger-2">
                {!hasAccounts
                  ? "Connect your accounts to start tracking your budget."
                  : "Your budget data is being calculated. Check back soon!"}
              </p>
              <Link href={!hasAccounts ? "/app/accounts" : "/app/dashboard"} className="px-6 py-3 bg-yellow text-gray-900 dark:text-thanos-900 rounded-full font-semibold hover:bg-pikachu-400 transition-all duration-200 inline-block animate-stagger-3 hover:scale-105 hover:shadow-lg">
                {!hasAccounts ? "Connect Accounts" : "Go to Dashboard"}
              </Link>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  // Get budget breakdown by spending groups (EXCLUDES INCOME automatically)
  const budgetBreakdown = getBudgetBreakdown(aggregate.categoryTotals, currentPayPeriod)
    .filter(group => !isIncomeGroup(group.spendingGroupId)); // Filter out income group

  // Calculate totals using getCurrentBudgetBreakdown (EXCLUDES INCOME automatically)
  const budgetSummary = getCurrentBudgetBreakdown(aggregate.categoryTotals, currentPayPeriod);
  const totalBudget = budgetSummary.totalBudgeted;
  const totalSpent = budgetSummary.totalSpent;
  const remaining = budgetSummary.remaining;
  const percentUsed = budgetSummary.percentUsed;

  // Get individual categories (EXCLUDE INCOME)
  const budgetCategories = allCategoryTotals
    .filter(ct => !isIncomeGroup(ct.spendingGroupId)) // Exclude income categories
    .map(ct => {
      const category = aggregate.categories.find(c => c.id === ct.categoryId);
      const spendingGroup = aggregate.spendingGroups.find(sg => sg.id === category?.spendingGroupId);
      return {
        ...ct,
        categoryName: category?.description || 'Uncategorized',
        spendingGroupName: spendingGroup?.description || 'Other',
        budgetAmount: getBudgetedOrAverageAmount(ct) ?? 0  // Use shared function
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
      'bg-bulbasaur-500',
      'bg-sonic-500',
      'bg-pikachu-500',
      'bg-vault-dumbledore-500',
      'bg-vault-megaman-500',
      'bg-garfield-500',
      'bg-kermit-500',
      'bg-peach-500',
      'bg-vault-spongebob-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <ProtectedRoute>
      <AppShell title="Budget | Vault22">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-thanos-50 mb-2">
            Budget Management
          </h1>
          <p className="text-gray-600 dark:text-thanos-200">Track your spending and stay on target</p>
        </div>

        {/* Budget Period & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-bulbasaur-600 to-bulbasaur-800 p-6 rounded-2xl text-white border border-bulbasaur-500/30 animate-stagger-1 hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <p className="text-sm opacity-90 mb-2">Budget Period</p>
            <p className="text-2xl font-bold mb-1">
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p className="text-sm opacity-75">{daysRemaining} days remaining</p>
          </div>
          <div className="bg-gray-50 dark:bg-thanos-800 p-6 rounded-2xl border border-gray-200 dark:border-thanos-700 animate-stagger-2 hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <p className="text-sm text-gray-600 dark:text-thanos-200 mb-2">Total Budget</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-thanos-50 mb-1">{formatMoney(totalBudget, currency)}</p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-thanos-200">Spent: {formatMoney(totalSpent, currency)}</span>
                <span className="font-semibold text-gray-900 dark:text-thanos-50">{percentUsed.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-thanos-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${percentUsed > 90 ? 'bg-peach-500' : percentUsed > 75 ? 'bg-pikachu-500' : 'bg-yellow'}`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-thanos-800 p-6 rounded-2xl border border-gray-200 dark:border-thanos-700 animate-stagger-3 hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <p className="text-sm text-gray-600 dark:text-thanos-200 mb-2">Remaining</p>
            <p className="text-3xl font-bold text-kermit-600 dark:text-kermit-400 mb-1">{formatMoney(remaining, currency)}</p>
            <p className="text-sm text-gray-600 dark:text-thanos-200">
              Average {formatMoney(daysRemaining > 0 ? remaining / daysRemaining : 0, currency)}/day
            </p>
          </div>
        </div>

        {/* Spending Groups */}
        <div className="bg-gray-50 dark:bg-thanos-800 p-6 rounded-2xl border border-gray-200 dark:border-thanos-700 mb-8 animate-stagger-4 hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-thanos-50 mb-6">Spending Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgetBreakdown.map((group, index) => {
              const percentage = group.targetAmount > 0 ? (group.actualSpending / group.targetAmount) * 100 : 0;
              const icon = getSpendingGroupIcon(group.spendingGroupId);
              const color = getSpendingGroupColor(group.spendingGroupId);
              return (
                <div
                  key={group.spendingGroupId}
                  className="p-4 bg-gray-200 dark:bg-thanos-700 rounded-xl border border-gray-300 dark:border-thanos-600 hover:scale-105 transition-all duration-200 hover:shadow-lg"
                  style={{ animation: `fadeInUp 0.3s ease-out ${0.5 + index * 0.1}s both` }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{icon}</span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-thanos-100">{group.spendingGroupName}</p>
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-thanos-50">{formatMoney(group.actualSpending, currency)}</span>
                    <span className="text-sm text-gray-600 dark:text-thanos-200">/ {formatMoney(group.targetAmount, currency)}</span>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-thanos-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${percentage > 90 ? 'bg-peach-500' : percentage > 75 ? 'bg-pikachu-500' : 'bg-yellow'}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-thanos-300 mt-1">{percentage.toFixed(0)}% used</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Budgets */}
        <div className="bg-gray-50 dark:bg-thanos-800 p-6 rounded-2xl border border-gray-200 dark:border-thanos-700 animate-stagger-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-thanos-50">Category Budgets</h2>
            <button className="px-4 py-2 bg-yellow text-gray-900 dark:text-thanos-900 rounded-full font-semibold hover:bg-pikachu-400 transition-all duration-200 hover:scale-105">
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
                <div
                  key={category.id}
                  className="pb-6 border-b border-gray-200 dark:border-thanos-700 last:border-0"
                  style={{ animation: `fadeInUp 0.3s ease-out ${0.6 + index * 0.1}s both` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${getCategoryColor(index)} rounded-xl flex items-center justify-center text-2xl mr-4 hover:scale-110 transition-all duration-200`}>
                        {getCategoryIcon(category.categoryName)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-thanos-50">{category.categoryName}</h3>
                        <p className="text-xs text-gray-600 dark:text-thanos-300">{category.spendingGroupName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-thanos-50">
                        {formatMoney(category.totalAmount, currency)} / {formatMoney(category.budgetAmount, currency)}
                      </p>
                      <p className={`text-sm font-semibold ${isOverBudget ? 'text-peach-600 dark:text-peach-400' : isWarning ? 'text-pikachu-600 dark:text-pikachu-400' : 'text-kermit-600 dark:text-kermit-400'}`}>
                        {isOverBudget ? `Over by ${formatMoney(category.totalAmount - category.budgetAmount, currency)}` : `${formatMoney(category.budgetAmount - category.totalAmount, currency)} left`}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-300 dark:bg-thanos-600 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${isOverBudget ? 'bg-peach-500' : isWarning ? 'bg-pikachu-500' : 'bg-yellow'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    {percentage > 50 && (
                      <div
                        className="absolute top-0 h-3 w-0.5 bg-gray-400 dark:bg-thanos-400"
                        style={{ left: '50%' }}
                      ></div>
                    )}
                    {percentage > 80 && (
                      <div
                        className="absolute top-0 h-3 w-0.5 bg-gray-400 dark:bg-thanos-400"
                        style={{ left: '80%' }}
                      ></div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-thanos-300">
                    <span>{percentage.toFixed(1)}% used</span>
                    {alertLevel === 'warning-50' && (
                      <span className="text-pikachu-600 dark:text-pikachu-400 font-semibold">⚠️ 50% threshold reached</span>
                    )}
                    {alertLevel === 'warning-80' && (
                      <span className="text-garfield-600 dark:text-garfield-400 font-semibold">⚠️ 80% alert</span>
                    )}
                    {alertLevel === 'over-budget' && (
                      <span className="text-peach-600 dark:text-peach-400 font-semibold">🚨 Budget exceeded</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Budget Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-sonic-100 to-bulbasaur-100 dark:from-sonic-900/40 dark:to-bulbasaur-900/40 p-6 rounded-2xl border border-sonic-200 dark:border-bulbasaur-700/40 animate-stagger-6 hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-start">
              <span className="text-3xl mr-3">💡</span>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-thanos-50 mb-2">Budget Tip</h3>
                <p className="text-sm text-gray-600 dark:text-thanos-200">
                  {remaining > 0
                    ? `You're on track to save ${formatMoney(remaining, currency)} this period if you maintain your current spending pace.`
                    : `You've exceeded your budget by ${formatMoney(Math.abs(remaining), currency)}. Consider reviewing your spending.`
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pikachu-100 to-garfield-100 dark:from-pikachu-900/30 dark:to-garfield-900/30 p-6 rounded-2xl border border-pikachu-200 dark:border-pikachu-700/40 hover:scale-105 transition-all duration-300 hover:shadow-lg" style={{ animation: 'fadeInUp 0.5s ease-out 0.7s both' }}>
            <div className="flex items-start">
              <span className="text-3xl mr-3">{percentUsed > 80 ? '⚠️' : '✅'}</span>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-thanos-50 mb-2">
                  {percentUsed > 80 ? 'Watch Out' : 'Great Progress'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-thanos-200">
                  {percentUsed > 80
                    ? `You've used ${percentUsed.toFixed(0)}% of your budget with ${daysRemaining} days left in the period.`
                    : `You've used ${percentUsed.toFixed(0)}% of your budget. Keep up the good work!`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
