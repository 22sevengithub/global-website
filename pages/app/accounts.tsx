import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import LoadingAnimation from '../../components/LoadingAnimation';
import Icon from '../../components/Icon';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { calculateNetWorth, getAssetsByType, getLiabilitiesByType } from '../../utils/netWorth';
import { formatMoney, convertCurrency } from '../../utils/currency';
import { accountApi } from '../../services/api';
import { getAccountTypeIcon } from '../../constants/manualAccountTypes';
import { groupAccounts, type AccountGroup } from '../../utils/accountGroups';

export default function Accounts() {
  const { aggregate, customerInfo, loading, loadAggregate } = useApp();
  const { selectedCurrency } = useCurrency();
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Calculate data and group accounts using mobile app logic - MUST be before early return
  const currency = selectedCurrency;
  const netWorthData = useMemo(() =>
    aggregate ? calculateNetWorth(aggregate.accounts, currency, aggregate.exchangeRates) : null,
    [aggregate, currency]
  );
  const assetsByType = useMemo(() =>
    aggregate ? getAssetsByType(aggregate.accounts, currency, aggregate.exchangeRates) : [],
    [aggregate, currency]
  );
  const liabilitiesByType = useMemo(() =>
    aggregate ? getLiabilitiesByType(aggregate.accounts, currency, aggregate.exchangeRates) : [],
    [aggregate, currency]
  );
  const accountGroups = useMemo(() => {
    return aggregate ? groupAccounts(aggregate.accounts, aggregate.exchangeRates, currency) : [];
  }, [aggregate, currency]);

  if (loading || !aggregate || !netWorthData) {
    return (
      <ProtectedRoute>
        <AppShell title="Accounts | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <LoadingAnimation size={150} />
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mt-4">Loading accounts...</p>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  // Get account icon path - matches mobile app logic exactly (reorderable_accounts.dart:98-120)
  const getAccountIconData = (account: any): { isLocal: boolean; iconPath: string } => {
    // 1. Check if this is a crypto account - highest priority
    const isCryptoAccount =
      account.accountClass === 'Crypto' ||
      (account.accountClass === 'Manual' &&
        (account.manualAccountType === 'Crypto' ||
          account.accountType === 'Crypto' ||
          account.accountIcon === 'Crypto'));

    if (isCryptoAccount) {
      // TODO: Implement specific coin icon lookup from crypto holdings
      // For now, use generic cryptocurrency icon
      return {
        isLocal: true,
        iconPath: 'cryptocurrency'
      };
    }

    // 2. Check for custom accountIconImageUrl (if exists)
    if (account.accountIconImageUrl) {
      return {
        isLocal: false,
        iconPath: account.accountIconImageUrl
      };
    }

    // 3. For manual accounts, use manual_account icons
    if (account.accountClass === 'Manual') {
      // Logic from mobile app: selectManualTypeIcon()
      // If accountIcon is "Manual" or null, use manualAccountType or accountType
      // Otherwise, use the accountIcon value directly
      if (account.accountIcon === 'Manual' || !account.accountIcon) {
        // Use manualAccountType or accountType, and map it through getAccountTypeIcon
        const typeId = account.manualAccountType || account.accountType || 'SomethingElse';
        return {
          isLocal: true,
          iconPath: getAccountTypeIcon(typeId) // This returns "manual_account/icon_name"
        };
      } else {
        // accountIcon is already the icon file name (e.g., "bank", "credit_card")
        // Just prepend "manual_account/"
        return {
          isLocal: true,
          iconPath: `manual_account/${account.accountIcon}`
        };
      }
    }

    // 4. For linked accounts, use service provider icon
    if (account.serviceProviderId) {
      return {
        isLocal: false,
        iconPath: `https://spi.22seven.com/246/${account.serviceProviderId}.png`
      };
    }

    // Fallback to default icon
    return {
      isLocal: true,
      iconPath: 'manual_account/default'
    };
  };

  // Toggle group expansion
  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh aggregate data instead
      await loadAggregate();
    } catch (error) {
      console.error('Failed to refresh accounts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell title="Accounts | Vault22">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
            Accounts Overview
          </h1>
          <p className="text-vault-gray-600 dark:text-vault-gray-400">Manage all your financial accounts in one place</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-vault-green to-vault-green-dark p-6 rounded-2xl text-white animate-stagger-1 hover:scale-105 transition-transform duration-300">
            <p className="text-sm opacity-90 mb-2">Total Assets</p>
            <p className="text-3xl font-bold mb-1">{formatMoney(netWorthData.totalAssets, currency)}</p>
            <p className="text-xs opacity-75">Across {assetsByType.length} types</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl text-white animate-stagger-2 hover:scale-105 transition-transform duration-300">
            <p className="text-sm opacity-90 mb-2">Total Liabilities</p>
            <p className="text-3xl font-bold mb-1">{formatMoney(netWorthData.totalLiabilities, currency)}</p>
            <p className="text-xs opacity-75">Across {liabilitiesByType.length} types</p>
          </div>
          <div className="bg-gradient-to-br from-vault-blue to-vault-blue-dark p-6 rounded-2xl text-white animate-stagger-3 hover:scale-105 transition-transform duration-300">
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
        <div className="flex items-center justify-between mb-6 animate-stagger-4">
          <h2 className="text-2xl font-bold text-vault-black dark:text-white">
            Account Groups
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-vault-green text-vault-black dark:text-white rounded-full font-semibold hover:bg-vault-green-light transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Account
          </button>
        </div>

        {/* Account Groups */}
        <div className="space-y-4">
          {accountGroups.map((group, groupIndex) => {
            const isExpanded = expandedGroups[group.name] || false;

            return (
              <div
                key={group.name}
                className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 overflow-hidden animate-stagger-4"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${0.5 + groupIndex * 0.1}s both`
                }}
              >
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="w-full p-6 flex items-center justify-between hover:bg-vault-gray-50 dark:hover:bg-vault-gray-700/50 transition-all"
                >
                  <div className="flex items-center flex-1">
                    <div className="w-12 h-12 bg-vault-gray-100 dark:bg-vault-gray-700 rounded-xl flex items-center justify-center mr-4 p-2">
                      <Icon name={group.iconPath} size={32} />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-vault-black dark:text-white">
                        {group.name}
                      </h3>
                      <p className="text-sm text-vault-gray-500">
                        {group.accounts.length} {group.accounts.length === 1 ? 'account' : 'accounts'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${group.total < 0 ? 'text-red-500' : 'text-vault-black dark:text-white'}`}>
                        {formatMoney(group.total, currency)}
                      </p>
                    </div>
                    <svg
                      className={`w-6 h-6 text-vault-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Group Accounts */}
                {isExpanded && (
                  <div className="border-t border-vault-gray-200 dark:border-vault-gray-700">
                    {group.accounts.map((account, accountIndex) => {
                      const haveAmount = account.have?.amount || 0;
                      const accountCurrency = account.currentBalance?.currencyCode || account.currencyCode || currency;

                      // Convert to selected currency if needed
                      let displayBalance = Math.abs(haveAmount);
                      if (accountCurrency.toUpperCase() !== currency.toUpperCase()) {
                        const converted = convertCurrency(
                          Math.abs(haveAmount),
                          accountCurrency,
                          currency,
                          aggregate.exchangeRates
                        );
                        displayBalance = converted !== null ? converted : displayBalance;
                      }

                      const isLiability = haveAmount < 0;
                      const iconData = getAccountIconData(account);

                      return (
                        <Link
                          key={account.id}
                          href={`/app/accounts/${account.id}`}
                          className="flex items-center p-4 hover:bg-vault-gray-50 dark:hover:bg-vault-gray-700/50 transition-all border-b border-vault-gray-100 dark:border-vault-gray-700 last:border-b-0"
                        >
                          <div className="w-10 h-10 bg-vault-gray-100 dark:bg-vault-gray-700 rounded-xl flex items-center justify-center mr-4 p-2 flex-shrink-0">
                            {iconData.isLocal ? (
                              <Icon name={iconData.iconPath} size={24} />
                            ) : (
                              <img
                                src={iconData.iconPath}
                                alt={account.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-vault-black dark:text-white truncate">
                              {account.name}
                            </h4>
                            <p className="text-sm text-vault-gray-500 truncate">
                              {account.accountType}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className={`text-lg font-bold ${isLiability ? 'text-red-500' : 'text-vault-black dark:text-white'}`}>
                              {formatMoney(displayBalance, currency)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Account Modal (simplified) */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl p-8 max-w-md w-full animate-scale-in">
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
                <Link
                  href="/app/select-account-type"
                  className="w-full p-4 border-2 border-vault-gray-200 dark:border-vault-gray-700 rounded-xl hover:border-vault-green transition-all text-left flex items-center"
                  onClick={() => setShowAddModal(false)}
                >
                  <span className="text-3xl mr-4">➕</span>
                  <div>
                    <h3 className="font-bold text-vault-black dark:text-white">Add Account</h3>
                    <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Select account type and add</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
