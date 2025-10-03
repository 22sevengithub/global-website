import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { calculateNetWorth, getAssetsByType, getLiabilitiesByType } from '../utils/netWorth';
import { formatMoney } from '../utils/currency';
import { accountApi } from '../services/api';

export default function Accounts() {
  const { aggregate, customerInfo, loading, loadAggregate } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppLayout title="Accounts | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-vault-green mb-4"></div>
              <p className="text-vault-gray-600 dark:text-vault-gray-400">Loading accounts...</p>
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  const currency = customerInfo?.defaultCurrencyCode || 'AED';
  const netWorthData = calculateNetWorth(aggregate.accounts, currency, aggregate.exchangeRates);
  const assetsByType = getAssetsByType(aggregate.accounts, currency, aggregate.exchangeRates);
  const liabilitiesByType = getLiabilitiesByType(aggregate.accounts, currency, aggregate.exchangeRates);

  // Filter accounts
  const filteredAccounts = aggregate.accounts.filter(account => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'banks') return account.accountType === 'Bank' || account.accountType === 'CreditCard';
    if (activeFilter === 'investments') return account.accountType === 'Investment';
    if (activeFilter === 'crypto') return account.accountType === 'Cryptocurrency';
    return true;
  });

  // Get icon for account type
  const getAccountIcon = (type: string) => {
    const icons: Record<string, string> = {
      'Bank': '🏦',
      'Savings': '💰',
      'CreditCard': '💳',
      'Investment': '📈',
      'Cryptocurrency': '₿',
      'RealEstate': '🏠',
      'Loan': '🏦',
      'Insurance': '🛡️'
    };
    return icons[type] || '💼';
  };

  // Get color for account type
  const getAccountColor = (type: string) => {
    const colors: Record<string, string> = {
      'Bank': 'bg-blue-500',
      'Savings': 'bg-green-500',
      'CreditCard': 'bg-yellow-500',
      'Investment': 'bg-purple-500',
      'Cryptocurrency': 'bg-orange-500',
      'RealEstate': 'bg-indigo-500',
      'Loan': 'bg-red-500',
      'Insurance': 'bg-teal-500'
    };
    return colors[type] || 'bg-vault-gray-500';
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await accountApi.refresh();
      await loadAggregate();
    } catch (error) {
      console.error('Failed to refresh accounts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout title="Accounts | Vault22">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
            Accounts Overview
          </h1>
          <p className="text-vault-gray-600 dark:text-vault-gray-400">Manage all your financial accounts in one place</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-vault-green to-vault-green-dark p-6 rounded-2xl text-white">
            <p className="text-sm opacity-90 mb-2">Total Assets</p>
            <p className="text-3xl font-bold mb-1">{formatMoney(netWorthData.totalAssets, currency)}</p>
            <p className="text-xs opacity-75">Across {assetsByType.length} types</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl text-white">
            <p className="text-sm opacity-90 mb-2">Total Liabilities</p>
            <p className="text-3xl font-bold mb-1">{formatMoney(netWorthData.totalLiabilities, currency)}</p>
            <p className="text-xs opacity-75">Across {liabilitiesByType.length} types</p>
          </div>
          <div className="bg-gradient-to-br from-vault-blue to-vault-blue-dark p-6 rounded-2xl text-white">
            <p className="text-sm opacity-90 mb-2">Net Worth</p>
            <p className="text-3xl font-bold mb-1">{formatMoney(netWorthData.netWorth, currency)}</p>
            <p className="text-xs opacity-75 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              Updated {new Date(netWorthData.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-vault-gray-200 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300'
                  : 'text-vault-gray-600 dark:text-vault-gray-400 hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700'
              }`}
            >
              All Accounts
            </button>
            <button
              onClick={() => setActiveFilter('banks')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === 'banks'
                  ? 'bg-vault-gray-200 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300'
                  : 'text-vault-gray-600 dark:text-vault-gray-400 hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700'
              }`}
            >
              Banks
            </button>
            <button
              onClick={() => setActiveFilter('investments')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === 'investments'
                  ? 'bg-vault-gray-200 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300'
                  : 'text-vault-gray-600 dark:text-vault-gray-400 hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700'
              }`}
            >
              Investments
            </button>
            <button
              onClick={() => setActiveFilter('crypto')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === 'crypto'
                  ? 'bg-vault-gray-200 dark:bg-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300'
                  : 'text-vault-gray-600 dark:text-vault-gray-400 hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700'
              }`}
            >
              Crypto
            </button>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-vault-green text-vault-black dark:text-white rounded-full font-semibold hover:bg-vault-green-light transition-all hover:shadow-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Account
          </button>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map((account) => {
            const balance = account.currentBalance?.amount || 0;
            const isLiability = balance < 0;

            return (
              <div
                key={account.id}
                className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${getAccountColor(account.accountType)} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {getAccountIcon(account.accountType)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="p-2 hover:bg-vault-gray-100 dark:hover:bg-vault-gray-600 rounded-lg transition-all disabled:opacity-50"
                    >
                      <svg className={`w-5 h-5 text-vault-gray-600 dark:text-vault-gray-400 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-vault-black dark:text-white mb-1">{account.accountName}</h3>
                <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-4">{account.accountType}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-vault-gray-500 mb-1">Balance</p>
                    <p className={`text-2xl font-bold ${isLiability ? 'text-red-500' : 'text-vault-black dark:text-white'}`}>
                      {formatMoney(Math.abs(balance), account.currentBalance?.currency || currency)}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${account.isActive ? 'bg-vault-green/20 text-vault-green' : 'bg-vault-gray-200 dark:bg-vault-gray-600 text-vault-gray-600 dark:text-vault-gray-400'}`}>
                    {account.isActive ? 'active' : 'inactive'}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Account Card */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-vault-gray-50 dark:bg-vault-gray-700 border-2 border-dashed border-vault-gray-300 dark:border-vault-gray-600 p-6 rounded-2xl hover:border-vault-green hover:bg-vault-green/5 transition-all group"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-vault-green/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-vault-black dark:text-white mb-2">Add New Account</h3>
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Connect a bank or add manually</p>
            </div>
          </button>
        </div>

        {/* Add Account Modal (simplified) */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-vault-black dark:text-white">Add Account</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-vault-gray-100 dark:hover:bg-vault-gray-600 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <button className="w-full p-4 border-2 border-vault-gray-200 dark:border-vault-gray-700 rounded-xl hover:border-vault-green transition-all text-left flex items-center">
                  <span className="text-3xl mr-4">🔗</span>
                  <div>
                    <h3 className="font-bold text-vault-black dark:text-white">Connect via Open Banking</h3>
                    <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Instant secure connection</p>
                  </div>
                </button>
                <button className="w-full p-4 border-2 border-vault-gray-200 dark:border-vault-gray-700 rounded-xl hover:border-vault-green transition-all text-left flex items-center">
                  <span className="text-3xl mr-4">✍️</span>
                  <div>
                    <h3 className="font-bold text-vault-black dark:text-white">Add Manually</h3>
                    <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Enter details yourself</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
}
