// Spending Group Icon Mapping
// Matches Flutter implementation: lib/presentation/helpers/spending_group_helper.dart

// Spending group IDs from backend
const TRANSFER_SP_ID = "4d9c747850610817942e45ab";
const RECURRING_SP_ID = "4d9c747850610817942e45a6";
const DAY_TO_DAY_SP_ID = "4d9c747850610817942e45a8";
const EXCEPTIONS_SP_ID = "4d9c747850610817942e45ac";
const INCOME_SP_ID = "4d9c747850610817942e45a9";
const ISR_SP_ID = "5469e52e028d46ffcfcbb7ef"; // Invest-Save-Repay

// Spending group names
const TRANSFER = "Transfer";
const RECURRING = "Recurring";
const DAY_TO_DAY = "Day-to-day";
const EXCEPTIONS = "Exceptions";
const INCOME = "Income";
const INVEST_SAVE_REPAY = "Invest-Save-Repay";

/**
 * Get spending group icon path based on spending group ID or name
 * Matches Flutter: SpendingGroupHelper.getSpendingGroupIconPath()
 */
export function getSpendingGroupIcon(spendingGroupIdOrName: string | undefined): string {
  if (!spendingGroupIdOrName) {
    return '/icons/day-to-day.svg'; // Default
  }

  const sg = spendingGroupIdOrName.toLowerCase();

  // Match by ID
  switch (spendingGroupIdOrName) {
    case TRANSFER_SP_ID:
      return '/icons/transfers.svg';
    case RECURRING_SP_ID:
      return '/icons/recurring.svg';
    case DAY_TO_DAY_SP_ID:
      return '/icons/day-to-day.svg';
    case EXCEPTIONS_SP_ID:
      return '/icons/exceptions.svg';
    case INCOME_SP_ID:
      return '/icons/income.svg';
    case ISR_SP_ID:
      return '/icons/invest-save-repay.svg';
  }

  // Match by name (case-insensitive)
  if (sg.includes('transfer')) {
    return '/icons/transfers.svg';
  } else if (sg.includes('recurring')) {
    return '/icons/recurring.svg';
  } else if (sg.includes('day-to-day') || sg.includes('day to day')) {
    return '/icons/day-to-day.svg';
  } else if (sg.includes('exception')) {
    return '/icons/exceptions.svg';
  } else if (sg.includes('income')) {
    return '/icons/income.svg';
  } else if (sg.includes('invest') || sg.includes('save') || sg.includes('repay')) {
    return '/icons/invest-save-repay.svg';
  }

  // Default fallback
  return '/icons/day-to-day.svg';
}

/**
 * Get spending group color based on spending group ID
 * Matches Flutter: SpendingGroupHelper.getColorById()
 */
export function getSpendingGroupColor(spendingGroupId: string | undefined): string {
  if (!spendingGroupId) {
    return '#27c5b8'; // Default bulbasaur color
  }

  switch (spendingGroupId) {
    case TRANSFER_SP_ID:
      return '#599ef7'; // sonic (blue)
    case RECURRING_SP_ID:
      return '#fd924b'; // garfield (orange)
    case DAY_TO_DAY_SP_ID:
      return '#27c5b8'; // bulbasaur (teal)
    case EXCEPTIONS_SP_ID:
      return '#fd7a7c'; // peach (red)
    case INCOME_SP_ID:
      return '#89e35e'; // kermit (green)
    case ISR_SP_ID:
      return '#9b59b6'; // dumbledore (purple)
    default:
      return '#27c5b8'; // Default bulbasaur
  }
}

/**
 * Get account type icon path
 * Matches Flutter: lib/presentation/helpers/icon_map.dart
 */
export function getAccountTypeIcon(accountType: string | undefined): string {
  if (!accountType) {
    return '/icons/other.svg';
  }

  const type = accountType.toLowerCase();

  if (type.includes('bank')) {
    return '/icons/bank.svg';
  } else if (type.includes('credit')) {
    return '/icons/credit.svg';
  } else if (type.includes('investment')) {
    return '/icons/investments.png';
  } else if (type.includes('crypto')) {
    return '/icons/cryptocurrency.svg';
  } else if (type.includes('loan') && type.includes('home')) {
    return '/icons/home_loan.png';
  } else if (type.includes('loan') && type.includes('vehicle')) {
    return '/icons/vehicle_loans.png';
  } else if (type.includes('loan')) {
    return '/icons/loans.svg';
  } else if (type.includes('home') || type.includes('property') || type.includes('real estate')) {
    return '/icons/property.svg';
  } else if (type.includes('reward')) {
    return '/icons/rewards.svg';
  } else if (type.includes('vehicle')) {
    return '/icons/vehicles.svg';
  } else if (type.includes('retirement')) {
    return '/icons/retirement.svg';
  } else {
    return '/icons/other.svg';
  }
}
