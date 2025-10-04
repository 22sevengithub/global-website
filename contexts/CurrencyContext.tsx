// Currency Context for managing selected display currency
// Matches Flutter: presentation/states/currency_state_provider.dart

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency } from '../types';
import { customerApi } from '../services/api';
import { COMMON_CURRENCIES } from '../constants/currencies';

interface CurrencyContextType {
  // Selected currency for display
  selectedCurrency: string;
  selectedCurrencySymbol: string;

  // Available currencies
  supportedCurrencies: Currency[];
  baseCurrency: string;

  // Actions
  setCurrency: (currencyCode: string) => Promise<void>;
  getCurrencySymbol: (currencyCode: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('AED');
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>('د.إ');
  const [supportedCurrencies, setSupportedCurrencies] = useState<Currency[]>(COMMON_CURRENCIES);
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');

  // Load currency preferences from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    const savedSymbol = localStorage.getItem('selectedCurrencySymbol');

    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
    if (savedSymbol) {
      setSelectedCurrencySymbol(savedSymbol);
    }
  }, []);

  // Update supported currencies when aggregate data changes
  const updateSupportedCurrencies = (currencies: Currency[], base: string, defaultCurrency?: string) => {
    setSupportedCurrencies(currencies);
    setBaseCurrency(base);

    // Initialize selected currency from customerInfo if not already set
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (!savedCurrency && defaultCurrency) {
      // Use customer's default currency
      const currency = currencies.find(c => c.code === defaultCurrency);
      if (currency) {
        setSelectedCurrency(currency.code);
        setSelectedCurrencySymbol(currency.symbol);
        localStorage.setItem('selectedCurrency', currency.code);
        localStorage.setItem('selectedCurrencySymbol', currency.symbol);
      }
    }
  };

  // Change currency (updates localStorage and optionally API)
  const setCurrency = async (currencyCode: string) => {
    const currency = supportedCurrencies.find(c => c.code === currencyCode);

    if (currency) {
      setSelectedCurrency(currency.code);
      setSelectedCurrencySymbol(currency.symbol);

      // Save to localStorage
      localStorage.setItem('selectedCurrency', currency.code);
      localStorage.setItem('selectedCurrencySymbol', currency.symbol);

      // Update customer's default currency via API
      try {
        const customerId = sessionStorage.getItem('customerId');
        if (customerId) {
          await customerApi.updateCurrency(customerId, currency.code);
        }
      } catch (error) {
        console.error('Failed to update currency on server:', error);
        // Continue - local change still works
      }
    }
  };

  // Get currency symbol by code
  const getCurrencySymbol = (currencyCode: string): string => {
    const currency = supportedCurrencies.find(c => c.code === currencyCode);
    if (currency) {
      return currency.symbol;
    }

    // Fallback symbols
    const fallbackSymbols: { [key: string]: string } = {
      'AED': 'د.إ',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'SAR': '﷼',
      'ZAR': 'R',
      'CHF': 'CHF',
      'JPY': '¥',
      'CNY': '¥',
      'INR': '₹',
    };

    return fallbackSymbols[currencyCode] || currencyCode;
  };

  // Expose updateSupportedCurrencies via window for AppContext to call
  useEffect(() => {
    (window as any).__updateSupportedCurrencies = updateSupportedCurrencies;
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        selectedCurrencySymbol,
        supportedCurrencies,
        baseCurrency,
        setCurrency,
        getCurrencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
