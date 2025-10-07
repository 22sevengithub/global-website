import AppShell from '../../../../components/AppShell';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import LoadingAnimation from '../../../../components/LoadingAnimation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../../../contexts/AppContext';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { formatMoney } from '../../../../utils/currency';
import { goalsApi } from '../../../../services/api';

export default function GoalSetup() {
  const router = useRouter();
  const { goalId, goalName: queryGoalName, goalTypeId, goalTypeName, riskProfile } = router.query;
  const { aggregate, customerInfo, loading: contextLoading } = useApp();
  const { selectedCurrency } = useCurrency();

  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [recurringDeposit, setRecurringDeposit] = useState('');
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [goalName, setGoalName] = useState('');

  // Minimums (would come from API in production)
  const minimums = {
    targetAmount: 1000,
    initialDeposit: 100,
    recurringDeposit: 50,
  };

  // Calculate minimum date (7 months from now) for date input
  const getMinimumDate = () => {
    const minDate = new Date();
    minDate.setMonth(minDate.getMonth() + 7);
    return minDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  useEffect(() => {
    // Only set goal name if it hasn't been set yet
    if (!goalName) {
      if (queryGoalName) {
        setGoalName(queryGoalName as string);
      } else if (goalTypeName) {
        setGoalName(`My ${goalTypeName} Goal`);
      }
    }

    // Set default target date to 12 months from now (only once)
    if (!targetDate) {
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 12);
      setTargetDate(defaultDate.toISOString().split('T')[0]);
    }
  }, [queryGoalName, goalTypeName, goalName, targetDate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!goalName.trim()) {
      newErrors.goalName = 'Goal name is required';
    }

    const targetAmt = parseFloat(targetAmount);
    if (!targetAmount || isNaN(targetAmt) || targetAmt < minimums.targetAmount) {
      newErrors.targetAmount = `Target amount must be at least ${formatMoney(minimums.targetAmount, selectedCurrency)}`;
    }

    if (!targetDate) {
      newErrors.targetDate = 'Target date is required';
    } else {
      const selectedDate = new Date(targetDate);
      const today = new Date();
      // API requires target date to be at least 7 months in the future
      const minDate = new Date(today);
      minDate.setMonth(minDate.getMonth() + 7);

      if (selectedDate <= today) {
        newErrors.targetDate = 'Target date must be in the future';
      } else if (selectedDate < minDate) {
        newErrors.targetDate = 'Target date must be at least 7 months from now';
      }
    }

    // Initial deposit is optional but if provided must meet minimum
    if (initialDeposit) {
      const initialDep = parseFloat(initialDeposit);
      if (isNaN(initialDep)) {
        newErrors.initialDeposit = 'Invalid amount';
      } else if (initialDep > 0 && initialDep < minimums.initialDeposit) {
        newErrors.initialDeposit = `Initial deposit must be at least ${formatMoney(minimums.initialDeposit, selectedCurrency)}`;
      }
    }

    // Recurring deposit is optional but if provided must meet minimum
    if (recurringDeposit) {
      const recurringDep = parseFloat(recurringDeposit);
      if (isNaN(recurringDep)) {
        newErrors.recurringDeposit = 'Invalid amount';
      } else if (recurringDep > 0 && recurringDep < minimums.recurringDeposit) {
        newErrors.recurringDeposit = `Recurring deposit must be at least ${formatMoney(minimums.recurringDeposit, selectedCurrency)} if provided`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateProjection = () => {
    const target = parseFloat(targetAmount) || 0;
    const initial = parseFloat(initialDeposit) || 0;
    const recurring = parseFloat(recurringDeposit) || 0;
    const date = new Date(targetDate);
    const today = new Date();
    const months = Math.max(1, Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)));

    const totalRecurring = recurring * months;
    const totalSaved = initial + totalRecurring;
    const remaining = Math.max(0, target - totalSaved);
    const monthlyRequired = Math.ceil(remaining / months);

    return {
      months,
      totalSaved,
      remaining,
      monthlyRequired,
      onTrack: totalSaved >= target,
    };
  };

  const projection = targetAmount && targetDate ? calculateProjection() : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !customerInfo?.id || !goalId) {
      setErrors({ submit: 'Missing required information' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Setup goal with amounts and dates (goal already created in custom-goal step)
      // Format date as ISO 8601 with UTC timezone (matching mobile app)
      const [year, month] = targetDate.split('-');
      const targetDateUTC = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1));
      const formattedDate = targetDateUTC.toISOString(); // "2025-12-01T00:00:00.000Z"

      const setupData = {
        targetAmount: parseFloat(targetAmount),
        targetDate: formattedDate,
        initialDepositAmount: parseFloat(initialDeposit) || null,
        recurringDepositAmount: recurringDeposit ? parseFloat(recurringDeposit) : null,
      };

      await goalsApi.setupGoal(customerInfo.id, goalId as string, setupData);

      // Navigate to product recommendations
      router.push({
        pathname: '/app/goals/create/recommendations',
        query: {
          goalId: goalId,
          goalName: goalName,
          riskProfile,
          initialDeposit: initialDeposit,
          recurringDeposit: recurringDeposit || '0',
        }
      });
    } catch (err: any) {
      console.error('Failed to setup goal:', err);
      setErrors({ submit: err.response?.data?.message || 'Failed to setup goal. Please try again.' });
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (contextLoading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Goal Setup | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <LoadingAnimation size={150} />
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mt-4">Loading...</p>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppShell title="Goal Setup | Vault22">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              Goal Calculator
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Set your target and plan your investments
            </p>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-700 rounded-full h-1 mb-2">
                <div
                  className="bg-vault-green h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(4 / 6) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Step 4 of 6</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Name */}
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-6">
              <label className="block text-sm font-semibold text-vault-black dark:text-white mb-3">
                Goal Name
              </label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g., Emergency Fund"
                className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
              />
              {errors.goalName && <p className="text-red-500 text-sm mt-2">{errors.goalName}</p>}
            </div>

            {/* Target Amount */}
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-6">
              <label className="block text-sm font-semibold text-vault-black dark:text-white mb-3">
                How much is your goal?
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-vault-gray-600 dark:text-vault-gray-400">
                  {selectedCurrency}
                </span>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-16 pr-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                />
              </div>
              {errors.targetAmount && <p className="text-red-500 text-sm mt-2">{errors.targetAmount}</p>}
              <p className="text-xs text-vault-gray-500 mt-2">Minimum: {formatMoney(minimums.targetAmount, selectedCurrency)}</p>
            </div>

            {/* Target Date */}
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-6">
              <label className="block text-sm font-semibold text-vault-black dark:text-white mb-3">
                When do you want to reach your goal?
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={getMinimumDate()}
                className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
              />
              {errors.targetDate && <p className="text-red-500 text-sm mt-2">{errors.targetDate}</p>}
              <p className="text-xs text-vault-gray-500 mt-2">Minimum: 7 months from today</p>
            </div>

            {/* Initial Deposit */}
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-6">
              <label className="block text-sm font-semibold text-vault-black dark:text-white mb-3">
                Initial Deposit (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-vault-gray-600 dark:text-vault-gray-400">
                  {selectedCurrency}
                </span>
                <input
                  type="number"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-16 pr-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                />
              </div>
              {errors.initialDeposit && <p className="text-red-500 text-sm mt-2">{errors.initialDeposit}</p>}
              <p className="text-xs text-vault-gray-500 mt-2">Minimum: {formatMoney(minimums.initialDeposit, selectedCurrency)}</p>
            </div>

            {/* Recurring Deposit */}
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-6">
              <label className="block text-sm font-semibold text-vault-black dark:text-white mb-3">
                Recurring Deposit (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-vault-gray-600 dark:text-vault-gray-400">
                  {selectedCurrency}
                </span>
                <input
                  type="number"
                  value={recurringDeposit}
                  onChange={(e) => setRecurringDeposit(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-16 pr-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                />
              </div>
              {errors.recurringDeposit && <p className="text-red-500 text-sm mt-2">{errors.recurringDeposit}</p>}
              <p className="text-xs text-vault-gray-500 mt-2">Optional minimum: {formatMoney(minimums.recurringDeposit, selectedCurrency)}</p>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-vault-gray-600 dark:text-vault-gray-400 mb-2">
                  Frequency
                </label>
                <select
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
            </div>

            {/* Projection Card */}
            {projection && (
              <div className={`rounded-2xl border-2 p-6 ${projection.onTrack ? 'bg-vault-green/10 border-vault-green/30' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'}`}>
                <h3 className="font-bold text-vault-black dark:text-white mb-4">Goal Projection</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400 mb-1">Time to Goal</p>
                    <p className="text-lg font-bold text-vault-black dark:text-white">{projection.months} months</p>
                  </div>
                  <div>
                    <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400 mb-1">Total Saved</p>
                    <p className="text-lg font-bold text-vault-black dark:text-white">{formatMoney(projection.totalSaved, selectedCurrency)}</p>
                  </div>
                  {!projection.onTrack && (
                    <>
                      <div>
                        <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400 mb-1">Remaining</p>
                        <p className="text-lg font-bold text-orange-500">{formatMoney(projection.remaining, selectedCurrency)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400 mb-1">Monthly Required</p>
                        <p className="text-lg font-bold text-vault-black dark:text-white">{formatMoney(projection.monthlyRequired, selectedCurrency)}</p>
                      </div>
                    </>
                  )}
                </div>
                {projection.onTrack && (
                  <p className="text-sm text-vault-green mt-4 font-semibold">✓ You're on track to reach your goal!</p>
                )}
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="sticky bottom-0 bg-white dark:bg-vault-gray-900 py-6 border-t border-vault-gray-200 dark:border-vault-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold text-lg bg-vault-green text-vault-black dark:text-white hover:bg-vault-green-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Goal...
                  </>
                ) : (
                  'Continue to Recommendations'
                )}
              </button>
            </div>
          </form>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
