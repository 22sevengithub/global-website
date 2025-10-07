// Transaction Filter Types (matching Flutter app implementation)

export enum QuickFilterOption {
  CURRENT_BUDGET = 'Current budget',
  PENDING = 'Pending transactions',
  UNSEEN = 'Unseen transactions',
  UNCATEGORISED = 'Uncategorized transactions',
  SUSPICIOUS = 'suspicious transactions',
}

export interface QuickFilters {
  [QuickFilterOption.CURRENT_BUDGET]: boolean;
  [QuickFilterOption.PENDING]: boolean;
  [QuickFilterOption.UNSEEN]: boolean;
  [QuickFilterOption.UNCATEGORISED]: boolean;
  [QuickFilterOption.SUSPICIOUS]: boolean;
}

export interface TransactionFilterModel {
  // Search
  searchQuery?: string;

  // Multi-select filters
  categories?: string[];
  spendingGroups?: string[];
  accounts?: string[];
  tags?: string[];

  // Date range
  fromDate?: Date;
  toDate?: Date;

  // Amount range
  minAmount?: number;
  maxAmount?: number;

  // Quick filters (boolean toggles)
  quickFilters: QuickFilters;
}

export const createEmptyFilter = (): TransactionFilterModel => ({
  quickFilters: {
    [QuickFilterOption.CURRENT_BUDGET]: false,
    [QuickFilterOption.PENDING]: false,
    [QuickFilterOption.UNSEEN]: false,
    [QuickFilterOption.UNCATEGORISED]: false,
    [QuickFilterOption.SUSPICIOUS]: false,
  },
});

export const hasActiveFilters = (filters: TransactionFilterModel): boolean => {
  return !!(
    filters.categories?.length ||
    filters.spendingGroups?.length ||
    filters.tags?.length ||
    filters.accounts?.length ||
    filters.fromDate ||
    filters.toDate ||
    filters.maxAmount !== undefined ||
    filters.minAmount !== undefined ||
    filters.searchQuery ||
    Object.values(filters.quickFilters).some((value) => value === true)
  );
};

export const getFilterChipLabel = (filterKey: QuickFilterOption): string => {
  switch (filterKey) {
    case QuickFilterOption.CURRENT_BUDGET:
      return 'Current Budget';
    case QuickFilterOption.PENDING:
      return 'Pending';
    case QuickFilterOption.UNSEEN:
      return 'Unseen';
    case QuickFilterOption.UNCATEGORISED:
      return 'Uncategorised';
    case QuickFilterOption.SUSPICIOUS:
      return 'Suspicious';
    default:
      return filterKey;
  }
};
