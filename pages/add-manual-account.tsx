import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../contexts/AppContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { manualAccountApi } from '../services/api';

const ACCOUNT_TYPES = [
  { id: 'Bank', name: 'Bank Account', icon: '🏦', description: 'Checking or savings account' },
  { id: 'CreditCard', name: 'Credit Card', icon: '💳', description: 'Credit card account' },
  { id: 'Investment', name: 'Investment', icon: '📈', description: 'Stocks, bonds, mutual funds' },
  { id: 'Cryptocurrency', name: 'Cryptocurrency', icon: '₿', description: 'Bitcoin, Ethereum, etc.' },
  { id: 'RealEstate', name: 'Real Estate', icon: '🏠', description: 'Property or land' },
  { id: 'Loan', name: 'Loan', icon: '💰', description: 'Personal loan or mortgage' },
  { id: 'Insurance', name: 'Insurance', icon: '🛡️', description: 'Life or other insurance' },
  { id: 'Other', name: 'Other Asset', icon: '💼', description: 'Other assets or liabilities' },
];

const ACCOUNT_ICONS = ['💰', '🏦', '💳', '📈', '₿', '🏠', '🚗', '💼', '💎', '📊', '🎯', '🔒'];

export default function AddManualAccount() {
  const router = useRouter();
  const { customerInfo, loadAggregate } = useApp();
  const { selectedCurrency, supportedCurrencies } = useCurrency();

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [accountData, setAccountData] = useState({
    name: '',
    value: '',
    currencyCode: selectedCurrency,
    accountIcon: '💰',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setStep(2);
  };

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
      await manualAccountApi.createManualAccount(customerId, {
        manualAccountType: selectedType,
        name: accountData.name,
        value: parseFloat(accountData.value),
        currencyCode: accountData.currencyCode,
        accountIcon: accountData.accountIcon,
        displayType: 'Manual',
      });

      // Reload accounts data
      await loadAggregate();

      // Navigate back to accounts page
      router.push('/accounts');
    } catch (err: any) {
      console.error('Failed to create manual account:', err);
      setError(err.message || 'Failed to create account. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout title="Add Manual Account | Vault22">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/accounts" className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4">
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
              <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-vault-green' : 'bg-vault-gray-200 dark:bg-vault-gray-700'}`}></div>
              <div className="w-4"></div>
              <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-vault-green' : 'bg-vault-gray-200 dark:bg-vault-gray-700'}`}></div>
            </div>
          </div>

          {/* Step 1: Select Account Type */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACCOUNT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border-2 border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-start">
                    <div className="text-4xl mr-4 group-hover:scale-110 transition-transform">
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-vault-black dark:text-white group-hover:text-vault-green transition-colors mb-1">
                        {type.name}
                      </h3>
                      <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                        {type.description}
                      </p>
                    </div>
                    <svg className="w-6 h-6 text-vault-gray-400 group-hover:text-vault-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
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
                  <span className="text-4xl mr-4">
                    {ACCOUNT_TYPES.find(t => t.id === selectedType)?.icon}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-vault-black dark:text-white">
                      {ACCOUNT_TYPES.find(t => t.id === selectedType)?.name}
                    </h2>
                    <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                      {ACCOUNT_TYPES.find(t => t.id === selectedType)?.description}
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
                    placeholder="e.g., My Savings Account"
                    className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                  />
                </div>

                {/* Current Value */}
                <div>
                  <label className="block text-sm font-semibold text-vault-black dark:text-white mb-2">
                    Current Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={accountData.value}
                    onChange={(e) => setAccountData({ ...accountData, value: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                  />
                  <p className="text-xs text-vault-gray-500 mt-1">
                    For liabilities (loans, credit cards), enter as a positive number
                  </p>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-semibold text-vault-black dark:text-white mb-2">
                    Currency
                  </label>
                  <select
                    value={accountData.currencyCode}
                    onChange={(e) => setAccountData({ ...accountData, currencyCode: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                  >
                    {supportedCurrencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Icon */}
                <div>
                  <label className="block text-sm font-semibold text-vault-black dark:text-white mb-2">
                    Account Icon
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {ACCOUNT_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setAccountData({ ...accountData, accountIcon: icon })}
                        className={`aspect-square flex items-center justify-center text-3xl rounded-xl border-2 transition-all ${
                          accountData.accountIcon === icon
                            ? 'border-vault-green bg-vault-green/10 scale-110'
                            : 'border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green hover:scale-105'
                        }`}
                      >
                        {icon}
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
                    onClick={() => router.push('/accounts')}
                    className="flex-1 px-6 py-3 border-2 border-vault-gray-300 dark:border-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
