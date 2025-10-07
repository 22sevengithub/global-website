import { TransactionFilterModel, QuickFilterOption, getFilterChipLabel } from '../types/transactionFilters';
import { CustomerAggregate } from '../types';
import { formatMoney } from '../utils/currency';

interface FilterChipsProps {
  filters: TransactionFilterModel;
  aggregate: CustomerAggregate;
  currency: string;
  onRemoveFilter: (filterType: string, value?: any) => void;
}

export default function FilterChips({ filters, aggregate, currency, onRemoveFilter }: FilterChipsProps) {
  const chips: JSX.Element[] = [];

  // Quick filter chips
  Object.entries(filters.quickFilters).forEach(([key, value]) => {
    if (value === true) {
      const label = getFilterChipLabel(key as QuickFilterOption);
      chips.push(
        <FilterChip
          key={`quick-${key}`}
          label={label}
          onRemove={() => onRemoveFilter('quickFilter', key)}
        />
      );
    }
  });

  // Categories chip
  if (filters.categories && filters.categories.length > 0) {
    const count = filters.categories.length;
    const label = count > 1 ? `${count} categories` : `${count} category`;
    chips.push(
      <FilterChip
        key="categories"
        label={label}
        onRemove={() => onRemoveFilter('categories')}
      />
    );
  }

  // Spending groups chip
  if (filters.spendingGroups && filters.spendingGroups.length > 0) {
    const count = filters.spendingGroups.length;
    const label = count > 1 ? `${count} spending groups` : `${count} spending group`;
    chips.push(
      <FilterChip
        key="spendingGroups"
        label={label}
        onRemove={() => onRemoveFilter('spendingGroups')}
      />
    );
  }

  // Accounts chip
  if (filters.accounts && filters.accounts.length > 0) {
    const count = filters.accounts.length;
    const label = count > 1 ? `${count} accounts` : `${count} account`;
    chips.push(
      <FilterChip
        key="accounts"
        label={label}
        onRemove={() => onRemoveFilter('accounts')}
      />
    );
  }

  // Tags chip
  if (filters.tags && filters.tags.length > 0) {
    const count = filters.tags.length;
    const label = count > 1 ? `${count} tags` : `${count} tag`;
    chips.push(
      <FilterChip
        key="tags"
        label={label}
        onRemove={() => onRemoveFilter('tags')}
      />
    );
  }

  // Min amount chip
  if (filters.minAmount !== undefined) {
    chips.push(
      <FilterChip
        key="minAmount"
        label={`Over ${formatMoney(filters.minAmount, currency)}`}
        onRemove={() => onRemoveFilter('minAmount')}
      />
    );
  }

  // Max amount chip
  if (filters.maxAmount !== undefined) {
    chips.push(
      <FilterChip
        key="maxAmount"
        label={`Under ${formatMoney(filters.maxAmount, currency)}`}
        onRemove={() => onRemoveFilter('maxAmount')}
      />
    );
  }

  // Date range chips
  if (filters.fromDate && filters.toDate) {
    const fromStr = new Date(filters.fromDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const toStr = new Date(filters.toDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    chips.push(
      <FilterChip
        key="dateRange"
        label={`${fromStr} - ${toStr}`}
        onRemove={() => onRemoveFilter('dateRange')}
      />
    );
  } else {
    if (filters.fromDate) {
      const dateStr = new Date(filters.fromDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      chips.push(
        <FilterChip
          key="fromDate"
          label={`after ${dateStr}`}
          onRemove={() => onRemoveFilter('fromDate')}
        />
      );
    }

    if (filters.toDate) {
      const dateStr = new Date(filters.toDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      chips.push(
        <FilterChip
          key="toDate"
          label={`before ${dateStr}`}
          onRemove={() => onRemoveFilter('toDate')}
        />
      );
    }
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4 overflow-x-auto">
      {chips}
    </div>
  );
}

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bulbasaur-100 dark:bg-bulbasaur-900/30 text-bulbasaur-900 dark:text-bulbasaur-100 rounded-full text-sm font-medium border border-bulbasaur-200 dark:border-bulbasaur-700/40">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-bulbasaur-200 dark:hover:bg-bulbasaur-800 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
