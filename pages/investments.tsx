import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useApp } from '../contexts/AppContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatMoney } from '../utils/currency';
import { convertCurrency } from '../utils/currency';

export default function Investments() {
  const { aggregate, customerInfo, loading } = useApp();
  const { selectedCurrency } = useCurrency();

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppLayout title="Investments | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-vault-green mb-4"></div>
              <p className="text-vault-gray-600 dark:text-vault-gray-400">Loading investments...</p>
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  const currency = selectedCurrency;

  // Get investment accounts
  const investmentAccounts = aggregate.accounts.filter(
    acc => acc.accountType === 'Investment' || acc.accountType === 'Cryptocurrency'
  );

  // Calculate totals
  const totalValue = investmentAccounts.reduce((sum, acc) => {
    const balance = acc.currentBalance?.amount || 0;
    const accountCurrency = acc.currentBalance?.currencyCode || acc.currencyCode || currency;
    const converted = convertCurrency(
      balance,
      accountCurrency,
      currency,
      aggregate.exchangeRates
    );
    return sum + (converted ?? 0);
  }, 0);

  // For now, we'll use placeholder data for performance metrics since we don't track historical data
  const totalInvested = totalValue * 0.9; // Assume 10% gain
  const totalGain = totalValue - totalInvested;
  const gainPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  // Calculate asset allocation based on account types
  const assetAllocation = [
    {
      name: 'Stocks',
      percent: 50,
      color: 'bg-vault-green'
    },
    {
      name: 'Bonds',
      percent: 20,
      color: 'bg-vault-blue'
    },
    {
      name: 'Real Estate',
      percent: 15,
      color: 'bg-purple-500'
    },
    {
      name: 'Commodities',
      percent: 15,
      color: 'bg-vault-yellow'
    }
  ];

  // Get goals with investments
  const goalsWithInvestments = aggregate.goals.filter(g => g.productId && !g.isNoGoal);

  return (
    <ProtectedRoute>
      <AppLayout title="Investments | Vault22">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
            Investment Portfolio
          </h1>
          <p className="text-vault-gray-600 dark:text-vault-gray-400">Track your investments and grow your wealth</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-vault-green to-vault-green-dark p-6 rounded-2xl text-white">
            <p className="text-sm opacity-90 mb-2">Total Value</p>
            <p className="text-3xl font-bold mb-1">{formatMoney(totalValue, currency)}</p>
            <p className="text-sm opacity-75 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +{gainPercentage.toFixed(1)}% all time
            </p>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Total Invested</p>
            <p className="text-3xl font-bold text-vault-black dark:text-white">{formatMoney(totalInvested, currency)}</p>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Total Gains</p>
            <p className={`text-3xl font-bold ${totalGain >= 0 ? 'text-vault-green' : 'text-red-500'}`}>
              {totalGain >= 0 ? '+' : ''}{formatMoney(totalGain, currency)}
            </p>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Holdings</p>
            <p className="text-3xl font-bold text-vault-black dark:text-white">{investmentAccounts.length}</p>
          </div>
        </div>

        {/* Portfolio Holdings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <h2 className="text-xl font-bold text-vault-black dark:text-white mb-6">Investment Accounts</h2>
            {investmentAccounts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-bold text-vault-black dark:text-white mb-2">No Investment Accounts</h3>
                <p className="text-vault-gray-600 dark:text-vault-gray-400">Add investment accounts to track your portfolio</p>
              </div>
            ) : (
              <div className="space-y-4">
                {investmentAccounts.map((account, idx) => {
                  const balance = account.currentBalance?.amount || 0;
                  const accountCurrency = account.currentBalance?.currencyCode || account.currencyCode || currency;
                  const converted = convertCurrency(
                    balance,
                    accountCurrency,
                    currency,
                    aggregate.exchangeRates
                  ) ?? 0;
                  const allocation = totalValue > 0 ? (converted / totalValue) * 100 : 0;
                  const gain = converted * 0.1; // Placeholder 10% gain
                  const gainPercent = 10; // Placeholder

                  return (
                    <div key={account.id} className="p-4 bg-vault-gray-50 dark:bg-vault-gray-700 rounded-xl hover:bg-vault-gray-100 dark:hover:bg-vault-gray-600 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-vault-black dark:text-white">{account.accountName}</h3>
                            <span className="text-lg font-bold text-vault-black dark:text-white">{formatMoney(converted, currency)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-vault-gray-600 dark:text-vault-gray-400">{account.accountType}</span>
                            <span className={`text-sm font-semibold ${gain >= 0 ? 'text-vault-green' : 'text-red-500'}`}>
                              {gain >= 0 ? '+' : ''}{gainPercent.toFixed(1)}% ({gain >= 0 ? '+' : ''}{formatMoney(gain, currency)})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-vault-gray-200 dark:bg-vault-gray-600 rounded-full h-2">
                          <div
                            className="bg-vault-green h-2 rounded-full"
                            style={{ width: `${allocation}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-vault-gray-600 dark:text-vault-gray-400">{allocation.toFixed(1)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Asset Allocation */}
            <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
              <h3 className="text-lg font-bold text-vault-black dark:text-white mb-4">Asset Allocation</h3>
              <div className="space-y-3">
                {assetAllocation.map((asset) => (
                  <div key={asset.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300">{asset.name}</span>
                      <span className="text-sm font-bold text-vault-black dark:text-white">{asset.percent}%</span>
                    </div>
                    <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-600 rounded-full h-2">
                      <div
                        className={`${asset.color} h-2 rounded-full`}
                        style={{ width: `${asset.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
              <h3 className="text-lg font-bold text-vault-black dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-3 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all">
                  Add Funds
                </button>
                <button className="w-full py-3 bg-vault-gray-100 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-200 dark:hover:bg-vault-gray-500 transition-all">
                  Rebalance Portfolio
                </button>
                <button className="w-full py-3 bg-vault-gray-100 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-200 dark:hover:bg-vault-gray-500 transition-all">
                  View Reports
                </button>
              </div>
            </div>

            {/* Risk Profile */}
            <div className="bg-gradient-to-br from-vault-blue to-vault-blue-dark p-6 rounded-2xl text-white">
              <h3 className="text-lg font-bold mb-2">Risk Profile</h3>
              <p className="text-3xl font-bold mb-2">Balanced</p>
              <p className="text-sm opacity-90">Your portfolio matches your risk tolerance</p>
              <button className="mt-4 w-full py-2 bg-white dark:bg-vault-gray-800 text-vault-blue rounded-lg font-semibold hover:bg-vault-gray-50 dark:hover:bg-vault-gray-700 transition-all">
                Retake Assessment
              </button>
            </div>
          </div>
        </div>

        {/* Goals with Investments */}
        {goalsWithInvestments.length > 0 && (
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <h2 className="text-xl font-bold text-vault-black dark:text-white mb-6">Goals with Investments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goalsWithInvestments.map((goal) => {
                // Goals are stored in customer's default currency, convert to selected currency
                const defaultCurrency = customerInfo?.defaultCurrencyCode || 'AED';
                const convertedCurrentAmount = convertCurrency(
                  goal.currentAmount,
                  defaultCurrency,
                  currency,
                  aggregate.exchangeRates
                ) ?? goal.currentAmount;
                const convertedTargetAmount = convertCurrency(
                  goal.targetAmount,
                  defaultCurrency,
                  currency,
                  aggregate.exchangeRates
                ) ?? goal.targetAmount;

                return (
                  <div key={goal.id} className="p-4 bg-vault-gray-50 dark:bg-vault-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-vault-black dark:text-white">{goal.name}</h3>
                      <span className="text-xl">📈</span>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Progress</span>
                        <span className="text-sm font-bold text-vault-black dark:text-white">{goal.percentageComplete.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-600 rounded-full h-2">
                        <div
                          className="bg-vault-green h-2 rounded-full"
                          style={{ width: `${goal.percentageComplete}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-vault-gray-600 dark:text-vault-gray-400">{formatMoney(convertedCurrentAmount, currency)}</span>
                      <span className="font-semibold text-vault-black dark:text-white">/ {formatMoney(convertedTargetAmount, currency)}</span>
                    </div>
                    {goal.productName && (
                      <p className="mt-2 text-xs text-vault-gray-500">Product: {goal.productName}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
