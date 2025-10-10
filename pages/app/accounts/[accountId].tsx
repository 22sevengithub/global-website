import AppShell from '../../../components/AppShell';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingAnimation from '../../../components/LoadingAnimation';
import Icon from '../../../components/Icon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';
import { useApp } from '../../../contexts/AppContext';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { formatMoney, convertCurrency } from '../../../utils/currency';
import { manualAccountApi } from '../../../services/api';
import { getAccountTypeIcon } from '../../../constants/manualAccountTypes';

export default function AccountDetail() {
  const router = useRouter();
  const { accountId } = router.query;
  const { aggregate, customerInfo, loading, loadAggregate } = useApp();
  const { selectedCurrency } = useCurrency();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteType, setDeleteType] = useState<'delete' | 'deactivate'>('delete');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // Find the account in aggregate data
  const account = useMemo(() => {
    if (!aggregate?.accounts || !accountId) return null;
    return aggregate.accounts.find(acc => acc.id === accountId);
  }, [aggregate, accountId]);

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Account Details | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <LoadingAnimation size={150} />
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mt-4">Loading account...</p>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (!account) {
    return (
      <ProtectedRoute>
        <AppShell title="Account Not Found | Vault22">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Account Not Found</h1>
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-6">
                The account you're looking for doesn't exist or has been deleted.
              </p>
              <Link
                href="/app/accounts"
                className="inline-flex items-center px-6 py-3 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all"
              >
                Back to Accounts
              </Link>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  const currency = selectedCurrency;
  const haveAmount = account.have?.amount || 0;
  const accountCurrency = account.currentBalance?.currencyCode || account.currencyCode || currency;

  // Convert to selected currency if needed
  let displayBalance = haveAmount;
  if (accountCurrency.toUpperCase() !== currency.toUpperCase()) {
    const converted = convertCurrency(
      Math.abs(haveAmount),
      accountCurrency,
      currency,
      aggregate.exchangeRates
    );
    displayBalance = converted !== null ? (haveAmount < 0 ? -converted : converted) : displayBalance;
  }

  const isLiability = haveAmount < 0;
  const isManualAccount = account.accountClass === 'Manual';

  // Get account icon data - matches mobile app logic exactly (reorderable_accounts.dart:98-120)
  const getAccountIconData = (): { isLocal: boolean; iconPath: string } => {
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
    if ((account as any).accountIconImageUrl) {
      return {
        isLocal: false,
        iconPath: (account as any).accountIconImageUrl
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

  const iconData = getAccountIconData();

  // Handle opening delete modal
  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
    setError('');
  };

  // Handle delete type selection
  const handleDeleteTypeSelect = (type: 'delete' | 'deactivate') => {
    setDeleteType(type);
    setShowDeleteModal(false);
    setShowConfirmation(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    const customerId = customerInfo?.id || sessionStorage.getItem('customerId');
    if (!customerId || !accountId) {
      setError('Customer ID or Account ID not found');
      return;
    }

    setDeleting(true);
    setError('');

    try {
      if (deleteType === 'delete') {
        await manualAccountApi.deleteManualAccount(customerId, accountId as string);
      } else {
        // Deactivate endpoint (if needed in future)
        // await accountApi.deactivateAccount(customerId, accountId as string);
      }

      // Reload accounts data
      await loadAggregate();

      // Navigate back to accounts page
      router.push('/app/accounts');
    } catch (err: any) {
      console.error('Failed to delete account:', err);
      setError(err.response?.data?.message || 'Failed to delete account. Please try again.');
      setDeleting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell title={`${account.name} | Vault22`}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/app/accounts"
              className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Accounts
            </Link>
          </div>

          {/* Account Header Card */}
          <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-vault-gray-100 dark:bg-vault-gray-700 rounded-xl flex items-center justify-center mr-6 p-3">
                  {iconData.isLocal ? (
                    <Icon name={iconData.iconPath} size={56} />
                  ) : (
                    <img
                      src={iconData.iconPath}
                      alt={account.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback to default icon if external image fails
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
                    {account.name}
                  </h1>
                  <p className="text-vault-gray-600 dark:text-vault-gray-400 flex items-center gap-2">
                    {account.accountType}
                    {isManualAccount && (
                      <span className="px-2 py-1 bg-vault-blue/20 text-vault-blue rounded-full text-xs font-semibold">
                        Manual
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${!account.deactivated ? 'bg-vault-green/20 text-vault-green' : 'bg-vault-gray-200 dark:bg-vault-gray-600 text-vault-gray-600 dark:text-vault-gray-400'}`}>
                {!account.deactivated ? 'Active' : 'Inactive'}
              </div>
            </div>

            {/* Balance Display */}
            <div className="border-t border-vault-gray-200 dark:border-vault-gray-700 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-vault-gray-500 mb-2">Current Balance</p>
                  <p className={`text-4xl font-bold ${isLiability ? 'text-red-500' : 'text-vault-black dark:text-white'}`}>
                    {formatMoney(displayBalance, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-vault-gray-500 mb-2">Account Type</p>
                  <p className="text-xl font-semibold text-vault-black dark:text-white">
                    {isLiability ? 'Liability' : 'Asset'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-8 mb-6">
            <h2 className="text-xl font-bold text-vault-black dark:text-white mb-6">Account Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-vault-gray-100 dark:border-vault-gray-700">
                <span className="text-vault-gray-600 dark:text-vault-gray-400">Account ID</span>
                <span className="text-vault-black dark:text-white font-mono text-sm">{account.id}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-vault-gray-100 dark:border-vault-gray-700">
                <span className="text-vault-gray-600 dark:text-vault-gray-400">Currency</span>
                <span className="text-vault-black dark:text-white font-semibold">{accountCurrency}</span>
              </div>
              {account.accountType && (
                <div className="flex items-center justify-between py-3 border-b border-vault-gray-100 dark:border-vault-gray-700">
                  <span className="text-vault-gray-600 dark:text-vault-gray-400">Account Type</span>
                  <span className="text-vault-black dark:text-white">
                    {account.accountType}
                  </span>
                </div>
              )}
              {account.serviceProviderId && (
                <div className="flex items-center justify-between py-3 border-b border-vault-gray-100 dark:border-vault-gray-700">
                  <span className="text-vault-gray-600 dark:text-vault-gray-400">Service Provider ID</span>
                  <span className="text-vault-black dark:text-white font-mono text-sm">{account.serviceProviderId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {isManualAccount && (
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-8">
              <h2 className="text-xl font-bold text-vault-black dark:text-white mb-6">Account Settings</h2>
              <button
                onClick={handleOpenDeleteModal}
                className="w-full p-4 border-2 border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-600 dark:text-red-400">Delete Account</h3>
                    <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Permanently remove this account</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-vault-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Delete Options Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl p-8 max-w-md w-full animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-vault-black dark:text-white">Delete Account</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-vault-gray-100 dark:hover:bg-vault-gray-600 rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-6">
                Are you sure you want to delete this account?
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleDeleteTypeSelect('delete')}
                  className="w-full p-4 border-2 border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left"
                >
                  <h3 className="font-bold text-red-600 dark:text-red-400 mb-1">Delete Permanently</h3>
                  <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                    Remove this account and all its data permanently. This action cannot be undone.
                  </p>
                </button>

                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full px-6 py-3 border-2 border-vault-gray-300 dark:border-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl p-8 max-w-md w-full animate-scale-in">
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-vault-black dark:text-white mb-2">
                  Confirm Deletion
                </h2>
                <p className="text-vault-gray-600 dark:text-vault-gray-400">
                  Are you absolutely sure you want to delete <strong>{account.name}</strong>? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    setShowDeleteModal(true);
                  }}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 border-2 border-vault-gray-300 dark:border-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  No, Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
