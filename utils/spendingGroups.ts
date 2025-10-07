// Spending Group Constants and Helpers
// Matches Flutter implementation: lib/presentation/helpers/spending_group_helper.dart

/**
 * Spending Group IDs - EXACT match to mobile app
 * Source: lib/presentation/helpers/spending_group_helper.dart:14-21
 */
export const SPENDING_GROUP_IDS = {
  TRANSFER: '4d9c747850610817942e45ab',
  RECURRING: '4d9c747850610817942e45a6',
  DAY_TO_DAY: '4d9c747850610817942e45a8',
  EXCEPTIONS: '4d9c747850610817942e45ac',
  INCOME: '4d9c747850610817942e45a9',
  ISR: '5469e52e028d46ffcfcbb7ef', // Invest-Save-Repay
} as const;

/**
 * Spending Group Descriptions - EXACT match to mobile app
 * Source: lib/presentation/helpers/spending_group_helper.dart:24-31
 */
export const SPENDING_GROUP_NAMES = {
  TRANSFER: 'Transfer',
  RECURRING: 'Recurring',
  DAY_TO_DAY: 'Day-to-day',
  EXCEPTIONS: 'Exceptions',
  INCOME: 'Income',
  ISR: 'Invest-save-repay',
} as const;

/**
 * Sort Order for Budget Display
 * Source: lib/core/helpers/budget_helper.dart:7-12
 *
 * IMPORTANT: Uses IDs, not names!
 */
export const SPENDING_GROUP_SORT_ORDER: { [key: string]: number } = {
  [SPENDING_GROUP_IDS.DAY_TO_DAY]: 0,
  [SPENDING_GROUP_IDS.RECURRING]: 1,
  [SPENDING_GROUP_IDS.ISR]: 2,
  [SPENDING_GROUP_IDS.EXCEPTIONS]: 3,
  // Income and Transfer are not typically shown in budget breakdown
} as const;

/**
 * Check if a spending group is income
 * Source: lib/presentation/budget/controllers/current_budget_controller.dart:53
 */
export function isIncomeGroup(spendingGroupId: string): boolean {
  return spendingGroupId === SPENDING_GROUP_IDS.INCOME;
}

/**
 * Check if a spending group is transfer
 * Source: lib/presentation/helpers/spending_group_helper.dart:51
 */
export function isTransferGroup(spendingGroupId: string): boolean {
  return spendingGroupId === SPENDING_GROUP_IDS.TRANSFER;
}

/**
 * Get spending group icon (emoji) by ID
 */
export function getSpendingGroupIcon(spendingGroupId: string): string {
  const icons: { [key: string]: string } = {
    [SPENDING_GROUP_IDS.TRANSFER]: '↔️',
    [SPENDING_GROUP_IDS.RECURRING]: '🔄',
    [SPENDING_GROUP_IDS.DAY_TO_DAY]: '☕',
    [SPENDING_GROUP_IDS.EXCEPTIONS]: '⚡',
    [SPENDING_GROUP_IDS.INCOME]: '💵',
    [SPENDING_GROUP_IDS.ISR]: '💰',
  };
  return icons[spendingGroupId] || '📊';
}

/**
 * Get spending group color by ID
 */
export function getSpendingGroupColor(spendingGroupId: string): string {
  const colors: { [key: string]: string } = {
    [SPENDING_GROUP_IDS.TRANSFER]: 'bg-gray-500',
    [SPENDING_GROUP_IDS.RECURRING]: 'bg-purple-500',
    [SPENDING_GROUP_IDS.DAY_TO_DAY]: 'bg-blue-500',
    [SPENDING_GROUP_IDS.EXCEPTIONS]: 'bg-orange-500',
    [SPENDING_GROUP_IDS.INCOME]: 'bg-vault-green',
    [SPENDING_GROUP_IDS.ISR]: 'bg-green-600',
  };
  return colors[spendingGroupId] || 'bg-vault-gray-500';
}

/**
 * Get spending group name by ID (case-insensitive lookup)
 */
export function getSpendingGroupName(spendingGroupId: string): string {
  const idUpper = spendingGroupId.toLowerCase();

  for (const [key, id] of Object.entries(SPENDING_GROUP_IDS)) {
    if (id.toLowerCase() === idUpper) {
      return SPENDING_GROUP_NAMES[key as keyof typeof SPENDING_GROUP_NAMES];
    }
  }

  return 'Other';
}

/**
 * Get sort order for a spending group ID
 * Returns 999 for groups not in sort order (like Income, Transfer)
 */
export function getSortOrder(spendingGroupId: string): number {
  return SPENDING_GROUP_SORT_ORDER[spendingGroupId] ?? 999;
}
