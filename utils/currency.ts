// Currency Conversion and Money Formatting Utilities
// Matches Flutter implementation: lib/core/utils/currency_conversion_utils.dart

import { Money, ExchangeRate } from '../types';

/**
 * Convert amount from one currency to another using cross-rate calculations
 *
 * Works with exchange rates regardless of the base currency used by the API.
 * To convert from one currency to another, we use the formula:
 * convertedAmount = amount * (toCurrencyRate / fromCurrencyRate)
 *
 * Matches Flutter: CurrencyConversionUtils.convertAmount()
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: ExchangeRate[],
  date: string | null = null
): number | null {
  // Zero amount
  if (amount === 0) {
    return 0;
  }

  // Same currency, no conversion needed (case-insensitive)
  if (fromCurrency.toLowerCase() === toCurrency.toLowerCase()) {
    return amount;
  }

  // Get rates for the specific date (or current rates)
  const dateFilteredRates = filterRatesByDate(exchangeRates, date);

  // Get rates for both currencies (case-insensitive)
  const fromRate = getRateForCurrency(dateFilteredRates, fromCurrency);
  const toRate = getRateForCurrency(dateFilteredRates, toCurrency);

  if (fromRate === null || toRate === null) {
    // Silent failure like Flutter - return null instead of logging error
    return null;
  }

  // Formula: amount * (toRate / fromRate)
  const convertedAmount = amount * (toRate / fromRate);

  return convertedAmount;
}

/**
 * Convert Money object to specified target currency
 *
 * Returns new Money object in target currency, or original if conversion fails
 * Matches Flutter: CurrencyConversionUtils.convertToTargetCurrency()
 */
export function convertMoney(
  money: Money,
  toCurrency: string,
  exchangeRates: ExchangeRate[],
  date: string | null = null
): Money | null {
  if (!money || !money.currencyCode || money.amount === undefined) {
    return null;
  }

  // Already in target currency (case-insensitive)
  if (money.currencyCode.toUpperCase() === toCurrency.toUpperCase()) {
    return money;
  }

  const convertedAmount = convertCurrency(
    money.amount,
    money.currencyCode,
    toCurrency,
    exchangeRates,
    date
  );

  if (convertedAmount === null) {
    return money; // Return original if conversion fails (like Flutter)
  }

  return {
    amount: convertedAmount,
    currencyCode: toCurrency,
    debitOrCredit: money.debitOrCredit
  };
}

/**
 * Check if we have the necessary rates to perform a conversion
 *
 * Returns true if conversion is possible
 * Matches Flutter: CurrencyConversionUtils.canConvert()
 */
export function canConvert(
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: ExchangeRate[],
  date: string | null = null
): boolean {
  // Same currency (case-insensitive)
  if (fromCurrency.toLowerCase() === toCurrency.toLowerCase()) {
    return true;
  }

  const dateFilteredRates = filterRatesByDate(exchangeRates, date);
  const fromRate = getRateForCurrency(dateFilteredRates, fromCurrency);
  const toRate = getRateForCurrency(dateFilteredRates, toCurrency);

  return fromRate !== null && toRate !== null;
}

/**
 * Get exchange rate for a specific currency from the rates list
 *
 * Returns the rate for the currency, or null if not found
 * Matches Flutter: CurrencyConversionUtils._getRateForCurrency()
 */
function getRateForCurrency(
  rates: ExchangeRate[],
  currency: string
): number | null {
  const currencyLower = currency.toLowerCase();

  // Find the rate for the specified currency (case-insensitive)
  const rate = rates.find(r => r.currency.toLowerCase() === currencyLower);

  return rate?.rate ?? null;
}

/**
 * Filter exchange rates by date
 *
 * For current rates (date = null), get the most recent rates for each currency
 * For historical rates, get rates that match the specified date
 *
 * Matches Flutter: CurrencyConversionUtils._filterRatesByDate()
 */
function filterRatesByDate(
  rates: ExchangeRate[],
  date: string | null
): ExchangeRate[] {
  if (!date || date === '') {
    // For current rates, get the most recent rates for each currency
    const latestRates: { [currency: string]: ExchangeRate } = {};

    for (const rate of rates) {
      const currency = rate.currency.toLowerCase();
      const existing = latestRates[currency];

      if (!existing) {
        latestRates[currency] = rate;
      } else if (rate.date && existing.date) {
        // Compare dates - keep the newer one
        if (rate.date > existing.date) {
          latestRates[currency] = rate;
        }
      }
    }

    return Object.values(latestRates);
  } else {
    // For historical rates, get rates for the specific date
    return rates.filter(r => r.date === date);
  }
}

/**
 * Format money for display
 */
export function formatMoney(
  amount: number | null | undefined,
  currency: string = 'AED',
  locale: string = 'en-AE'
): string {
  if (amount === null || amount === undefined) {
    return '—';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format money in compact form (e.g., 1.2K, 3.5M)
 */
export function formatMoneyCompact(amount: number, currency: string = 'AED'): string {
  if (!amount) return '0';

  const absAmount = Math.abs(amount);
  let value: number, suffix: string;

  if (absAmount >= 1e9) {
    value = amount / 1e9;
    suffix = 'B';
  } else if (absAmount >= 1e6) {
    value = amount / 1e6;
    suffix = 'M';
  } else if (absAmount >= 1e3) {
    value = amount / 1e3;
    suffix = 'K';
  } else {
    return formatMoney(amount, currency);
  }

  // Determine decimal places based on value
  let decimals: number;
  if (Math.abs(value) >= 100) {
    decimals = 0;
  } else if (Math.abs(value) >= 10) {
    decimals = value % 1 === 0 ? 0 : 1;
  } else {
    decimals = value % 1 === 0 ? 0 : 2;
  }

  const formatted = value.toFixed(decimals);
  return `${formatted}${suffix}`;
}

/**
 * Parse formatted money string to number
 */
export function parseMoney(moneyString: string): number {
  if (!moneyString) return 0;

  // Remove currency symbols, commas, and spaces
  const cleaned = moneyString.replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currencyCode: string): string {
  const symbols: { [key: string]: string } = {
    'AED': 'د.إ',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'SAR': '﷼',
    'ZAR': 'R'
  };

  return symbols[currencyCode] || currencyCode;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (!total || total === 0) return 0;
  return (value / total) * 100;
}
