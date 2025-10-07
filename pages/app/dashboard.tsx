import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import LoadingAnimation from '../../components/LoadingAnimation';
import Link from 'next/link';
import { useApp } from '../../contexts/AppContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { calculateNetWorth } from '../../utils/netWorth';
import { formatMoney } from '../../utils/currency';
import { getCurrentPayPeriod, getDaysRemainingInPeriod } from '../../utils/payPeriod';
import { getCurrentBudgetBreakdown } from '../../utils/budget';

export default function Dashboard() {
  const { aggregate, customerInfo, loading } = useApp();
  const { selectedCurrency } = useCurrency();

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Dashboard | Vault22" showBackButton={false}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <LoadingAnimation size={200} />
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  const currency = selectedCurrency;
  const netWorthData = calculateNetWorth(aggregate.accounts, currency, aggregate.exchangeRates);

  // Budget data
  const dayOfMonthPaid = customerInfo?.dayOfMonthPaid || 1;
  const currentPayPeriod = getCurrentPayPeriod(dayOfMonthPaid);
  const daysRemaining = getDaysRemainingInPeriod(currentPayPeriod, dayOfMonthPaid);
  const budgetSummary = getCurrentBudgetBreakdown(aggregate.categoryTotals, currentPayPeriod);

  // Account summaries
  const bankAccounts = aggregate.accounts.filter(a => a.accountClass === 'Bank' && !a.deactivated);
  const creditCards = aggregate.accounts.filter(a => a.accountClass === 'CreditCard' && !a.deactivated);
  const investments = aggregate.accounts.filter(a => a.accountClass === 'Investment' && !a.deactivated);

  return (
    <ProtectedRoute>
      <AppShell title="Dashboard | Vault22" showBackButton={false}>
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-thanos-50 mb-2">
            Welcome back, {customerInfo?.firstname || 'User'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-thanos-200">Here's your financial overview</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Net Worth */}
          <div className="bg-gradient-to-br from-bulbasaur-100 to-sonic-100 dark:from-bulbasaur-900/40 dark:to-sonic-900/40 p-6 rounded-2xl border border-bulbasaur-200 dark:border-bulbasaur-700/40">
            <p className="text-sm text-gray-600 dark:text-thanos-200 mb-2">Total Net Worth</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-thanos-50 mb-1">{formatMoney(netWorthData.netWorth, currency)}</p>
            <div className="flex items-center text-xs text-gray-600 dark:text-thanos-200 mt-2">
              <span className="mr-2">💎</span>
              <span>Assets: {formatMoney(netWorthData.totalAssets, currency)}</span>
            </div>
          </div>

          {/* Budget Status */}
          <div className="bg-gray-50 dark:bg-thanos-800 p-6 rounded-2xl border border-gray-200 dark:border-thanos-700">
            <p className="text-sm text-gray-600 dark:text-thanos-200 mb-2">Budget Remaining</p>
            <p className="text-4xl font-bold text-bulbasaur-600 dark:text-bulbasaur-400 mb-1">{formatMoney(budgetSummary.remaining, currency)}</p>
            <div className="w-full bg-gray-200 dark:bg-thanos-700 rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full transition-all ${budgetSummary.percentUsed > 90 ? 'bg-peach-500' : budgetSummary.percentUsed > 75 ? 'bg-pikachu-500' : 'bg-yellow'}`}
                style={{ width: `${Math.min(budgetSummary.percentUsed, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-thanos-200 mt-2">{daysRemaining} days left</p>
          </div>

          {/* Total Accounts */}
          <div className="bg-gray-50 dark:bg-thanos-800 p-6 rounded-2xl border border-gray-200 dark:border-thanos-700">
            <p className="text-sm text-gray-600 dark:text-thanos-200 mb-2">Total Accounts</p>
            <p className="text-4xl font-bold text-gray-900 dark:text-thanos-50 mb-1">{aggregate.accounts.filter(a => !a.deactivated).length}</p>
            <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-thanos-200 mt-2">
              <span>🏦 {bankAccounts.length}</span>
              <span>💳 {creditCards.length}</span>
              <span>📈 {investments.length}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 dark:bg-thanos-800 p-6 rounded-2xl border border-gray-200 dark:border-thanos-700 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-thanos-50 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/app/accounts" className="flex flex-col items-center justify-center p-4 bg-gray-200 dark:bg-thanos-700 hover:bg-gray-300 dark:hover:bg-thanos-600 rounded-xl transition-all group">
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏦</span>
              <span className="text-sm text-gray-900 dark:text-thanos-50 font-medium">Accounts</span>
            </Link>
            <Link href="/app/budget" className="flex flex-col items-center justify-center p-4 bg-gray-200 dark:bg-thanos-700 hover:bg-gray-300 dark:hover:bg-thanos-600 rounded-xl transition-all group">
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">💰</span>
              <span className="text-sm text-gray-900 dark:text-thanos-50 font-medium">Budget</span>
            </Link>
            <Link href="/app/transactions" className="flex flex-col items-center justify-center p-4 bg-gray-200 dark:bg-thanos-700 hover:bg-gray-300 dark:hover:bg-thanos-600 rounded-xl transition-all group">
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">💳</span>
              <span className="text-sm text-gray-900 dark:text-thanos-50 font-medium">Transactions</span>
            </Link>
            <Link href="/app/goals" className="flex flex-col items-center justify-center p-4 bg-gray-200 dark:bg-thanos-700 hover:bg-gray-300 dark:hover:bg-thanos-600 rounded-xl transition-all group">
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎯</span>
              <span className="text-sm text-gray-900 dark:text-thanos-50 font-medium">Goals</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-50 dark:bg-thanos-800 p-6 rounded-2xl border border-gray-200 dark:border-thanos-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-thanos-50">Recent Transactions</h2>
            <Link href="/app/transactions" className="text-sm text-bulbasaur-600 dark:text-bulbasaur-400 hover:text-bulbasaur-700 dark:hover:text-bulbasaur-300 transition-colors">
              View All →
            </Link>
          </div>
          {aggregate.transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-thanos-700 last:border-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-thanos-700 rounded-full flex items-center justify-center text-xl">
                  {transaction.categoryName === 'Groceries' ? '🛒' : '💳'}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-thanos-50 font-medium">{transaction.description}</p>
                  <p className="text-xs text-gray-600 dark:text-thanos-200">{new Date(transaction.transactionDate).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`text-lg font-semibold ${transaction.amount.debitOrCredit === 'credit' ? 'text-kermit-600 dark:text-kermit-400' : 'text-gray-900 dark:text-thanos-50'}`}>
                {transaction.amount.debitOrCredit === 'credit' ? '+' : '-'}{formatMoney(Math.abs(transaction.amount.amount), transaction.amount.currencyCode)}
              </p>
            </div>
          ))}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
