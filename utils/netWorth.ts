// Net Worth Calculation Utilities
// Matches Flutter's NetWorthTrackingService implementation

import { Account, ExchangeRate, NetWorthData, Money } from '../types';
import { convertCurrency } from './currency';
import { toRealNumber, getCurrencyCode } from './money';

/**
 * Calculate net worth from accounts with proper currency conversion
 * Matches Flutter's calculateNetWorthWithConversion
 */
export function calculateNetWorth(
  accounts: Account[],
  targetCurrency: string,
  exchangeRates: ExchangeRate[]
): NetWorthData {
  let totalAssets = 0;
  let totalLiabilities = 0;

  for (const account of accounts) {
    // Skip deactivated or deleted accounts, and accounts not included in nav
    if (account.deactivated || account.isDeleted || !account.includeInNav) {
      continue;
    }

    const isCredit = isCreditAccount(account);

    // Process 'have' amount (assets)
    if (account.have) {
      let haveValue = toRealNumber(account.have);
      const haveCurrency = getCurrencyCode(account.have, account.currencyCode || targetCurrency);

      // Convert to target currency if needed
      if (haveCurrency.toUpperCase() !== targetCurrency.toUpperCase()) {
        const converted = convertCurrency(
          Math.abs(haveValue),
          haveCurrency,
          targetCurrency,
          exchangeRates
        );
        if (converted !== null) {
          haveValue = haveValue < 0 ? -converted : converted;
        }
      }

      if (isCredit) {
        // Credit cards: positive = debt (liability), negative = credit (asset)
        if (haveValue > 0) {
          totalLiabilities += haveValue;
        } else if (haveValue < 0) {
          totalAssets += Math.abs(haveValue);
        }
      } else {
        // Regular accounts: positive = asset, negative = liability
        if (haveValue > 0) {
          totalAssets += haveValue;
        } else {
          totalLiabilities += Math.abs(haveValue);
        }
      }
    }

    // Process 'owe' amount (liabilities)
    if (account.owe) {
      let oweValue = toRealNumber(account.owe);
      const oweCurrency = getCurrencyCode(account.owe, account.currencyCode || targetCurrency);

      // Convert to target currency if needed
      if (oweCurrency.toUpperCase() !== targetCurrency.toUpperCase()) {
        const converted = convertCurrency(
          Math.abs(oweValue),
          oweCurrency,
          targetCurrency,
          exchangeRates
        );
        if (converted !== null) {
          oweValue = oweValue < 0 ? -converted : converted;
        }
      }

      if (isCredit) {
        totalLiabilities += Math.abs(oweValue);
      } else {
        // Owe is typically negative (debit), so add absolute value to liabilities
        if (oweValue < 0) {
          totalLiabilities += Math.abs(oweValue);
        } else {
          // Rare case: owe is positive (credit), add to assets
          totalAssets += oweValue;
        }
      }
    }
  }

  const netWorth = totalAssets - totalLiabilities;

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    currency: targetCurrency,
    timestamp: new Date().toISOString()
  };
}

/**
 * Check if account is a credit account (matches Flutter's isCreditAccount)
 */
export function isCreditAccount(account: Account): boolean {
  const accountClass = account.accountClass?.toLowerCase() || '';
  const accountType = account.accountType?.toLowerCase() || '';

  return (
    accountClass === 'creditcard' ||
    accountClass === 'credit' ||
    accountType.includes('credit')
  );
}

/**
 * Check if account is an asset
 */
function isAssetAccount(account: Account): boolean {
  const assetClasses = ['Bank', 'Investment', 'Crypto', 'Manual', 'Vehicle', 'Property', 'Rewards'];
  return assetClasses.includes(account.accountClass);
}

/**
 * Check if account is a liability
 */
function isLiabilityAccount(account: Account): boolean {
  const liabilityClasses = ['CreditCard', 'Loan'];
  return liabilityClasses.includes(account.accountClass);
}

/**
 * Get assets by type
 */
export function getAssetsByType(
  accounts: Account[],
  targetCurrency: string,
  exchangeRates: ExchangeRate[]
): Array<{ type: string; value: number; percentage: number }> {
  const assetsByType: { [key: string]: number } = {};
  let totalAssets = 0;

  for (const account of accounts) {
    if (account.deactivated || account.isDeleted || !isAssetAccount(account) || !account.includeInNav) {
      continue;
    }

    // Use 'have' for proper calculation
    if (!account.have || toRealNumber(account.have) <= 0) {
      continue;
    }

    const haveValue = toRealNumber(account.have);
    const haveCurrency = getCurrencyCode(account.have, account.currencyCode || targetCurrency);

    const convertedBalance = convertCurrency(
      haveValue,
      haveCurrency,
      targetCurrency,
      exchangeRates
    );

    if (convertedBalance === null) continue;

    const type = account.accountClass;
    assetsByType[type] = (assetsByType[type] || 0) + convertedBalance;
    totalAssets += convertedBalance;
  }

  // Convert to array with percentages
  const result = Object.entries(assetsByType).map(([type, value]) => ({
    type,
    value,
    percentage: totalAssets > 0 ? (value / totalAssets) * 100 : 0
  }));

  // Sort by value descending
  result.sort((a, b) => b.value - a.value);

  return result;
}

/**
 * Get liabilities by type
 */
export function getLiabilitiesByType(
  accounts: Account[],
  targetCurrency: string,
  exchangeRates: ExchangeRate[]
): Array<{ type: string; value: number; percentage: number }> {
  const liabilitiesByType: { [key: string]: number } = {};
  let totalLiabilities = 0;

  for (const account of accounts) {
    if (account.deactivated || account.isDeleted || !isLiabilityAccount(account) || !account.includeInNav) {
      continue;
    }

    // Use 'owe' for liabilities
    if (!account.owe || toRealNumber(account.owe) >= 0) {
      continue;
    }

    const oweValue = Math.abs(toRealNumber(account.owe));
    const oweCurrency = getCurrencyCode(account.owe, account.currencyCode || targetCurrency);

    const convertedBalance = convertCurrency(
      oweValue,
      oweCurrency,
      targetCurrency,
      exchangeRates
    );

    if (convertedBalance === null) continue;

    const type = account.accountClass;
    liabilitiesByType[type] = (liabilitiesByType[type] || 0) + convertedBalance;
    totalLiabilities += convertedBalance;
  }

  // Convert to array with percentages
  const result = Object.entries(liabilitiesByType).map(([type, value]) => ({
    type,
    value,
    percentage: totalLiabilities > 0 ? (value / totalLiabilities) * 100 : 0
  }));

  // Sort by value descending
  result.sort((a, b) => b.value - a.value);

  return result;
}

/**
 * Calculate net worth trend (requires historical data)
 */
export function calculateNetWorthTrend(
  currentNetWorth: number,
  previousNetWorth: number
): {
  change: number;
  changePercentage: number;
  trending: 'up' | 'down' | 'flat';
} {
  const change = currentNetWorth - previousNetWorth;
  const changePercentage = previousNetWorth !== 0
    ? (change / Math.abs(previousNetWorth)) * 100
    : 0;

  let trending: 'up' | 'down' | 'flat' = 'flat';
  if (change > 0) trending = 'up';
  else if (change < 0) trending = 'down';

  return {
    change,
    changePercentage,
    trending
  };
}
