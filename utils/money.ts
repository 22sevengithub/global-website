// Money utility functions matching Flutter implementation

import { Money } from '../types';

/**
 * Convert Money object to real number with proper sign
 * Matches Flutter's Money.toRealNumber() implementation
 *
 * Returns:
 * - Positive for credit (assets)
 * - Negative for debit (liabilities)
 */
export function toRealNumber(money: Money): number {
  return money.debitOrCredit === 'debit' ? -money.amount : money.amount;
}

/**
 * Get currency code from Money object with fallback
 */
export function getCurrencyCode(money: Money, fallback: string = 'AED'): string {
  return money.currencyCode || fallback;
}

/**
 * Create a zero Money object
 */
export function createZeroMoney(currencyCode: string, debitOrCredit: 'debit' | 'credit' = 'credit'): Money {
  return {
    amount: 0,
    currencyCode,
    debitOrCredit,
  };
}
