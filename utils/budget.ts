// Budget Calculation Logic

import { CategoryTotal, BudgetBreakdown, CategoryBudget } from '../types';

/**
 * Get budget breakdown by spending group for the current pay period
 */
export function getBudgetBreakdown(
  categoryTotals: CategoryTotal[],
  payPeriod: number
): BudgetBreakdown[] {
  // Filter for current period and non-deleted
  const currentPeriodTotals = categoryTotals.filter(
    ct => ct.payPeriod === payPeriod && !ct.spendingGroupId
  );

  // Group by spending group
  const groupedBySpendingGroup: { [key: string]: BudgetBreakdown } = {};

  for (const categoryTotal of currentPeriodTotals) {
    const groupId = categoryTotal.spendingGroupId;

    if (!groupedBySpendingGroup[groupId]) {
      groupedBySpendingGroup[groupId] = {
        spendingGroupId: groupId,
        spendingGroupName: categoryTotal.spendingGroupDescription || '',
        actualSpending: 0,
        targetAmount: 0,
        categories: []
      };
    }

    // Calculate budget or average for this category
    const budgetOrAverage = getBudgetedOrAverageAmount(categoryTotal);

    // Only include if has budget/average OR actual spending
    if (budgetOrAverage > 0 || categoryTotal.totalAmount > 0) {
      groupedBySpendingGroup[groupId].actualSpending += categoryTotal.totalAmount;
      groupedBySpendingGroup[groupId].targetAmount += (budgetOrAverage || 0);
      groupedBySpendingGroup[groupId].categories.push({
        categoryId: categoryTotal.categoryId,
        categoryName: categoryTotal.categoryDescription || '',
        actual: categoryTotal.totalAmount,
        target: budgetOrAverage,
        isTracked: categoryTotal.isTrackedForPayPeriod
      });
    }
  }

  // Convert to array and sort by predefined order
  const spendingGroups = Object.values(groupedBySpendingGroup);
  const sortOrder: { [key: string]: number } = {
    'day-to-day': 0,
    'recurring': 1,
    'invest-save-repay': 2,
    'exceptions': 3,
    'income': 4,
    'transfer': 5
  };

  spendingGroups.sort((a, b) => {
    const orderA = sortOrder[a.spendingGroupName.toLowerCase()] ?? 999;
    const orderB = sortOrder[b.spendingGroupName.toLowerCase()] ?? 999;
    return orderA - orderB;
  });

  return spendingGroups;
}

/**
 * Get budgeted or average amount for a category
 */
export function getBudgetedOrAverageAmount(categoryTotal: CategoryTotal): number {
  // If tracked for this period and has a planned amount, use that
  if (categoryTotal.isTrackedForPayPeriod && categoryTotal.plannedAmount) {
    return categoryTotal.plannedAmount;
  }

  // Otherwise, use historical average if available
  if (categoryTotal.averageAmount) {
    return categoryTotal.averageAmount;
  }

  // No budget or average
  return 0;
}

/**
 * Calculate budget progress percentage
 */
export function calculateBudgetProgress(actual: number, target: number): number {
  if (!target || target === 0) return 0;
  return (actual / target) * 100;
}

/**
 * Check budget alert level
 */
export function getBudgetAlertLevel(
  actual: number,
  target: number
): 'over-budget' | 'warning-80' | 'warning-50' | 'on-track' {
  const percentage = calculateBudgetProgress(actual, target);

  if (percentage >= 100) return 'over-budget';
  if (percentage >= 80) return 'warning-80';
  if (percentage >= 50) return 'warning-50';
  return 'on-track';
}

/**
 * Get budget status color class
 */
export function getBudgetStatusColor(alertLevel: string): string {
  const colorMap: { [key: string]: string } = {
    'over-budget': 'text-red-500',
    'warning-80': 'text-orange-500',
    'warning-50': 'text-yellow-500',
    'on-track': 'text-vault-green'
  };

  return colorMap[alertLevel] || 'text-vault-gray-600';
}

/**
 * Get budget progress bar color
 */
export function getBudgetProgressColor(alertLevel: string): string {
  const colorMap: { [key: string]: string } = {
    'over-budget': 'bg-red-500',
    'warning-80': 'bg-orange-500',
    'warning-50': 'bg-yellow-500',
    'on-track': 'bg-vault-green'
  };

  return colorMap[alertLevel] || 'bg-vault-gray-400';
}

/**
 * Calculate total budget for period
 */
export function calculateTotalBudget(categoryTotals: CategoryTotal[], payPeriod: number): {
  totalPlanned: number;
  totalSpent: number;
  remaining: number;
  percentUsed: number;
} {
  const currentPeriodTotals = categoryTotals.filter(
    ct => ct.payPeriod === payPeriod
  );

  let totalPlanned = 0;
  let totalSpent = 0;

  for (const categoryTotal of currentPeriodTotals) {
    totalPlanned += getBudgetedOrAverageAmount(categoryTotal);
    totalSpent += categoryTotal.totalAmount;
  }

  const remaining = totalPlanned - totalSpent;
  const percentUsed = totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0;

  return {
    totalPlanned,
    totalSpent,
    remaining,
    percentUsed
  };
}

/**
 * Get spending by category for a pay period
 */
export function getSpendingByCategory(
  categoryTotals: CategoryTotal[],
  payPeriod: number,
  limit?: number
): Array<{ categoryName: string; amount: number; percentage: number }> {
  const currentPeriodTotals = categoryTotals.filter(
    ct => ct.payPeriod === payPeriod && ct.totalAmount > 0
  );

  // Calculate total spending
  const totalSpending = currentPeriodTotals.reduce((sum, ct) => sum + ct.totalAmount, 0);

  // Map to category spending with percentages
  const categorySpending = currentPeriodTotals.map(ct => ({
    categoryName: ct.categoryDescription || 'Uncategorized',
    amount: ct.totalAmount,
    percentage: totalSpending > 0 ? (ct.totalAmount / totalSpending) * 100 : 0
  }));

  // Sort by amount descending
  categorySpending.sort((a, b) => b.amount - a.amount);

  // Limit if specified
  if (limit && limit > 0) {
    return categorySpending.slice(0, limit);
  }

  return categorySpending;
}

/**
 * Check if should trigger budget alert
 */
export function shouldTriggerBudgetAlert(
  actual: number,
  target: number,
  previousActual: number,
  alertsEnabled: boolean
): boolean {
  if (!alertsEnabled || !target) return false;

  const currentPercentage = (actual / target) * 100;
  const previousPercentage = (previousActual / target) * 100;

  // Trigger if crossing 50%, 80%, or 100% threshold
  const thresholds = [50, 80, 100];

  for (const threshold of thresholds) {
    if (currentPercentage >= threshold && previousPercentage < threshold) {
      return true;
    }
  }

  return false;
}
