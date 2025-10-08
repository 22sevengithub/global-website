import { useState, useEffect } from 'react';
import { CategoryTotal } from '../../types';
import { budgetApi } from '../../services/api';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useApp } from '../../contexts/AppContext';
import { convertCurrency, formatMoney } from '../../utils/currency';
import { getCurrentPayPeriod } from '../../utils/payPeriod';

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryTotal: CategoryTotal | null;
  customerId: string;
  onSuccess: () => void;
}

export default function EditBudgetModal({
  isOpen,
  onClose,
  categoryTotal,
  customerId,
  onSuccess,
}: EditBudgetModalProps) {
  const { selectedCurrency } = useCurrency();
  const { aggregate, customerInfo } = useApp();
  const [budgetAmount, setBudgetAmount] = useState<string>('');
  const [trackAgainstAverage, setTrackAgainstAverage] = useState(false);
  const [onlyCurrentPeriod, setOnlyCurrentPeriod] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && categoryTotal) {
      // Convert ZAR budget from backend to display currency
      const DEFAULT_CURRENCY_CODE = 'ZAR';
      const budgetInZar = categoryTotal.plannedAmount || 0;

      const displayBudget = convertCurrency(
        budgetInZar,
        DEFAULT_CURRENCY_CODE,
        selectedCurrency,
        aggregate?.exchangeRates || []
      ) || budgetInZar;

      setBudgetAmount(displayBudget.toFixed(2));
      setOnlyCurrentPeriod(categoryTotal.applyOnlyToCurrentPeriod || false);
      setAlertsEnabled(categoryTotal.alertsEnabled || false);
      setTrackAgainstAverage(false);
      setError('');
    }
  }, [isOpen, categoryTotal, selectedCurrency, aggregate?.exchangeRates]);

  if (!isOpen || !categoryTotal) return null;

  // Get average amount in display currency
  const DEFAULT_CURRENCY_CODE = 'ZAR';
  const averageInZar = categoryTotal.averageAmount || 0;
  const averageInDisplayCurrency = convertCurrency(
    averageInZar,
    DEFAULT_CURRENCY_CODE,
    selectedCurrency,
    aggregate?.exchangeRates || []
  ) || averageInZar;

  const handleTrackAverageToggle = (checked: boolean) => {
    setTrackAgainstAverage(checked);
    if (checked && averageInDisplayCurrency > 0) {
      setBudgetAmount(averageInDisplayCurrency.toFixed(2));
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
      // Convert display currency to ZAR for backend (matches mobile app)
      const amountInZar = convertCurrency(
        amount,
        selectedCurrency,
        DEFAULT_CURRENCY_CODE,
        aggregate?.exchangeRates || []
      ) || amount;

      console.log('[EditBudget] Display currency:', selectedCurrency);
      console.log('[EditBudget] Display amount:', amount);
      console.log('[EditBudget] ZAR amount (for backend):', amountInZar);
      console.log('[EditBudget] Alerts enabled:', alertsEnabled);

      // Get current pay period (matches mobile app)
      const dayOfMonthPaid = customerInfo?.dayOfMonthPaid || 1;
      const currentPayPeriod = getCurrentPayPeriod(dayOfMonthPaid);

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
        alertsEnabled: alertsEnabled,
        applyOnlyToCurrentPeriod: onlyCurrentPeriod,
        category: {
          id: categoryTotal.categoryId,
          description: '',
          isDeleted: false,
          isCustom: false,
          hasPlanned: false,
        },
        spendingGroup: {
          id: categoryTotal.spendingGroupId,
          description: '',
        },
        id: categoryTotal.id,  // Include budget ID for update
      };

      console.log('[EditBudget] Payload structure:', JSON.stringify(trackedCategory, null, 2));

      await budgetApi.updateTrackedCategories(customerId, trackedCategory);

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('[EditBudget] Error details:', err);
      console.error('[EditBudget] Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to update budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this budget?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get current pay period
      const dayOfMonthPaid = customerInfo?.dayOfMonthPaid || 1;
      const currentPayPeriod = getCurrentPayPeriod(dayOfMonthPaid);

      // Set isTracked to false to remove budget (matches mobile app)
      const trackedCategory = {
        amount: {
          amount: 0,
          currencyCode: DEFAULT_CURRENCY_CODE,
          debitOrCredit: '',
        },
        isTracked: false,  // CRITICAL: false to delete
        validFrom: currentPayPeriod,
        customerId: undefined,
        alertsEnabled: false,
        applyOnlyToCurrentPeriod: false,
        category: {
          id: categoryTotal.categoryId,
          description: '',
          isDeleted: false,
          isCustom: false,
          hasPlanned: false,
        },
        spendingGroup: {
          id: categoryTotal.spendingGroupId,
          description: '',
        },
        id: categoryTotal.id,  // Include ID for delete
      };

      await budgetApi.updateTrackedCategories(customerId, trackedCategory);

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('[DeleteBudget] Error details:', err);
      console.error('[DeleteBudget] Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to remove budget. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 md:top-auto md:bottom-0 md:left-0 md:right-0 bg-white dark:bg-thanos-900 md:rounded-t-3xl shadow-2xl max-h-[95vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex flex-col p-6 border-b border-gray-200 dark:border-thanos-700">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-thanos-800 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-thanos-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-thanos-50">Edit Budget</h2>
            <div className="w-10" /> {/* Spacer */}
          </div>
          <p className="text-sm text-gray-600 dark:text-thanos-300">
            {categoryTotal.categoryDescription}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-md mx-auto space-y-6">
            {/* Budget Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-thanos-200 mb-2">
                Budget Amount ({selectedCurrency})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => {
                    setBudgetAmount(e.target.value);
                    setTrackAgainstAverage(false); // Uncheck when manually editing
                  }}
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

            {/* Average Info */}
            {averageInDisplayCurrency > 0 && (
              <div className="p-4 bg-sonic-50 dark:bg-sonic-900/20 rounded-xl border border-sonic-200 dark:border-sonic-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-thanos-200">
                    3-Month Average
                  </span>
                  <span className="text-lg font-bold text-sonic-600 dark:text-sonic-400">
                    {formatMoney(averageInDisplayCurrency, selectedCurrency)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-thanos-400">
                  Based on your recent spending patterns
                </p>
              </div>
            )}

            {/* Track Against Average Checkbox */}
            {averageInDisplayCurrency > 0 && (
              <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-thanos-700 hover:bg-gray-50 dark:hover:bg-thanos-800 cursor-pointer transition-all duration-200">
                <input
                  type="checkbox"
                  checked={trackAgainstAverage}
                  onChange={(e) => handleTrackAverageToggle(e.target.checked)}
                  className="w-5 h-5 text-bulbasaur-500 border-gray-300 rounded focus:ring-bulbasaur-500"
                />
                <span className="text-sm text-gray-700 dark:text-thanos-200">
                  Track spend against average
                </span>
              </label>
            )}

            {/* Only Current Period Checkbox */}
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

            {/* Spending Alerts Toggle */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-thanos-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-thanos-200">
                    Spending Alerts
                  </p>
                  <p className="text-xs text-gray-600 dark:text-thanos-400 mt-1">
                    Get notified when you exceed this budget
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-bulbasaur-500 focus:ring-offset-2 ${
                    alertsEnabled ? 'bg-bulbasaur-500' : 'bg-gray-200 dark:bg-thanos-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      alertsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !budgetAmount || parseFloat(budgetAmount) <= 0}
                className="w-full px-6 py-4 bg-gradient-to-r from-sonic-500 to-bulbasaur-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {loading ? 'Updating...' : 'Update Budget'}
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full px-6 py-4 border-2 border-peach-500 text-peach-600 dark:text-peach-400 font-bold rounded-xl hover:bg-peach-50 dark:hover:bg-peach-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Removing...' : 'Remove Budget'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
