import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useRouter } from 'next/router';
import { useApp } from '../../contexts/AppContext';
import { customerApi } from '../../services/api';
import { useState } from 'react';
import Icon from '../../components/Icon';

// Popular currencies list (these will be shown at the top)
const popularCurrencies = ['USD', 'EUR', 'GBP', 'AED', 'ZAR', 'JPY', 'CAD', 'AUD'];

// Comprehensive currency list
const allCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
  { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب' },
  { code: 'OMR', name: 'Omani Rial', symbol: '﷼' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
];

export default function CurrencySettings() {
  const router = useRouter();
  const { customerInfo, loadAggregate } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<typeof allCurrencies[0] | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const currentCurrency = customerInfo?.defaultCurrencyCode || 'USD';

  const filteredCurrencies = allCurrencies.filter((currency) =>
    searchQuery
      ? currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const popularCurrenciesList = allCurrencies.filter((currency) =>
    popularCurrencies.includes(currency.code)
  );

  const handleCurrencyClick = (currency: typeof allCurrencies[0]) => {
    if (currency.code === currentCurrency) return; // Already selected
    setSelectedCurrency(currency);
    setShowConfirmModal(true);
  };

  const handleConfirmChange = async () => {
    if (!selectedCurrency || !customerInfo?.id) return;

    setSaving(true);
    setError('');

    try {
      await customerApi.updateCurrency(customerInfo.id, selectedCurrency.code);
      await loadAggregate();
      setShowConfirmModal(false);
      router.push('/app/settings');
    } catch (err: any) {
      console.error('Failed to update currency:', err);
      setError(err.message || 'Failed to update currency. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const CurrencyItem = ({ currency }: { currency: typeof allCurrencies[0] }) => {
    const isSelected = currency.code === currentCurrency;

    return (
      <button
        onClick={() => handleCurrencyClick(currency)}
        className={`w-full flex items-center p-4 hover:bg-vault-gray-50 dark:hover:bg-vault-gray-700 transition-all ${
          isSelected ? 'bg-vault-green/10' : ''
        }`}
      >
        <div className="w-12 h-12 bg-vault-gray-100 dark:bg-vault-gray-700 rounded-full flex items-center justify-center mr-4">
          <span className="text-lg font-bold text-vault-gray-700 dark:text-vault-gray-300">
            {currency.symbol}
          </span>
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-vault-black dark:text-white">
            {currency.code}
          </h3>
          <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
            {currency.name}
          </p>
        </div>
        {isSelected && (
          <div className="w-6 h-6 bg-vault-green rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </button>
    );
  };

  return (
    <ProtectedRoute>
      <AppShell title="Currency Settings | Vault22">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              Currency
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Select your preferred currency
            </p>
          </div>

          {/* Current Currency */}
          <div className="bg-vault-green/10 border border-vault-green/30 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <Icon name="ic_currency" size={24} className="text-vault-green mr-3" />
              <div>
                <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Current Currency</p>
                <p className="text-lg font-semibold text-vault-black dark:text-white">
                  {currentCurrency} - {allCurrencies.find((c) => c.code === currentCurrency)?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search currencies..."
                className="w-full px-4 py-3 pl-12 bg-white dark:bg-vault-gray-800 border border-vault-gray-300 dark:border-vault-gray-600 rounded-xl focus:outline-none focus:border-vault-green text-vault-black dark:text-white"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-vault-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Popular Currencies */}
          {!searchQuery && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-vault-gray-500 dark:text-vault-gray-400 uppercase tracking-wide mb-4">
                Popular Currencies
              </h2>
              <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 overflow-hidden divide-y divide-vault-gray-200 dark:divide-vault-gray-700">
                {popularCurrenciesList.map((currency) => (
                  <CurrencyItem key={currency.code} currency={currency} />
                ))}
              </div>
            </div>
          )}

          {/* All Currencies */}
          <div>
            <h2 className="text-sm font-semibold text-vault-gray-500 dark:text-vault-gray-400 uppercase tracking-wide mb-4">
              {searchQuery ? 'Search Results' : 'All Currencies'}
            </h2>
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 overflow-hidden divide-y divide-vault-gray-200 dark:divide-vault-gray-700">
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map((currency) => (
                  <CurrencyItem key={currency.code} currency={currency} />
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-vault-gray-500 dark:text-vault-gray-400">
                    No currencies found matching "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && selectedCurrency && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !saving && setShowConfirmModal(false)}
            />
            <div className="relative bg-white dark:bg-vault-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold font-display text-vault-black dark:text-white mb-3">
                  Change Currency?
                </h2>
                <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-2">
                  Are you sure you want to change your default currency to:
                </p>
                <p className="text-lg font-semibold text-vault-green mb-4">
                  {selectedCurrency.code} - {selectedCurrency.name}
                </p>
                <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-6">
                  This will update how all amounts are displayed throughout the app.
                </p>

                {error && (
                  <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => !saving && setShowConfirmModal(false)}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-vault-gray-100 dark:bg-vault-gray-700 text-vault-gray-900 dark:text-vault-gray-100 rounded-xl font-semibold hover:bg-vault-gray-200 dark:hover:bg-vault-gray-600 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmChange}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all shadow-lg disabled:opacity-50"
                  >
                    {saving ? 'Changing...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
