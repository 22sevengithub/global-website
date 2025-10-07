// Budget Calculation Logic
// Matches Flutter implementation: lib/core/helpers/budget_helper.dart

import { CategoryTotal, BudgetBreakdown } from '../types';
import { isIncomeGroup, getSortOrder } from './spendingGroups';

/**
 * Get budgeted or average amount for a category
 * Source: lib/core/helpers/budget_helper.dart:51-58
 *
 * IMPORTANT: Returns NULL (not 0) when no budget exists!
 */
export function getBudgetedOrAverageAmount(categoryTotal: CategoryTotal): number | null {
  // If tracked for this period and has a planned amount, use that
  if (categoryTotal.isTrackedForPayPeriod && categoryTotal.plannedAmount != null) {
    return categoryTotal.plannedAmount;
  }

  // Otherwise, use historical average if available
  if (categoryTotal.averageAmount != null) {
    return categoryTotal.averageAmount;
  }

  // No budget or average - return NULL, not 0
  return null;
}

/**
 * Filter categories that have values (budget OR spending)
 * Source: lib/core/helpers/budget_helper.dart:14-23
 *
 * Shows categories where: (budgetOrAverage > 0) OR (totalAmount > 0)
 */
export function getCategoriesWithValues(categoryTotals: CategoryTotal[]): CategoryTotal[] {
  return categoryTotals.filter(ct => {
    const budgetOrAverage = getBudgetedOrAverageAmount(ct);

    // Include if: (budgetOrAverage > 0) OR (totalAmount > 0)
    if ((budgetOrAverage != null && budgetOrAverage > 0) ||
        (ct.totalAmount != null && ct.totalAmount > 0)) {
      return true;
    }
    return false;
  });
}

/**
 * Get all spending groups with their totals
 * Source: lib/core/helpers/budget_helper.dart:14-48
 *
 * IMPORTANT: Uses ID-based sorting, not name-based!
 */
export function getAllWithValues(
  categoryTotals: CategoryTotal[]
): Array<{
  payPeriod: number;
  spendingGroupId: string;
  spendingGroupDescription: string;
  actual: number;
  target: number;
  categories: CategoryTotal[];
  sortOrder: number;
}> {
  // First, filter to only categories with values
  const filtered = getCategoriesWithValues(categoryTotals);

  // Group by spending group
  const spendingGroupTotals: {
    [key: string]: {
      payPeriod: number;
      spendingGroupId: string;
      spendingGroupDescription: string;
      actual: number;
      target: number;
      categories: CategoryTotal[];
      sortOrder: number;
    };
  } = {};

  for (const catTotal of filtered) {
    const groupId = catTotal.spendingGroupId;

    if (spendingGroupTotals[groupId]) {
      // Add to existing group
      spendingGroupTotals[groupId].actual += catTotal.totalAmount;
      spendingGroupTotals[groupId].target += Math.floor(getBudgetedOrAverageAmount(catTotal) ?? 0);
      spendingGroupTotals[groupId].categories.push(catTotal);
    } else {
      // Create new group
      spendingGroupTotals[groupId] = {
        payPeriod: catTotal.payPeriod,
        spendingGroupId: groupId,
        spendingGroupDescription: catTotal.spendingGroupDescription || '',
        actual: catTotal.totalAmount,
        target: getBudgetedOrAverageAmount(catTotal) ?? 0,
        categories: [catTotal],
        sortOrder: getSortOrder(groupId), // Use ID-based sort order!
      };
    }
  }

  // Convert to array and sort by ID-based order
  const groups = Object.values(spendingGroupTotals);
  groups.sort((a, b) => a.sortOrder - b.sortOrder);

  return groups;
}

/**
 * Get budget breakdown by spending group
 * Source: lib/core/helpers/budget_helper.dart:14-48
 */
export function getBudgetBreakdown(
  categoryTotals: CategoryTotal[],
  payPeriod: number
): BudgetBreakdown[] {
  // Filter to current pay period
  const currentPeriodTotals = categoryTotals.filter(
    ct => ct.payPeriod === payPeriod
  );

  // Get all spending groups with values
  const spendingGroupData = getAllWithValues(currentPeriodTotals);

  // Map to BudgetBreakdown format
  return spendingGroupData.map(group => ({
    spendingGroupId: group.spendingGroupId,
    spendingGroupName: group.spendingGroupDescription,
    actualSpending: group.actual,
    targetAmount: group.target,
    categories: group.categories.map(ct => ({
      categoryId: ct.categoryId,
      categoryName: ct.categoryDescription || '',
      actual: ct.totalAmount,
      target: getBudgetedOrAverageAmount(ct),
      isTracked: ct.isTrackedForPayPeriod,
    })),
  }));
}

/**
 * Calculate current budget breakdown (totals)
 * Source: lib/presentation/budget/controllers/current_budget_controller.dart:40-61
 *
 * CRITICAL: Excludes income from totals!
 */
export function getCurrentBudgetBreakdown(
  categoryTotals: CategoryTotal[],
  currentPayPeriod: number
): {
  totalSpent: number;
  totalBudgeted: number;
  remaining: number;
  zeroBasedRemaining: number;
  overspend: number;
  isOverspend: boolean;
  percentUsed: number;
  maxAmount: number;
} {
  // Get categories for current pay period
  const currentPeriodTotals = categoryTotals.filter(
    ct => ct.payPeriod === currentPayPeriod
  );

  // Get spending groups with values
  const spendingGroupDictionary = getAllWithValues(currentPeriodTotals);

  let spentSoFar = 0;
  let budgetedTotal = 0;

  // CRITICAL: Exclude income from budget totals
  // Source: lib/presentation/budget/controllers/current_budget_controller.dart:52-56
  for (const element of spendingGroupDictionary) {
    if (!isIncomeGroup(element.spendingGroupId)) {
      budgetedTotal += element.target;
      spentSoFar += element.actual;
    }
  }

  const remaining = budgetedTotal - spentSoFar;
  const zeroBasedRemaining = remaining < 0 ? 0 : remaining;
  const overspend = spentSoFar - budgetedTotal;
  const isOverspend = spentSoFar > budgetedTotal;
  const maxAmount = Math.max(budgetedTotal, spentSoFar);
  const percentUsed = maxAmount > 0 ? (spentSoFar / maxAmount) * 100 : 0;

  return {
    totalSpent: spentSoFar,
    totalBudgeted: budgetedTotal,
    remaining,
    zeroBasedRemaining,
    overspend,
    isOverspend,
    percentUsed,
    maxAmount,
  };
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
    'on-track': 'text-vault-green',
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
    'on-track': 'bg-vault-green',
  };

  return colorMap[alertLevel] || 'bg-vault-gray-400';
}

/**
 * Calculate total budget for period
 */
export function calculateTotalBudget(
  categoryTotals: CategoryTotal[],
  payPeriod: number
): {
  totalPlanned: number;
  totalSpent: number;
  remaining: number;
  percentUsed: number;
} {
  const breakdown = getCurrentBudgetBreakdown(categoryTotals, payPeriod);

  return {
    totalPlanned: breakdown.totalBudgeted,
    totalSpent: breakdown.totalSpent,
    remaining: breakdown.remaining,
    percentUsed: breakdown.percentUsed,
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
  const totalSpending = currentPeriodTotals.reduce(
    (sum, ct) => sum + ct.totalAmount,
    0
  );

  // Map to category spending with percentages
  const categorySpending = currentPeriodTotals.map(ct => ({
    categoryName: ct.categoryDescription || 'Uncategorized',
    amount: ct.totalAmount,
    percentage: totalSpending > 0 ? (ct.totalAmount / totalSpending) * 100 : 0,
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

/**
 * Get total budgeted amount for a pay period
 * (Alias for calculateTotalBudget for backward compatibility)
 */
export function getTotalBudgetForPeriod(
  categoryTotals: CategoryTotal[],
  payPeriod: number
): number {
  const result = calculateTotalBudget(categoryTotals, payPeriod);
  return result.totalPlanned;
}
