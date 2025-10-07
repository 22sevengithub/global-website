// Core Data Models for Vault22 Global

export interface Money {
  amount: number;
  currencyCode: string;  // Fixed: was 'currency', should be 'currencyCode' to match Flutter
  debitOrCredit: 'debit' | 'credit';
}

export interface CustomerInfo {
  id: string;
  ttsId: string;
  email: string;
  firstname: string;
  surname: string;
  preferredName?: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  defaultCurrencyCode: string;
  defaultCurrencySymbol: string;
  dayOfMonthPaid: number;
  currentPayPeriod: number;
  timezoneOffset: number;
  investmentStylePreference?: string;
  investorClassification?: string;
}

export interface Account {
  id: string;
  ttsId: string;
  customerId: string;
  accountClass: 'Bank' | 'CreditCard' | 'Investment' | 'Crypto' | 'Loan' | 'Manual' | 'Rewards' | 'Vehicle' | 'Property';
  accountType?: string;
  name: string;
  displayName?: string;
  friendlyName?: string;
  customName?: string;
  accountIcon?: string;
  deactivated: boolean;
  isDeleted: boolean;
  currencyCode?: string;  // Added: direct currency field on account
  currentBalance?: Money;  // Made optional
  availableBalance?: Money;
  budgetBalance?: Money;
  have?: Money;  // Added: used for net worth calculation
  owe?: Money;   // Added: used for net worth calculation
  totalCreditLine?: Money;
  lastSuccessfulRefreshDate?: string;
  includeInNav: boolean;
  sortOrder: number;
}

export interface Transaction {
  id: string;
  ttsId: string;
  customerId: string;
  accountId: string;
  categoryId?: string;
  merchantId?: string;
  description: string;
  transactionDate: string;
  amount: Money;
  originalAmount?: Money;
  originalDescription?: string;
  categoryName?: string;
  merchantName?: string;
  note?: string;
  isRead: boolean;
  isManual: boolean;
  payPeriod: number;
  isParentTransaction: boolean;
  isChildTransaction: boolean;
  parentId?: string;
  isPending: boolean;
  isDeleted: boolean;
  tags?: Tag[];
}

export interface Category {
  id: string;
  ttsId: string;
  description: string;
  isCustom: boolean;
  isDeleted: boolean;
  spendingGroupId?: string;
}

export interface SpendingGroup {
  id: string;
  ttsId: string;
  description: string;
  sortOrder: number;
  groupNumber: number;
}

export interface CategoryTotal {
  id: string;
  ttsId: string;
  customerId: string;
  categoryId: string;
  spendingGroupId: string;
  categoryDescription?: string;
  spendingGroupDescription?: string;
  payPeriod: number;
  totalAmount: number;
  averageAmount?: number;
  plannedAmount?: number;
  previousPlannedAmount?: number;
  isTrackedCategory: boolean;
  isTrackedForPayPeriod: boolean;
  alertsEnabled: boolean;
  applyOnlyToCurrentPeriod: boolean;
}

export interface Goal {
  id: string;
  goalId: string;
  customerId: string;
  productId?: string;
  name: string;
  iconUrl?: string;
  goalType: string;
  targetAmount: number;
  targetDate: string;
  currentAmount: number;
  percentageComplete: number;
  wealthAccountInvestmentId?: string;
  portfolioId?: string;
  initialDeposit?: number;
  recurringDeposit?: number;
  status: 'None' | 'Continue' | 'Pending' | 'Reached';
  journeyStep: number;
  isNoGoal: boolean;
  isShariahCompliant: boolean;
  createdDate?: string;
  reachedDate?: string;
}

export interface Tag {
  id: string;
  ttsId: string;
  customerId: string;
  name: string;
  color?: string;
  isDeleted: boolean;
}

export interface Merchant {
  id: string;
  ttsId: string;
  name: string;
  isCustom: boolean;
  isDeleted: boolean;
}

export interface ExchangeRate {
  id: string;
  ttsId: string;
  date: string;
  currency: string;
  rate: number;
  cacheKey?: string;
  fetchedAt: string;
}

export interface FinancialHealthScore {
  id: string;
  ttsId: string;
  customerId: string;
  score: number;
  payPeriod: number;
  savingsScore: ScoreComponent;
  insuranceScore: ScoreComponent;
  investmentScore: ScoreComponent;
  debtScore: ScoreComponent;
  spendingScore: ScoreComponent;
  createdAt: string;
}

export interface ScoreComponent {
  score: number;
  maxScore: number;
  insights: string[];
  status: 'good' | 'warning' | 'poor';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  productType: string;
  isShariahCompliant: boolean;
  riskLevel: string;
  minimumInvestment: number;
  fees: ProductFee[];
}

export interface ProductFee {
  feeType: string;
  percentage?: number;
  fixedAmount?: number;
  description: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface Profile {
  id?: string;
  countryCode?: string;
  timezone?: string;
  idNumber?: string;
  baseCurrency?: string;
  supportedCurrencies?: Currency[];
}

export interface Aggregate {
  transactions: Transaction[];
  customerInfo: CustomerInfo;
  accounts: Account[];
  categories: Category[];
  spendingGroups: SpendingGroup[];
  merchants: Merchant[];
  exchangeRates: ExchangeRate[];
  tags: Tag[];
  categoryTotals: CategoryTotal[];
  financialHealthScores: FinancialHealthScore[];
  products: Product[];
  goals: Goal[];
  profile?: Profile;
  supportedCurrencies?: Currency[];
  baseCurrency?: string;
}

export interface BudgetBreakdown {
  spendingGroupId: string;
  spendingGroupName: string;
  actualSpending: number;
  targetAmount: number;
  categories: CategoryBudget[];
}

export interface CategoryBudget {
  categoryId: string;
  categoryName: string;
  actual: number;
  target: number | null;  // Can be null if no budget/average exists
  isTracked: boolean;
}

export interface NetWorthData {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  currency: string;
  timestamp: string;
}
