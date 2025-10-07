import { useState, useEffect } from 'react';
import { TransactionFilterModel, QuickFilterOption, getFilterChipLabel, createEmptyFilter } from '../types/transactionFilters';
import { Aggregate } from '../types';
import { formatMoney } from '../utils/currency';
import MultiSelectModal from './filters/MultiSelectModal';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: TransactionFilterModel;
  aggregate: Aggregate;
  currency: string;
  onApplyFilters: (filters: TransactionFilterModel) => void;
}

export default function AdvancedFiltersModal({
  isOpen,
  onClose,
  currentFilters,
  aggregate,
  currency,
  onApplyFilters,
}: AdvancedFiltersModalProps) {
  const [filters, setFilters] = useState<TransactionFilterModel>(currentFilters);
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [showSpendingGroupsModal, setShowSpendingGroupsModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, isOpen]);

  if (!isOpen) return null;

  const handleQuickFilterToggle = (filterKey: QuickFilterOption) => {
    setFilters({
      ...filters,
      quickFilters: {
        ...filters.quickFilters,
        [filterKey]: !filters.quickFilters[filterKey],
      },
    });
  };

  const handleClearAll = () => {
    setFilters(createEmptyFilter());
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  // Prepare data for each filter type
  console.log('RAW ACCOUNTS:', aggregate.accounts);
  console.log('RAW SPENDING GROUPS:', aggregate.spendingGroups);
  console.log('RAW CATEGORIES:', aggregate.categories);
  console.log('RAW TAGS:', aggregate.tags);

  const accountItems = aggregate.accounts
    .filter(acc => !acc.deactivated)
    .map(acc => {
      const item = {
        id: acc.ttsId || acc.id,
        label: acc.name,
        subtitle: acc.accountType || acc.accountClass,
      };
      console.log('Account item:', item);
      return item;
    })
    .filter(item => item.id); // Remove items without IDs

  const spendingGroupItems = aggregate.spendingGroups
    .map(group => {
      const item = {
        id: group.ttsId || group.id,
        label: group.description,
      };
      console.log('Spending group item:', item);
      return item;
    })
    .filter(item => item.id);

  const categoryItems = aggregate.categories
    .map(cat => {
      const item = {
        id: cat.ttsId || cat.id,
        label: cat.description,
      };
      console.log('Category item:', item);
      return item;
    })
    .filter(item => item.id);

  const tagItems = aggregate.tags
    .map(tag => {
      const item = {
        id: tag.ttsId || tag.id,
        label: `#${tag.name}`,
      };
      console.log('Tag item:', item);
      return item;
    })
    .filter(item => item.id);

  console.log('FINAL ACCOUNT ITEMS:', accountItems);
  console.log('FINAL SPENDING GROUP ITEMS:', spendingGroupItems);
  console.log('FINAL CATEGORY ITEMS:', categoryItems);
  console.log('FINAL TAG ITEMS:', tagItems);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-thanos-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-thanos-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-thanos-50">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-thanos-800 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Quick Filters */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-thanos-300 uppercase tracking-wide mb-4">
                Quick Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.values(QuickFilterOption).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => handleQuickFilterToggle(filterKey)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      filters.quickFilters[filterKey]
                        ? 'bg-bulbasaur-100 dark:bg-bulbasaur-900/30 text-bulbasaur-900 dark:text-bulbasaur-100 border-bulbasaur-500 dark:border-bulbasaur-700'
                        : 'bg-white dark:bg-thanos-800 text-gray-700 dark:text-thanos-200 border-gray-300 dark:border-thanos-600 hover:border-gray-400 dark:hover:border-thanos-500'
                    }`}
                  >
                    {getFilterChipLabel(filterKey)}
                  </button>
                ))}
              </div>
            </div>

            <Divider />

            {/* Custom Date Range */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-thanos-300 uppercase tracking-wide mb-4">
                Custom Date Range
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-thanos-200 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.fromDate ? filters.fromDate.toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        fromDate: e.target.value ? new Date(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-thanos-600 rounded-lg bg-white dark:bg-thanos-800 text-gray-900 dark:text-thanos-50 focus:ring-2 focus:ring-bulbasaur-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-thanos-200 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.toDate ? filters.toDate.toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        toDate: e.target.value ? new Date(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-thanos-600 rounded-lg bg-white dark:bg-thanos-800 text-gray-900 dark:text-thanos-50 focus:ring-2 focus:ring-bulbasaur-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <Divider />

            {/* Amount Range */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-thanos-300 uppercase tracking-wide mb-4">
                Amount Range
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-thanos-200 mb-2">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minAmount ?? ''}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-thanos-600 rounded-lg bg-white dark:bg-thanos-800 text-gray-900 dark:text-thanos-50 focus:ring-2 focus:ring-bulbasaur-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-thanos-200 mb-2">
                    Max Amount
                  </label>
                  <input
                    type="number"
                    placeholder="999999"
                    value={filters.maxAmount ?? ''}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-thanos-600 rounded-lg bg-white dark:bg-thanos-800 text-gray-900 dark:text-thanos-50 focus:ring-2 focus:ring-bulbasaur-500 focus:border-transparent"
                  />
                </div>
              </div>
              {(filters.minAmount !== undefined || filters.maxAmount !== undefined) && (
                <p className="text-sm text-gray-600 dark:text-thanos-300 mt-2">
                  {filters.minAmount !== undefined && filters.maxAmount !== undefined
                    ? `${formatMoney(filters.minAmount, currency)} - ${formatMoney(filters.maxAmount, currency)}`
                    : filters.minAmount !== undefined
                    ? `Over ${formatMoney(filters.minAmount, currency)}`
                    : `Under ${formatMoney(filters.maxAmount!, currency)}`}
                </p>
              )}
            </div>

            <Divider />

            {/* Multi-select filters preview */}
            <FilterSection
              title="Accounts"
              count={filters.accounts?.length || 0}
              onClick={() => setShowAccountsModal(true)}
            />

            <Divider />

            <FilterSection
              title="Spending Groups"
              count={filters.spendingGroups?.length || 0}
              onClick={() => setShowSpendingGroupsModal(true)}
            />

            <Divider />

            <FilterSection
              title="Categories"
              count={filters.categories?.length || 0}
              onClick={() => setShowCategoriesModal(true)}
            />

            <Divider />

            <FilterSection
              title="Tags"
              count={filters.tags?.length || 0}
              onClick={() => setShowTagsModal(true)}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-thanos-700 bg-white dark:bg-thanos-900">
            <button
              onClick={handleClearAll}
              className="px-6 py-3 text-red-600 dark:text-peach-400 font-medium hover:bg-red-50 dark:hover:bg-peach-900/20 rounded-lg transition-all"
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="px-8 py-3 bg-yellow hover:bg-yellow/90 text-thanos-950 font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filter Selection Modals */}
      <MultiSelectModal
        isOpen={showAccountsModal}
        onClose={() => setShowAccountsModal(false)}
        title="Accounts"
        items={accountItems}
        selectedIds={filters.accounts || []}
        onApply={(selectedIds) => setFilters({ ...filters, accounts: selectedIds.length > 0 ? selectedIds : undefined })}
        clearText="Clear accounts"
      />

      <MultiSelectModal
        isOpen={showSpendingGroupsModal}
        onClose={() => setShowSpendingGroupsModal(false)}
        title="Spending Groups"
        items={spendingGroupItems}
        selectedIds={filters.spendingGroups || []}
        onApply={(selectedIds) => setFilters({ ...filters, spendingGroups: selectedIds.length > 0 ? selectedIds : undefined })}
        clearText="Clear groups"
      />

      <MultiSelectModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        title="Categories"
        items={categoryItems}
        selectedIds={filters.categories || []}
        onApply={(selectedIds) => setFilters({ ...filters, categories: selectedIds.length > 0 ? selectedIds : undefined })}
        showSearch={true}
        searchPlaceholder="Search categories..."
        clearText="Clear categories"
      />

      <MultiSelectModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        title="Tags"
        items={tagItems}
        selectedIds={filters.tags || []}
        onApply={(selectedIds) => setFilters({ ...filters, tags: selectedIds.length > 0 ? selectedIds : undefined })}
        showSearch={true}
        searchPlaceholder="Search/select a tag..."
        clearText="Clear tags"
      />
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200 dark:bg-thanos-700 my-6" />;
}

interface FilterSectionProps {
  title: string;
  count: number;
  onClick: () => void;
}

function FilterSection({ title, count, onClick }: FilterSectionProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 hover:bg-gray-50 dark:hover:bg-thanos-800 rounded-lg px-2 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-base font-medium text-gray-900 dark:text-thanos-50">{title}</span>
        {count > 0 && (
          <span className="px-2 py-0.5 bg-bulbasaur-100 dark:bg-bulbasaur-900/30 text-bulbasaur-900 dark:text-bulbasaur-100 text-xs font-medium rounded-full">
            {count}
          </span>
        )}
      </div>
      <svg
        className="w-5 h-5 text-gray-400 dark:text-thanos-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
