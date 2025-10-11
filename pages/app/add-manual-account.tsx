import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import Icon from '../../components/Icon';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../contexts/AppContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { manualAccountApi } from '../../services/api';
import {
  MANUAL_HAVE,
  MANUAL_OWE,
  getAccountTypes,
  getAccountTypeIcon,
  setBalanceByType,
  getAvailableIcons,
} from '../../constants/manualAccountTypes';

export default function AddManualAccount() {
  const router = useRouter();
  const { customerInfo, loadAggregate } = useApp();
  const { selectedCurrency } = useCurrency();

  // Step 1 state
  const [step, setStep] = useState(1);
  const [accountTypeGroup, setAccountTypeGroup] = useState<string>(''); // "Have" or "Owe"
  const [selectedType, setSelectedType] = useState<string>(''); // e.g., "Bank", "CreditCard"
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // Step 2 state
  const [accountData, setAccountData] = useState({
    name: '',
    value: '',
    currencyCode: selectedCurrency,
  });
  const [selectedIcon, setSelectedIcon] = useState<string>(''); // Will be set when type is selected

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get available account types based on Have/Owe selection
  const availableAccountTypes = useMemo(() => {
    if (!accountTypeGroup) return [];
    return getAccountTypes(accountTypeGroup === MANUAL_HAVE);
  }, [accountTypeGroup]);

  // Get available icons for icon selector
  const availableIcons = useMemo(() => {
    return getAvailableIcons();
  }, []);

  // Handle Have/Owe selection
  const handleAccountGroupSelect = (group: string) => {
    setAccountTypeGroup(group);
    setSelectedType(''); // Reset type when changing group
    setShowTypeSelector(true);
  };

  // Handle account type selection
  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setShowTypeSelector(false);

    // Auto-select icon based on type
    const defaultIcon = getAccountTypeIcon(typeId);
    setSelectedIcon(defaultIcon);
  };

  // Check if can proceed to step 2
  const canProceedToStep2 = accountTypeGroup && selectedType;

  // Handle next step
  const handleNextStep = () => {
    if (canProceedToStep2) {
      setStep(2);
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accountData.name || !accountData.value) {
      setError('Please fill in all required fields');
      return;
    }

    const customerId = customerInfo?.id || sessionStorage.getItem('customerId');
    if (!customerId) {
      setError('Customer ID not found');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Apply correct sign to value based on Have/Owe
      const isHave = accountTypeGroup === MANUAL_HAVE;
      const signedValue = setBalanceByType(isHave, parseFloat(accountData.value));

      // Extract icon name without the "manual_account/" prefix
      const iconName = selectedIcon.replace('manual_account/', '');

      await manualAccountApi.createManualAccount(customerId, {
        manualAccountType: selectedType,
        name: accountData.name,
        value: signedValue,
        currencyCode: accountData.currencyCode,
        accountIcon: iconName,
      });

      // Reload accounts data
      await loadAggregate();

      // Navigate back to accounts page
      router.push('/app/accounts');
    } catch (err: any) {
      console.error('Failed to create manual account:', err);
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
      setSubmitting(false);
    }
  };

  // Get selected type details
  const selectedTypeDetails = useMemo(() => {
    if (!selectedType) return null;
    const types = getAccountTypes(accountTypeGroup === MANUAL_HAVE);
    return types.find((t) => t.id === selectedType);
  }, [selectedType, accountTypeGroup]);

  return (
    <ProtectedRoute>
      <AppShell title="Add Manual Account | Vault22">
        <div className="max-w-2xl mx-auto">
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
            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              Add Manual Account
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Step {step} of 2: {step === 1 ? 'Select account type' : 'Enter account details'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center">
              <div
                className={`flex-1 h-2 rounded-full ${
                  step >= 1 ? 'bg-vault-green' : 'bg-vault-gray-200 dark:bg-vault-gray-700'
                }`}
              ></div>
              <div className="w-4"></div>
              <div
                className={`flex-1 h-2 rounded-full ${
                  step >= 2 ? 'bg-vault-green' : 'bg-vault-gray-200 dark:bg-vault-gray-700'
                }`}
              ></div>
            </div>
          </div>

          {/* Step 1: Select Have/Owe and Account Type */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Have/Owe Selection */}
              <div>
                <h2 className="text-xl font-bold text-vault-black dark:text-white mb-4">
                  This is something you
                </h2>
                <div className="space-y-3">
                  {/* Have Radio Button */}
                  <button
                    type="button"
                    onClick={() => handleAccountGroupSelect(MANUAL_HAVE)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center ${
                      accountTypeGroup === MANUAL_HAVE
                        ? 'border-vault-green bg-vault-green/10'
                        : 'border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        accountTypeGroup === MANUAL_HAVE
                          ? 'border-vault-green bg-vault-green'
                          : 'border-vault-gray-400'
                      }`}
                    >
                      {accountTypeGroup === MANUAL_HAVE && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-vault-gray-600 dark:text-vault-gray-400 font-medium">
                      {MANUAL_HAVE}
                    </span>
                  </button>

                  {/* Owe Radio Button */}
                  <button
                    type="button"
                    onClick={() => handleAccountGroupSelect(MANUAL_OWE)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center ${
                      accountTypeGroup === MANUAL_OWE
                        ? 'border-vault-green bg-vault-green/10'
                        : 'border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        accountTypeGroup === MANUAL_OWE
                          ? 'border-vault-green bg-vault-green'
                          : 'border-vault-gray-400'
                      }`}
                    >
                      {accountTypeGroup === MANUAL_OWE && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-vault-gray-600 dark:text-vault-gray-400 font-medium">
                      {MANUAL_OWE}
                    </span>
                  </button>
                </div>
              </div>

              {/* Account Type Selector */}
              {accountTypeGroup && (
                <div>
                  <h3 className="text-lg font-bold text-vault-black dark:text-white mb-4">
                    Choose an account type
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowTypeSelector(!showTypeSelector)}
                    className="w-full p-4 rounded-xl border-2 border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green transition-all flex items-center justify-between"
                  >
                    <span
                      className={
                        selectedType
                          ? 'text-vault-black dark:text-white font-semibold'
                          : 'text-vault-gray-400'
                      }
                    >
                      {selectedTypeDetails?.name || 'Choose an account type'}
                    </span>
                    <svg
                      className={`w-5 h-5 text-vault-gray-400 transition-transform ${
                        showTypeSelector ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Type Selector Dropdown */}
                  {showTypeSelector && (
                    <div className="mt-3 bg-white dark:bg-vault-gray-800 rounded-xl border border-vault-gray-200 dark:border-vault-gray-700 max-h-96 overflow-y-auto">
                      {availableAccountTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleTypeSelect(type.id)}
                          className="w-full p-4 text-left hover:bg-vault-gray-50 dark:hover:bg-vault-gray-700 transition-all border-b border-vault-gray-100 dark:border-vault-gray-700 last:border-b-0 flex items-center"
                        >
                          <div
                            className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                              selectedType === type.id
                                ? 'border-vault-green bg-vault-green'
                                : 'border-vault-gray-400'
                            }`}
                          >
                            {selectedType === type.id && (
                              <div className="w-3 h-3 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className="text-vault-black dark:text-white">{type.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Next Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!canProceedToStep2}
                  className="w-full px-6 py-4 bg-vault-green text-vault-black dark:text-white rounded-xl font-bold text-lg hover:bg-vault-green-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Enter Details */}
          {step === 2 && (
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-8">
              <div className="mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="text-vault-green hover:text-vault-green-dark flex items-center mb-4"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Change account type
                </button>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-vault-gray-100 dark:bg-vault-gray-700 rounded-xl flex items-center justify-center mr-4 p-2">
                    <Icon name={selectedIcon} size={48} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-vault-black dark:text-white">
                      {selectedTypeDetails?.name}
                    </h2>
                    <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                      {accountTypeGroup === MANUAL_HAVE ? 'Asset' : 'Liability'}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Name */}
                <div>
                  <label className="block text-sm font-semibold text-vault-black dark:text-white mb-2">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={accountData.name}
                    onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                    placeholder="Account name"
                    className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                  />
                </div>

                {/* Current Value */}
                <div>
                  <label className="block text-sm font-semibold text-vault-black dark:text-white mb-2">
                    Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={accountData.value}
                    onChange={(e) => setAccountData({ ...accountData, value: e.target.value })}
                    placeholder="Value"
                    className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                  />
                  <p className="text-xs text-vault-gray-500 mt-1">
                    Enter as a positive number (sign will be applied automatically)
                  </p>
                </div>

                {/* Account Icon Selector */}
                <div>
                  <label className="block text-sm font-semibold text-vault-black dark:text-white mb-2">
                    Account Icon
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {availableIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all p-2 ${
                          selectedIcon === icon
                            ? 'border-vault-green bg-vault-green/10 scale-105'
                            : 'border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:scale-105'
                        }`}
                      >
                        <Icon name={icon} size={32} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => router.push('/app/accounts')}
                    className="flex-1 px-6 py-3 border-2 border-vault-gray-300 dark:border-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Adding Account...' : 'Add Account'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
