import { useState } from 'react';
import { SpendingGroup, Category } from '../../types';
import { getSpendingGroupIcon, getSpendingGroupColor } from '../../utils/spendingGroupIcons';
import Image from 'next/image';
import { budgetApi } from '../../services/api';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useApp } from '../../contexts/AppContext';
import { convertCurrency } from '../../utils/currency';
import { getCurrentPayPeriod } from '../../utils/payPeriod';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  spendingGroups: SpendingGroup[];
  categories: Category[];
  customerId: string;
  onSuccess: () => void;
}

export default function AddBudgetModal({
  isOpen,
  onClose,
  spendingGroups,
  categories,
  customerId,
  onSuccess,
}: AddBudgetModalProps) {
  const { selectedCurrency } = useCurrency();
  const { aggregate, customerInfo } = useApp();
  const [step, setStep] = useState(1); // 1, 2, or 3
  const [selectedSpendingGroupId, setSelectedSpendingGroupId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [budgetAmount, setBudgetAmount] = useState<string>('');
  const [onlyCurrentPeriod, setOnlyCurrentPeriod] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  // CRITICAL FIX: Categories don't have spendingGroupId field
  // We need to get unique categories from CategoryTotals for the selected spending group
  const { categoryTotals = [] } = aggregate || {};

  // Get unique category IDs from categoryTotals for this spending group
  const categoryIdsForGroup = Array.from(
    new Set(
      categoryTotals
        .filter(ct => ct.spendingGroupId === selectedSpendingGroupId)
        .map(ct => ct.categoryId)
    )
  );

  // Filter categories to only show those that exist in categoryTotals for this spending group
  const filteredCategories = categories.filter(
    cat => categoryIdsForGroup.includes(cat.id) && !cat.isDeleted
  );

  // Debug logging
  if (step === 2 && filteredCategories.length === 0) {
    console.log('[AddBudget] No categories found for spending group:', selectedSpendingGroupId);
    console.log('[AddBudget] CategoryTotals for this group:', categoryTotals.filter(ct => ct.spendingGroupId === selectedSpendingGroupId).length);
    console.log('[AddBudget] Total categories:', categories.length);
  }

  // Exclude Income spending group
  const availableSpendingGroups = spendingGroups.filter(
    sg => sg.description !== 'Income' && sg.description !== 'Transfer'
  );

  const handleSpendingGroupSelect = (spendingGroupId: string) => {
    setSelectedSpendingGroupId(spendingGroupId);
    setSelectedCategoryId(''); // Reset category selection
    setStep(2);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setStep(3);
  };

  const handleBack = () => {
    if (step === 1) {
      onClose();
    } else {
      setStep(step - 1);
      if (step === 2) {
        setSelectedCategoryId('');
      }
    }
  };

  const handleSubmit = async () => {
    const amount = parseFloat(budgetAmount);

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // CRITICAL: Convert display currency to ZAR for backend (matches mobile app)
      const DEFAULT_CURRENCY_CODE = 'ZAR';
      const amountInZar = convertCurrency(
        amount,
        selectedCurrency,
        DEFAULT_CURRENCY_CODE,
        aggregate?.exchangeRates || []
      ) || amount;

      console.log('[AddBudget] Display currency:', selectedCurrency);
      console.log('[AddBudget] Display amount:', amount);
      console.log('[AddBudget] ZAR amount (for backend):', amountInZar);

      // Get current pay period (matches mobile app)
      const dayOfMonthPaid = customerInfo?.dayOfMonthPaid || 1;
      const currentPayPeriod = getCurrentPayPeriod(dayOfMonthPaid);

      // CRITICAL FIX: Get spending group ID from selectedSpendingGroupId (not from category)
      // Categories don't have spendingGroupId field - we track it separately in the UI flow

      // Construct payload matching Flutter mobile app EXACTLY
      const trackedCategory = {
        amount: {
          amount: amountInZar,
          currencyCode: DEFAULT_CURRENCY_CODE,
          debitOrCredit: '',
        },
        isTracked: true,
        validFrom: currentPayPeriod,  // CRITICAL: Pay period field
        customerId: undefined,  // Backend fills this
        alertsEnabled: false,
        applyOnlyToCurrentPeriod: onlyCurrentPeriod,
        category: {
          id: selectedCategoryId,
          description: '',
          isDeleted: false,
          isCustom: false,
          hasPlanned: false,
        },
        spendingGroup: {
          id: selectedSpendingGroupId,  // Use the selected spending group ID from Step 1
          description: '',
        },
        id: undefined,  // Null for new budget
      };

      console.log('[AddBudget] Payload structure:', JSON.stringify(trackedCategory, null, 2));

      await budgetApi.updateTrackedCategories(customerId, trackedCategory);

      // Reset and close
      setStep(1);
      setSelectedSpendingGroupId('');
      setSelectedCategoryId('');
      setBudgetAmount('');
      setOnlyCurrentPeriod(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('[AddBudget] Error details:', err);
      console.error('[AddBudget] Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to add budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    'Choose Spending Group',
    'Choose Category',
    'Set Budget Amount',
  ];

  const progressValue = step / 3;

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal - Full screen on mobile */}
      <div className="absolute inset-0 md:top-auto md:bottom-0 md:left-0 md:right-0 bg-white dark:bg-thanos-900 md:rounded-t-3xl shadow-2xl max-h-[95vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex flex-col p-6 border-b border-gray-200 dark:border-thanos-700">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-thanos-800 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-thanos-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-thanos-50">{stepTitles[step - 1]}</h2>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-1 bg-gray-200 dark:bg-thanos-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sonic-500 to-bulbasaur-500 transition-all duration-300"
                style={{ width: `${progressValue * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-thanos-400 mt-2">
              Step {step} of 3
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Choose Spending Group */}
          {step === 1 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableSpendingGroups.map((sg) => {
                const icon = getSpendingGroupIcon(sg.id);
                const color = getSpendingGroupColor(sg.id);

                return (
                  <button
                    key={sg.id}
                    onClick={() => handleSpendingGroupSelect(sg.id)}
                    className="flex flex-col items-center p-6 rounded-2xl border-2 border-gray-200 dark:border-thanos-700 hover:border-bulbasaur-500 dark:hover:border-bulbasaur-500 transition-all duration-200 hover:scale-105 hover:shadow-lg group"
                    style={{
                      backgroundColor: `${color}10`,
                    }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Image
                        src={icon}
                        alt={sg.description}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <p className="text-sm font-semibold text-center text-gray-900 dark:text-thanos-50">
                      {sg.description}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Choose Category */}
          {step === 2 && (
            <div className="space-y-2">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-thanos-400 mb-4">
                    No categories found for this spending group
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-bulbasaur-500 hover:text-bulbasaur-600"
                  >
                    ← Go back and select different group
                  </button>
                  <div className="mt-4 text-xs text-gray-400">
                    Debug: Selected ID = {selectedSpendingGroupId}
                  </div>
                </div>
              ) : (
                filteredCategories.map((category) => {
                  // Use selectedSpendingGroupId since categories don't have spendingGroupId field
                  const color = getSpendingGroupColor(selectedSpendingGroupId);

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 dark:border-thanos-700 hover:border-bulbasaur-500 dark:hover:border-bulbasaur-500 transition-all duration-200 hover:shadow-lg group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        </div>
                        <span className="text-base font-medium text-gray-900 dark:text-thanos-50">
                          {category.description}
                        </span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Step 3: Set Budget Amount */}
          {step === 3 && (
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-thanos-200 mb-2">
                  Budget Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    autoFocus
                    className="w-full px-4 py-4 text-2xl font-bold border-2 border-gray-300 dark:border-thanos-600 rounded-xl bg-white dark:bg-thanos-800 text-gray-900 dark:text-thanos-50 focus:ring-2 focus:ring-bulbasaur-500 focus:border-transparent transition-all duration-200"
                  />
                  {error && (
                    <p className="absolute -bottom-6 left-0 text-sm text-peach-500 mt-1">
                      {error}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6 mt-8">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-thanos-700 hover:bg-gray-50 dark:hover:bg-thanos-800 cursor-pointer transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={onlyCurrentPeriod}
                    onChange={(e) => setOnlyCurrentPeriod(e.target.checked)}
                    className="w-5 h-5 text-bulbasaur-500 border-gray-300 rounded focus:ring-bulbasaur-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-thanos-200">
                    Only apply to this month
                  </span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !budgetAmount || parseFloat(budgetAmount) <= 0}
                className="w-full px-6 py-4 bg-gradient-to-r from-sonic-500 to-bulbasaur-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {loading ? 'Adding Budget...' : 'Add Budget'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
