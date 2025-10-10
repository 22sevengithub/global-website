// Account Grouping Logic
// Ported from Flutter mobile app: lib/presentation/accounts/acount_widgets/reorderable/account_groups_main.dart

import { Account } from '../types';

/**
 * Account Group Definition
 */
export interface AccountGroup {
  name: string;
  iconPath: string;
  sortOrder: number;
  accounts: Account[];
  total: number;
}

/**
 * Predefined account groups (matches accountGroupList from icon_map.dart)
 */
export const ACCOUNT_GROUPS = [
  { name: 'Bank', iconPath: 'bank', sortOrder: 0 },
  { name: 'Credit', iconPath: 'credit', sortOrder: 1 },
  { name: 'Investments', iconPath: 'investments', sortOrder: 2 },
  { name: 'Crypto', iconPath: 'cryptocurrency', sortOrder: 3 },
  { name: 'Loans', iconPath: 'loans', sortOrder: 4 },
  { name: 'Home loan', iconPath: 'home_loan', sortOrder: 5 },
  { name: 'Vehicle loans', iconPath: 'vehicle_loans', sortOrder: 6 },
  { name: 'Home', iconPath: 'home', sortOrder: 7 },
  { name: 'Real estate', iconPath: 'property', sortOrder: 8 },
  { name: 'Rewards', iconPath: 'rewards', sortOrder: 9 },
  { name: 'Vehicles', iconPath: 'vehicles', sortOrder: 10 },
  { name: 'Something else', iconPath: 'other', sortOrder: 11 },
];

/**
 * Get group name for account class
 * From _getGroupNameForAccountClass() in account_groups_main.dart:802-840
 */
function getGroupNameForAccountClass(accountClass: string | undefined): string | null {
  if (!accountClass) return null;

  const accountClassLower = accountClass.toLowerCase();

  switch (accountClass) {
    case 'Bank':
      return 'Bank';
    case 'Credit Card':
    case 'CreditCard':
      return 'Credit';
    case 'Reward':
    case 'Rewards':
      return 'Rewards';
    case 'Loan':
    case 'Mortgage':
      return 'Loans';
    case 'Investment':
    case 'UnitTrust':
    case 'OMInvestment':
    case 'Wealth':
    case 'WealthProduct':
    case 'WealthProducts':
      return 'Investments';
    case 'Crypto':
      return 'Crypto';
    case 'Wallet':
      return 'Something else';
    case 'Manual':
      // Manual accounts need special handling based on their type
      return null;
    default:
      // Handle goal-related account classes
      if (
        accountClassLower.includes('goal') ||
        accountClassLower.includes('invest') ||
        accountClassLower.includes('wealth')
      ) {
        return 'Investments';
      }
      return null;
  }
}

/**
 * Get group name for manual account type
 * From _getGroupNameForManualAccountType() in account_groups_main.dart:856-891
 */
function getGroupNameForManualAccountType(manualAccountType: string): string {
  switch (manualAccountType) {
    case 'Bank':
    case 'Savings':
    case 'Cash':
    case 'Deposits':
      return 'Bank';
    case 'CreditCard':
    case 'StoreCard':
      return 'Credit';
    case 'Investment':
    case 'WealthProducts':
      return 'Investments';
    case 'Crypto':
      return 'Crypto';
    case 'Loan':
    case 'VehicleLoan':
    case 'HomeLoan':
      return 'Loans';
    case 'Home':
      return 'Home';
    case 'RealEstate':
      return 'Real estate';
    case 'Vehicle':
      return 'Vehicles';
    case 'Rewards':
    case 'Reward':
      return 'Rewards';
    case 'HouseholdContents':
    case 'Jewellery':
    case 'PreciousMetals':
    case 'SomethingElse':
    default:
      return 'Something else';
  }
}

/**
 * Check if account is a crypto account
 * From account.dart:410-415
 */
function isCryptoAccount(account: Account): boolean {
  return (
    account.accountClass === 'Crypto' ||
    (account.accountClass === 'Manual' &&
      (account.manualAccountType === 'Crypto' ||
        account.accountType === 'Crypto' ||
        account.accountIcon === 'Crypto'))
  );
}

/**
 * Check if account is an investment account
 */
function isInvestmentAccount(account: Account): boolean {
  const accountClass = account.accountClass?.toLowerCase() || '';
  return (
    accountClass === 'investment' ||
    accountClass === 'unittrust' ||
    accountClass === 'ominvestment' ||
    accountClass === 'wealth' ||
    accountClass === 'wealthproduct' ||
    account.manualAccountType === 'WealthProducts' ||
    account.manualAccountType === 'Investment'
  );
}

/**
 * Assign account to appropriate group
 * From _assignAccountsToGroups() in account_groups_main.dart:233-336
 */
function getGroupNameForAccount(account: Account): string {
  // Check if this is a reward account (any variation)
  const isRewardAccount =
    account.accountClass === 'Rewards' ||
    (account.accountClass === 'Manual' &&
      (account.manualAccountType === 'Reward' || account.manualAccountType === 'Rewards'));

  // Determine the appropriate group
  if (isInvestmentAccount(account)) {
    return 'Investments';
  } else if (isRewardAccount) {
    return 'Rewards';
  } else if (isCryptoAccount(account)) {
    return 'Crypto';
  } else if (account.accountClass === 'Manual' && account.manualAccountType) {
    return getGroupNameForManualAccountType(account.manualAccountType);
  } else {
    const groupName = getGroupNameForAccountClass(account.accountClass);
    return groupName || 'Something else';
  }
}

/**
 * Group accounts by category
 * From buildAccountGroupList() in account_groups_main.dart:141-231
 */
export function groupAccounts(
  accounts: Account[],
  exchangeRates: any[],
  selectedCurrency: string
): AccountGroup[] {
  // Initialize all groups with empty accounts arrays
  const groups: Record<string, AccountGroup> = {};

  ACCOUNT_GROUPS.forEach((groupDef) => {
    groups[groupDef.name] = {
      name: groupDef.name,
      iconPath: groupDef.iconPath,
      sortOrder: groupDef.sortOrder,
      accounts: [],
      total: 0,
    };
  });

  // Filter out deactivated accounts (unless they have a goal)
  const activeAccounts = accounts.filter(
    (account) =>
      !account.deactivated ||
      (account as any).goalName !== null ||
      account.accountClass.toLowerCase().includes('goal')
  );

  // Assign each account to its group
  activeAccounts.forEach((account) => {
    const groupName = getGroupNameForAccount(account);
    if (groups[groupName]) {
      groups[groupName].accounts.push(account);
    }
  });

  // Calculate group totals and filter out empty groups
  const nonEmptyGroups: AccountGroup[] = [];

  Object.values(groups).forEach((group) => {
    if (group.accounts.length > 0) {
      // Calculate total for this group
      let total = 0;
      group.accounts.forEach((account) => {
        const haveAmount = account.have?.amount || 0;
        // TODO: Add currency conversion logic here if needed
        total += haveAmount;
      });
      group.total = total;
      nonEmptyGroups.push(group);
    }
  });

  // Sort by predefined sort order
  return nonEmptyGroups.sort((a, b) => a.sortOrder - b.sortOrder);
}
