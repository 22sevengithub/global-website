import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { filterTransactions, groupTransactionsByDate } from '../utils/transactions';
import { formatMoney } from '../utils/currency';
import { getCurrentPayPeriod } from '../utils/payPeriod';

export default function Transactions() {
  const { aggregate, customerInfo, loading } = useApp();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppLayout title="Transactions | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-vault-green mb-4"></div>
              <p className="text-vault-gray-600 dark:text-vault-gray-400">Loading transactions...</p>
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  const currency = customerInfo?.defaultCurrencyCode || 'AED';
  const currentPayPeriod = getCurrentPayPeriod(customerInfo?.dayOfMonthPaid || 1);

  // Get transactions for current pay period
  const currentPeriodTransactions = aggregate.transactions.filter(t => t.payPeriod === currentPayPeriod);

  // Filter transactions based on selected filter and search
  const filteredTransactions = currentPeriodTransactions.filter(t => {
    // Apply filter
    if (filter === 'income' && t.amount.debitOrCredit !== 'credit') return false;
    if (filter === 'expenses' && t.amount.debitOrCredit !== 'debit') return false;

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const merchant = aggregate.merchants.find(m => m.id === t.merchantId);
      const category = aggregate.categories.find(c => c.id === t.categoryId);

      return (
        merchant?.name.toLowerCase().includes(searchLower) ||
        category?.name.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Calculate totals
  const totalIncome = currentPeriodTransactions
    .filter(t => t.amount.debitOrCredit === 'credit')
    .reduce((sum, t) => sum + t.amount.amount, 0);

  const totalExpenses = currentPeriodTransactions
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
    return icons[category?.name || ''] || '💼';
  };

  return (
    <ProtectedRoute>
      <AppLayout title="Transactions | Vault22">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
            Transactions
          </h1>
          <p className="text-vault-gray-600 dark:text-vault-gray-400">Track and categorize all your spending</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Total Income</p>
            <p className="text-3xl font-bold text-vault-green">{formatMoney(totalIncome, currency)}</p>
            <p className="text-xs text-vault-gray-500 mt-1">This pay period</p>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-red-500">{formatMoney(totalExpenses, currency)}</p>
            <p className="text-xs text-vault-gray-500 mt-1">This pay period</p>
          </div>
          <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">Net Cash Flow</p>
            <p className="text-3xl font-bold text-vault-black dark:text-white">{formatMoney(totalIncome - totalExpenses, currency)}</p>
            <p className={`text-xs mt-1 ${totalIncome - totalExpenses > 0 ? 'text-vault-green' : 'text-red-500'}`}>
              {totalIncome - totalExpenses > 0 ? 'Positive' : 'Negative'} cash flow
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-vault-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === 'all' ? 'bg-vault-green text-vault-black' : 'bg-vault-gray-100 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 hover:bg-vault-gray-200 dark:hover:bg-vault-gray-500'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('income')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === 'income' ? 'bg-vault-green text-vault-black' : 'bg-vault-gray-100 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 hover:bg-vault-gray-200 dark:hover:bg-vault-gray-500'}`}
              >
                Income
              </button>
              <button
                onClick={() => setFilter('expenses')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === 'expenses' ? 'bg-vault-green text-vault-black' : 'bg-vault-gray-100 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 hover:bg-vault-gray-200 dark:hover:bg-vault-gray-500'}`}
              >
                Expenses
              </button>
            </div>
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
                              {getCategoryIcon(transaction.categoryId)}
                            </div>
                            <div>
                              <p className="font-semibold text-vault-black dark:text-white">
                                {merchant?.name || transaction.description || 'Unknown'}
                              </p>
                              <p className="text-xs text-vault-gray-500">
                                {transaction.isSplit ? 'Split Transaction' : 'Regular'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-vault-gray-100 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-full text-sm font-medium">
                            {category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-vault-gray-700 dark:text-vault-gray-300">
                          {account?.accountName || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-sm text-vault-gray-700 dark:text-vault-gray-300">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-bold text-lg ${isIncome ? 'text-vault-green' : 'text-vault-black dark:text-white'}`}>
                            {isIncome ? '+' : '-'}{formatMoney(Math.abs(transaction.amount.amount), transaction.amount.currency)}
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
      </AppLayout>
    </ProtectedRoute>
  );
}
