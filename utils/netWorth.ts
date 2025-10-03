// Net Worth Calculation Utilities

import { Account, ExchangeRate, NetWorthData } from '../types';
import { convertCurrency } from './currency';

/**
 * Calculate net worth from accounts
 */
export function calculateNetWorth(
  accounts: Account[],
  targetCurrency: string,
  exchangeRates: ExchangeRate[]
): NetWorthData {
  let totalAssets = 0;
  let totalLiabilities = 0;

  for (const account of accounts) {
    if (account.deactivated || account.isDeleted) {
      continue;
    }

    const balance = account.currentBalance.amount;
    const currency = account.currentBalance.currency;

    // Convert to target currency
    const convertedBalance = convertCurrency(
      Math.abs(balance),
      currency,
      targetCurrency,
      exchangeRates
    );

    if (convertedBalance === null) {
      console.warn(`Failed to convert balance for account ${account.name}`);
      continue;
    }

    // Asset accounts (positive balance means we have money)
    if (isAssetAccount(account)) {
      if (balance > 0) {
        totalAssets += convertedBalance;
      } else {
        // Negative balance on asset account (overdraft)
        totalLiabilities += convertedBalance;
      }
    }
    // Liability accounts (negative balance means we owe money)
    else if (isLiabilityAccount(account)) {
      if (balance < 0) {
        totalLiabilities += convertedBalance;
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
    if (account.deactivated || account.isDeleted || !isAssetAccount(account)) {
      continue;
    }

    if (account.currentBalance.amount <= 0) {
      continue;
    }

    const convertedBalance = convertCurrency(
      account.currentBalance.amount,
      account.currentBalance.currency,
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
    if (account.deactivated || account.isDeleted || !isLiabilityAccount(account)) {
      continue;
    }

    if (account.currentBalance.amount >= 0) {
      continue;
    }

    const convertedBalance = convertCurrency(
      Math.abs(account.currentBalance.amount),
      account.currentBalance.currency,
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
