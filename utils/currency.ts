// Currency Conversion and Money Formatting Utilities

import { Money, ExchangeRate } from '../types';

/**
 * Convert amount from one currency to another using exchange rates
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: ExchangeRate[],
  date: string | null = null
): number | null {
  // Same currency, no conversion needed
  if (fromCurrency === toCurrency) {
    return amount;
  }

  // Zero amount
  if (amount === 0) {
    return 0;
  }

  // Filter rates by date if provided
  const rates = date ? filterRatesByDate(exchangeRates, date) : exchangeRates;

  // Get rates for both currencies
  const fromRate = rates.find(r => r.currency === fromCurrency);
  const toRate = rates.find(r => r.currency === toCurrency);

  if (!fromRate || !toRate) {
    console.error(`Missing exchange rate for ${fromCurrency} or ${toCurrency}`);
    return null;
  }

  // Cross-rate formula
  const convertedAmount = amount * (toRate.rate / fromRate.rate);

  return convertedAmount;
}

/**
 * Filter exchange rates by date
 */
function filterRatesByDate(rates: ExchangeRate[], date: string): ExchangeRate[] {
  const targetDate = new Date(date).toISOString().split('T')[0];

  // For historical dates, get exact match
  if (isHistoricalDate(date)) {
    return rates.filter(r => r.date === targetDate);
  }

  // For current/future dates, get most recent rate for each currency
  const latestRates: { [currency: string]: ExchangeRate } = {};
  for (const rate of rates) {
    if (!latestRates[rate.currency] || rate.date > latestRates[rate.currency].date) {
      latestRates[rate.currency] = rate;
    }
  }

  return Object.values(latestRates);
}

function isHistoricalDate(date: string): boolean {
  const inputDate = new Date(date);
  const now = new Date();
  return inputDate < now;
}

/**
 * Convert Money object to target currency
 */
export function convertMoney(
  money: Money,
  toCurrency: string,
  exchangeRates: ExchangeRate[],
  date: string | null = null
): Money | null {
  if (!money || !money.currency || money.amount === undefined) {
    return null;
  }

  const convertedAmount = convertCurrency(
    money.amount,
    money.currency,
    toCurrency,
    exchangeRates,
    date
  );

  if (convertedAmount === null) {
    return null;
  }

  return {
    amount: convertedAmount,
    currency: toCurrency,
    debitOrCredit: money.debitOrCredit
  };
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
