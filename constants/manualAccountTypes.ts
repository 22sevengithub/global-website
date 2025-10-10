// Manual Account Types Helper
// Ported from Flutter mobile app: lib/presentation/helpers/manual_account_type.dart

/**
 * Manual Account Type - "Have" vs "Owe"
 */
export const MANUAL_HAVE = 'Have';
export const MANUAL_OWE = 'Owe';

/**
 * Account types for "Have" accounts (assets)
 */
export const accountTypesHave: Record<string, string> = {
  Cash: 'Cash',
  Bank: 'Bank',
  Deposits: 'Deposits',
  Home: 'Home',
  HouseholdContents: 'Household Contents',
  Investment: 'Investment',
  Jewellery: 'Jewellery',
  Loan: 'Loan',
  PreciousMetals: 'Precious Metals',
  RealEstate: 'Real Estate',
  RetirementFund: 'Retirement Fund',
  Rewards: 'Rewards',
  Savings: 'Savings',
  Vehicle: 'Vehicle',
  SomethingElse: 'Something Else',
  Crypto: 'Crypto',
};

/**
 * Account types for "Owe" accounts (liabilities)
 */
export const accountTypesOwe: Record<string, string> = {
  Cash: 'Cash',
  CreditCard: 'Credit Card',
  StoreCard: 'Store Card',
  VehicleLoan: 'Vehicle Loan',
  HomeLoan: 'Home Loan',
  Loan: 'Loan',
  SomethingElse: 'Something Else',
};

/**
 * Mapping of account type IDs to icon file names
 * Icons are located in /public/icons/manual_account/
 */
export const accountTypeIconMapping: Record<string, string> = {
  CreditCard: 'credit_card',
  Bank: 'bank',
  Rewards: 'reward',
  Investment: 'investment',
  RealEstate: 'real_estate',
  Cash: 'cash',
  Deposits: 'deposit',
  Jewellery: 'jewel',
  RetirementFund: 'investment', // Use investment icon for retirement accounts
  Savings: 'savings',
  StoreCard: 'store_card',
  SomethingElse: 'something_else',
  Insurance: 'insurance',
  Loan: 'loans',
  Vehicle: 'vehicle',
  VehicleLoan: 'vehicle_loans',
  Crypto: 'cryptocurrency',
  Home: 'home',
  HomeLoan: 'home_loan',
  HouseholdContents: 'household_content',
  PreciousMetals: 'precious_metals',
};

/**
 * Get icon file path for an account type
 * @param accountType - Account type ID (e.g., "Bank", "CreditCard")
 * @returns Icon file path (e.g., "manual_account/bank" or "manual_account/default")
 */
export function getAccountTypeIcon(accountType: string): string {
  const iconName = accountTypeIconMapping[accountType];
  if (!iconName) {
    return 'manual_account/default'; // Fallback to default icon
  }

  // Savings is the only SVG, all others are PNG
  return `manual_account/${iconName}`;
}

/**
 * Get display name for an account type
 * @param accountType - Account type ID
 * @param isHave - Whether this is a "Have" or "Owe" account
 * @returns Display name (e.g., "Bank" -> "Bank", "CreditCard" -> "Credit Card")
 */
export function getAccountTypeDisplayName(
  accountType: string,
  isHave: boolean
): string {
  const types = isHave ? accountTypesHave : accountTypesOwe;
  return types[accountType] || accountType;
}

/**
 * Get all account types for "Have" or "Owe"
 * Sorted alphabetically by display name
 */
export function getAccountTypes(isHave: boolean): Array<{ id: string; name: string }> {
  const types = isHave ? accountTypesHave : accountTypesOwe;

  return Object.entries(types)
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Apply correct balance sign based on account type (Have = positive, Owe = negative)
 */
export function setBalanceByType(isHave: boolean, amount: number): number {
  if (isHave) {
    return Math.abs(amount);
  } else {
    return -Math.abs(amount);
  }
}

/**
 * Check if this is a "Have" account
 */
export function isHave(debitOrCredit: string): boolean {
  const normalized = debitOrCredit.toLowerCase();
  return normalized === 'credit' || normalized === 'have';
}

/**
 * Get all available account icons for icon selector
 * Returns all unique icons from the icon mapping
 */
export function getAvailableIcons(): string[] {
  // Get unique icon names
  const uniqueIcons = Array.from(
    new Set(Object.values(accountTypeIconMapping))
  );

  return uniqueIcons.map((icon) => `manual_account/${icon}`);
}
