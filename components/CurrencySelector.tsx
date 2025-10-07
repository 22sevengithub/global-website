// Currency Selector Component
// Matches Flutter: presentation/settings/currency/currency_selection_page.dart

import { useState, Fragment } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useApp } from '../contexts/AppContext';
import { COMMON_CURRENCIES } from '../constants/currencies';

export default function CurrencySelector() {
  const { selectedCurrency, selectedCurrencySymbol, supportedCurrencies, setCurrency } = useCurrency();
  const { aggregate } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get supported currencies from aggregate if not in currency context yet
  // Fall back to COMMON_CURRENCIES if API doesn't provide them
  const currencies = supportedCurrencies.length > 0
    ? supportedCurrencies
    : (aggregate?.supportedCurrencies || aggregate?.profile?.supportedCurrencies || COMMON_CURRENCIES);

  // Filter currencies based on search
  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = async (currencyCode: string) => {
    await setCurrency(currencyCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Always show currency selector
  return (
    <div className="relative">
      {/* Currency Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-thanos-700 hover:bg-thanos-600 transition-colors"
      >
        <span className="text-sm font-semibold text-thanos-50">
          {selectedCurrencySymbol} {selectedCurrency}
        </span>
        <svg
          className={`w-4 h-4 text-thanos-200 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Modal */}
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery('');
            }}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 bg-thanos-800 rounded-2xl shadow-xl border border-thanos-700 z-50 overflow-hidden">
            <div className="p-4">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-thanos-50 mb-1">
                  Select Currency
                </h3>
                <p className="text-sm text-thanos-200">
                  Choose your preferred display currency
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search currencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-thanos-700 border border-thanos-600 text-thanos-50 placeholder-thanos-300 focus:outline-none focus:ring-2 focus:ring-yellow"
                />
              </div>

              {/* Currency List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCurrencies.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto mb-2 text-thanos-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                    <p className="text-thanos-200">
                      No currencies found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredCurrencies.map((currency) => {
                      const isSelected = currency.code === selectedCurrency;

                      return (
                        <button
                          key={currency.code}
                          onClick={() => handleSelect(currency.code)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                            isSelected
                              ? 'bg-yellow/10 border-2 border-yellow'
                              : 'bg-thanos-700 hover:bg-thanos-600 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${
                              isSelected
                                ? 'bg-yellow text-thanos-900'
                                : 'bg-thanos-600 text-thanos-100'
                            }`}>
                              {currency.symbol}
                            </div>
                            <div className="text-left">
                              <div className={`font-semibold ${
                                isSelected
                                  ? 'text-yellow'
                                  : 'text-thanos-50'
                              }`}>
                                {currency.code}
                              </div>
                              <div className="text-sm text-thanos-200">
                                {currency.name}
                              </div>
                            </div>
                          </div>

                          {isSelected && (
                            <svg className="w-6 h-6 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}
