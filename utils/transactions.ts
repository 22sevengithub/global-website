// Transaction utilities

import { Transaction, Category, Merchant } from '../types';

/**
 * Auto-categorize transaction based on merchant and description
 */
export function autoCategorizTransaction(
  transaction: Transaction,
  merchants: Merchant[],
  categories: Category[]
): string | null {
  // Check if merchant has a default category (would need merchant-category mapping)
  if (transaction.merchantId) {
    const merchant = merchants.find(m => m.id === transaction.merchantId);
    // In real implementation, merchants would have default category IDs
    // For now, return null
  }

  // Categorize based on description keywords
  const description = transaction.description.toLowerCase();

  // Define keyword-to-category mappings
  const categoryKeywords: { [key: string]: string[] } = {
    'Groceries': ['grocery', 'supermarket', 'whole foods', 'trader joe', 'safeway', 'walmart'],
    'Dining': ['restaurant', 'cafe', 'starbucks', 'mcdonald', 'pizza', 'burger'],
    'Transportation': ['uber', 'lyft', 'gas', 'shell', 'chevron', 'parking', 'transit'],
    'Entertainment': ['netflix', 'spotify', 'movie', 'theater', 'game'],
    'Shopping': ['amazon', 'target', 'online', 'store'],
    'Health': ['pharmacy', 'doctor', 'hospital', 'gym', 'fitness'],
    'Utilities': ['electric', 'water', 'internet', 'phone', 'utility']
  };

  // Find matching category
  for (const [categoryName, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => description.includes(keyword))) {
      const category = categories.find(c => c.description === categoryName);
      if (category) {
        return category.id;
      }
    }
  }

  return null;
}

/**
 * Validate split transaction amounts
 */
export function validateSplitAmounts(
  originalAmount: number,
  splits: Array<{ amount: number }>
): { valid: boolean; error?: string } {
  const totalSplitAmount = splits.reduce((sum, split) => sum + split.amount, 0);

  if (Math.abs(totalSplitAmount - originalAmount) > 0.01) {
    return {
      valid: false,
      error: `Split amounts (${totalSplitAmount}) must equal original amount (${originalAmount})`
    };
  }

  if (splits.some(split => split.amount <= 0)) {
    return {
      valid: false,
      error: 'Split amounts must be greater than zero'
    };
  }

  return { valid: true };
}

/**
 * Filter transactions by criteria
 */
export function filterTransactions(
  transactions: Transaction[],
  filters: {
    accountId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    searchTerm?: string;
    tagId?: string;
  }
): Transaction[] {
  return transactions.filter(txn => {
    // Account filter
    if (filters.accountId && txn.accountId !== filters.accountId) {
      return false;
    }

    // Category filter
    if (filters.categoryId && txn.categoryId !== filters.categoryId) {
      return false;
    }

    // Date range filter
    if (filters.startDate && txn.transactionDate < filters.startDate) {
      return false;
    }
    if (filters.endDate && txn.transactionDate > filters.endDate) {
      return false;
    }

    // Amount range filter
    const amount = Math.abs(txn.amount.amount);
    if (filters.minAmount !== undefined && amount < filters.minAmount) {
      return false;
    }
    if (filters.maxAmount !== undefined && amount > filters.maxAmount) {
      return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesDescription = txn.description.toLowerCase().includes(searchLower);
      const matchesMerchant = txn.merchantName?.toLowerCase().includes(searchLower);
      const matchesCategory = txn.categoryName?.toLowerCase().includes(searchLower);

      if (!matchesDescription && !matchesMerchant && !matchesCategory) {
        return false;
      }
    }

    // Tag filter
    if (filters.tagId && !txn.tags?.some(tag => tag.id === filters.tagId)) {
      return false;
    }

    return true;
  });
}

/**
 * Group transactions by date
 */
export function groupTransactionsByDate(transactions: Transaction[]): {
  [date: string]: Transaction[];
} {
  const grouped: { [date: string]: Transaction[] } = {};

  for (const txn of transactions) {
    const date = txn.transactionDate.split('T')[0]; // Get date part only
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(txn);
  }

  // Sort transactions within each date by time (descending)
  for (const date in grouped) {
    grouped[date].sort((a, b) =>
      new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
    );
  }

  return grouped;
}

/**
 * Calculate transaction totals
 */
export function calculateTransactionTotals(transactions: Transaction[]): {
  income: number;
  expenses: number;
  netCashFlow: number;
} {
  let income = 0;
  let expenses = 0;

  for (const txn of transactions) {
    if (txn.amount.debitOrCredit === 'credit') {
      income += txn.amount.amount;
    } else {
      expenses += Math.abs(txn.amount.amount);
    }
  }

  const netCashFlow = income - expenses;

  return { income, expenses, netCashFlow };
}
