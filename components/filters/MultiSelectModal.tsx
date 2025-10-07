import { useState, useEffect } from 'react';

interface MultiSelectItem {
  id: string;
  label: string;
  subtitle?: string;
}

interface MultiSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: MultiSelectItem[];
  selectedIds: string[];
  onApply: (selectedIds: string[]) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  clearText?: string;
}

export default function MultiSelectModal({
  isOpen,
  onClose,
  title,
  items,
  selectedIds,
  onApply,
  searchPlaceholder = 'Search...',
  showSearch = false,
  clearText = 'Clear all',
}: MultiSelectModalProps) {
  const [selected, setSelected] = useState<string[]>(selectedIds);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelected(selectedIds);
  }, [selectedIds, isOpen]);

  if (!isOpen) return null;

  // Filter items by search query
  const filteredItems = searchQuery
    ? items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const toggleItem = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allFilteredSelected = filteredItems.every(item => selected.includes(item.id));

    if (allFilteredSelected) {
      // Deselect only the filtered items (keep other selections)
      const filteredIds = filteredItems.map(item => item.id);
      setSelected(prev => prev.filter(id => !filteredIds.includes(id)));
    } else {
      // Select all filtered items (merge with existing selections)
      const newIds = filteredItems.map(item => item.id);
      setSelected(prev => Array.from(new Set([...prev, ...newIds])));
    }
  };

  const handleClear = () => {
    setSelected([]);
  };

  const handleApply = () => {
    onApply(selected);
    onClose();
  };

  const isAllSelected = filteredItems.length > 0 && filteredItems.every(item => selected.includes(item.id));

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleApply}
      />

      {/* Modal - slides up from bottom (85% height like mobile app) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-thanos-900 rounded-t-3xl shadow-2xl animate-slide-up max-h-[85vh] flex flex-col">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 dark:bg-thanos-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-thanos-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-thanos-50">{title}</h2>
          <button
            onClick={handleSelectAll}
            className="text-sm font-semibold text-vault-green hover:text-vault-green-dark transition-colors"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="px-6 py-3 border-b border-gray-200 dark:border-thanos-700">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-thanos-600 rounded-lg bg-white dark:bg-thanos-800 text-gray-900 dark:text-thanos-50 focus:ring-2 focus:ring-vault-green focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-thanos-400">
                {searchQuery ? 'No items found' : 'No items available'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <button
                  key={`filter-item-${item.id}`}
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center gap-3 py-3 px-2 hover:bg-gray-50 dark:hover:bg-thanos-800 rounded-lg transition-colors"
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      selected.includes(item.id)
                        ? 'bg-vault-green border-vault-green'
                        : 'bg-white dark:bg-thanos-800 border-vault-green'
                    }`}
                  >
                    {selected.includes(item.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-thanos-50">
                      {item.label}
                    </p>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500 dark:text-thanos-400">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200 dark:border-thanos-700 bg-white dark:bg-thanos-900">
          <button
            onClick={handleClear}
            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-thanos-600 text-gray-700 dark:text-thanos-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-thanos-800 transition-all"
          >
            {clearText}
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-3 bg-vault-green text-vault-black dark:text-white font-semibold rounded-xl hover:bg-vault-green-light transition-all shadow-lg"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
