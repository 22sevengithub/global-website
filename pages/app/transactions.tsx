import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import LoadingAnimation from '../../components/LoadingAnimation';
import FilterChips from '../../components/FilterChips';
import AdvancedFiltersModal from '../../components/AdvancedFiltersModal';
import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { formatMoney, convertCurrency } from '../../utils/currency';
import { processTransactionFilters, getActiveFilterCount } from '../../utils/transactionFilters';
import { TransactionFilterModel, createEmptyFilter } from '../../types/transactionFilters';
import Icon from '../../components/Icon';

export default function Transactions() {
  const { aggregate, customerInfo, loading } = useApp();
  const { selectedCurrency } = useCurrency();
  const [filters, setFilters] = useState<TransactionFilterModel>(createEmptyFilter());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Transactions | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <LoadingAnimation size={200} />
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  const currency = selectedCurrency;

  // Get ALL transactions (matching Flutter behavior - load all then filter)
  // Filter out deleted transactions
  const allTransactions = aggregate.transactions.filter(t => !t.isDeleted);

  // Apply filters using the comprehensive filter processor (matches Flutter app logic)
  const filteredTransactions = processTransactionFilters(
    allTransactions,
    filters,
    aggregate,
    customerInfo?.currentPayPeriod?.toString()
  );

  // Handle filter removal
  const handleRemoveFilter = (filterType: string, value?: any) => {
    const newFilters = { ...filters };

    if (filterType === 'quickFilter' && value) {
      newFilters.quickFilters = { ...newFilters.quickFilters, [value]: false };
    } else if (filterType === 'categories') {
      newFilters.categories = undefined;
    } else if (filterType === 'spendingGroups') {
      newFilters.spendingGroups = undefined;
    } else if (filterType === 'accounts') {
      newFilters.accounts = undefined;
    } else if (filterType === 'tags') {
      newFilters.tags = undefined;
    } else if (filterType === 'minAmount') {
      newFilters.minAmount = undefined;
    } else if (filterType === 'maxAmount') {
      newFilters.maxAmount = undefined;
    } else if (filterType === 'dateRange') {
      newFilters.fromDate = undefined;
      newFilters.toDate = undefined;
    } else if (filterType === 'fromDate') {
      newFilters.fromDate = undefined;
    } else if (filterType === 'toDate') {
      newFilters.toDate = undefined;
    }

    setFilters(newFilters);
  };

  // Calculate totals from filtered transactions
  const totalIncome = filteredTransactions
    .filter(t => t.amount.debitOrCredit === 'credit')
    .reduce((sum, t) => sum + t.amount.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.amount.debitOrCredit === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount.amount), 0);

  // Get icon for category
  const getCategoryIcon = (categoryId: string) => {
    const category = aggregate.categories.find(c => c.id === categoryId);
    const icons: Record<string, string> = {
      'Groceries': '🛒',
      'Transportation': '⛽',
      'Income': '💰',
      'Entertainment': '🎬',
      'Shopping': '📦',
      'Dining': '☕',
      'Health': '💪'
    };
    return icons[category?.description || ''] || '💼';
  };

  const activeFilterCount = getActiveFilterCount(filters);

  return (
    <ProtectedRoute>
      <AppShell title="Transactions | Vault22">
        {/* Header with Filter Button */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-thanos-50">
              Transactions
            </h1>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-thanos-800 hover:bg-gray-200 dark:hover:bg-thanos-700 rounded-lg transition-colors"
            >
              <Icon name="ic_setting" size={20} />
              <span className="font-medium text-gray-900 dark:text-thanos-50">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow text-thanos-950 text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
          <p className="text-gray-600 dark:text-thanos-200">Track and categorize all your spending</p>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-thanos-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search transactions by merchant, category, amount..."
              value={filters.searchQuery || ''}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-thanos-700 bg-white dark:bg-thanos-800 text-gray-900 dark:text-thanos-50 rounded-xl focus:ring-2 focus:ring-bulbasaur-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <FilterChips
          filters={filters}
          aggregate={aggregate}
          currency={currency}
          onRemoveFilter={handleRemoveFilter}
        />

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Total Income</p>
            <p className="text-3xl font-bold text-vault-green">{formatMoney(totalIncome, currency)}</p>
            <p className="text-xs text-vault-gray-500 mt-1">{filteredTransactions.length} transactions</p>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-red-500">{formatMoney(totalExpenses, currency)}</p>
            <p className="text-xs text-vault-gray-500 mt-1">{allTransactions.length} total</p>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Net Cash Flow</p>
            <p className="text-3xl font-bold text-vault-black dark:text-white">{formatMoney(totalIncome - totalExpenses, currency)}</p>
            <p className={`text-xs mt-1 ${totalIncome - totalExpenses > 0 ? 'text-vault-green' : 'text-red-500'}`}>
              {totalIncome - totalExpenses > 0 ? 'Positive' : 'Negative'} cash flow
            </p>
          </div>
        </div>


        {/* Transactions List */}
        <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-vault-gray-50 dark:bg-vault-gray-700 border-b border-vault-gray-200 dark:border-vault-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-vault-gray-600 dark:text-vault-gray-400 uppercase tracking-wider">Merchant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-vault-gray-600 dark:text-vault-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-vault-gray-600 dark:text-vault-gray-400 uppercase tracking-wider">Account</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-vault-gray-600 dark:text-vault-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-vault-gray-600 dark:text-vault-gray-400 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vault-gray-200 dark:divide-vault-gray-600">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-vault-gray-500 dark:text-vault-gray-400">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => {
                    const merchant = aggregate.merchants.find(m => m.id === transaction.merchantId);
                    const category = aggregate.categories.find(c => c.id === transaction.categoryId);
                    const account = aggregate.accounts.find(a => a.id === transaction.accountId);
                    const isIncome = transaction.amount.debitOrCredit === 'credit';

                    return (
                      <tr key={transaction.id} className="hover:bg-vault-gray-50 dark:hover:bg-vault-gray-700 transition-all">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-vault-gray-100 dark:bg-vault-gray-600 rounded-full flex items-center justify-center text-xl mr-3">
                              {getCategoryIcon(transaction.categoryId || '')}
                            </div>
                            <div>
                              <p className="font-semibold text-vault-black dark:text-white">
                                {merchant?.name || transaction.description || 'Unknown'}
                              </p>
                              <p className="text-xs text-vault-gray-500">
                                {transaction.isManual ? 'Manual' : 'Regular'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-vault-gray-100 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-full text-sm font-medium">
                            {category?.description || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-vault-gray-700 dark:text-vault-gray-300">
                          {account?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-vault-gray-700 dark:text-vault-gray-300">
                          {new Date(transaction.transactionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-bold text-lg ${isIncome ? 'text-vault-green' : 'text-vault-black dark:text-white'}`}>
                            {(() => {
                              const transactionCurrency = transaction.amount.currencyCode || 'AED';
                              let amount = Math.abs(transaction.amount.amount);

                              // Convert to selected currency if different
                              if (transactionCurrency.toUpperCase() !== currency.toUpperCase()) {
                                const converted = convertCurrency(amount, transactionCurrency, currency, aggregate.exchangeRates);
                                amount = converted !== null ? converted : amount;
                              }

                              return `${isIncome ? '+' : '-'}${formatMoney(amount, currency)}`;
                            })()}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advanced Filters Modal */}
        <AdvancedFiltersModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          currentFilters={filters}
          aggregate={aggregate}
          currency={currency}
          onApplyFilters={(newFilters) => {
            setFilters(newFilters);
            setIsFilterModalOpen(false);
          }}
        />
      </AppShell>
    </ProtectedRoute>
  );
}
