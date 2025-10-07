import { Transaction, Aggregate } from '../types';
import { TransactionFilterModel, QuickFilterOption } from '../types/transactionFilters';

const CAT_ID_UNCATEGORIZED = '00000000-0000-0000-0000-000000000001';

/**
 * Process transaction filters (matching Flutter app logic)
 * Applies filters in the same order as Flutter app's processFilter method
 */
export function processTransactionFilters(
  transactions: Transaction[],
  filters: TransactionFilterModel,
  aggregate: Aggregate,
  currentPayPeriod?: string
): Transaction[] {
  let query: Transaction[] = [...transactions];

  // 1. Filter by accounts
  if (filters.accounts && filters.accounts.length > 0) {
    query = query.filter((trxn) => filters.accounts!.includes(trxn.accountId));
  }

  // 2. Filter by categories
  if (filters.categories && filters.categories.length > 0) {
    query = query.filter((trxn) => filters.categories!.includes(trxn.categoryId || ''));
  }

  // 3. Filter by spending groups
  if (filters.spendingGroups && filters.spendingGroups.length > 0) {
    query = query.filter((trxn) => filters.spendingGroups!.includes(trxn.spendingGroupId || ''));
  }

  // 4. Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    query = query.filter((trxn) =>
      trxn.tags?.some((tag) => filters.tags!.includes(tag.id || tag.ttsId))
    );
  }

  // 5. Filter by pending status
  if (filters.quickFilters[QuickFilterOption.PENDING]) {
    query = query.filter((trxn) => trxn.isPending);
  }

  // 6. Filter by unseen/read status
  if (filters.quickFilters[QuickFilterOption.UNSEEN]) {
    query = query.filter((trxn) => !trxn.isRead);
  }

  // 7. Filter by uncategorized
  if (filters.quickFilters[QuickFilterOption.UNCATEGORISED]) {
    query = query.filter((trxn) => trxn.categoryId === CAT_ID_UNCATEGORIZED);
  }

  // 8. Filter by date range (or current budget overrides this)
  if (filters.fromDate && filters.toDate) {
    query = query.filter((trxn) => {
      const transactionDate = trxn.transactionDate ? new Date(trxn.transactionDate) : new Date();
      return transactionDate >= filters.fromDate! && transactionDate <= filters.toDate!;
    });
  } else {
    if (filters.fromDate) {
      query = query.filter((trxn) => {
        const transactionDate = trxn.transactionDate ? new Date(trxn.transactionDate) : new Date();
        return transactionDate >= filters.fromDate!;
      });
    }

    if (filters.toDate) {
      query = query.filter((trxn) => {
        const transactionDate = trxn.transactionDate ? new Date(trxn.transactionDate) : new Date();
        return transactionDate <= filters.toDate!;
      });
    }
  }

  // 9. Filter by current budget (pay period + exclude transfers)
  if (filters.quickFilters[QuickFilterOption.CURRENT_BUDGET] && currentPayPeriod) {
    const transferSpendingGroupId = aggregate.spendingGroups.find(
      (sg) => sg.description?.toLowerCase() === 'transfer'
    )?.id;

    query = query.filter((trxn) => {
      const notTransfer = !transferSpendingGroupId || trxn.spendingGroupId !== transferSpendingGroupId;
      const inCurrentPeriod = currentPayPeriod ? trxn.payPeriod === parseInt(currentPayPeriod) : true;
      return notTransfer && inCurrentPeriod;
    });
  }

  // 10. Filter by amount range
  if (filters.minAmount !== undefined && filters.maxAmount !== undefined) {
    query = query.filter(
      (trxn) =>
        Math.abs(trxn.amount.amount) >= filters.minAmount! &&
        Math.abs(trxn.amount.amount) <= filters.maxAmount!
    );
  } else {
    if (filters.minAmount !== undefined) {
      query = query.filter((trxn) => Math.abs(trxn.amount.amount) >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      query = query.filter((trxn) => Math.abs(trxn.amount.amount) <= filters.maxAmount!);
    }
  }

  // 11. Search filter (searches description, merchant, category, spending group, tags, and amount)
  if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
    const term = filters.searchQuery.toLowerCase();
    const termArray = term.split(' ').filter((t) => t.length > 0);

    // Try to parse as number for amount matching
    const searchAmount = parseFloat(term);
    const isValidAmount = !isNaN(searchAmount);

    query = query.filter((trxn) => {
      // Search in description (word-by-word matching like Flutter app)
      const descriptionWords = (trxn.description || '').toLowerCase().split(' ');
      const descriptionMatch = termArray.some((searchTerm) =>
        descriptionWords.includes(searchTerm)
      );

      // Search in category
      const category = aggregate.categories.find((c) => c.id === trxn.categoryId);
      const categoryMatch = category?.description.toLowerCase().includes(term) || false;

      // Search in spending group
      const spendingGroup = aggregate.spendingGroups.find((sg) => sg.id === trxn.spendingGroupId);
      const spendingGroupMatch = spendingGroup?.description?.toLowerCase().includes(term) || false;

      // Search in merchant
      const merchant = aggregate.merchants.find((m) => m.id === trxn.merchantId);
      const merchantMatch = merchant?.name?.toLowerCase().includes(term) || false;

      // Search in tags
      const transactionTags = trxn.tags || [];
      const tagMatch = transactionTags.some((tag) => {
        const tagData = aggregate.tags?.find((t) => t.id === tag.id || t.ttsId === tag.ttsId);
        return tagData?.name?.toLowerCase().includes(term) || false;
      });

      // Search by exact amount match (rounded)
      const amountMatch = isValidAmount
        ? Math.abs(trxn.amount.amount).toFixed(0) === searchAmount.toFixed(0)
        : false;

      return (
        descriptionMatch ||
        categoryMatch ||
        spendingGroupMatch ||
        merchantMatch ||
        tagMatch ||
        amountMatch
      );
    });
  }

  // 12. Sort by date (descending - newest first, matching Flutter app)
  query.sort((a, b) => {
    const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
    const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
    return dateB - dateA; // Descending order
  });

  return query;
}

/**
 * Get active filter count for display
 */
export function getActiveFilterCount(filters: TransactionFilterModel): number {
  let count = 0;

  if (filters.categories && filters.categories.length > 0) count++;
  if (filters.spendingGroups && filters.spendingGroups.length > 0) count++;
  if (filters.accounts && filters.accounts.length > 0) count++;
  if (filters.tags && filters.tags.length > 0) count++;
  if (filters.fromDate || filters.toDate) count++;
  if (filters.minAmount !== undefined || filters.maxAmount !== undefined) count++;

  // Count active quick filters
  count += Object.values(filters.quickFilters).filter((value) => value === true).length;

  return count;
}
