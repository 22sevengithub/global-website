// Core Data Models for Vault22 Global

export interface Money {
  amount: number;
  currencyCode: string;  // Fixed: was 'currency', should be 'currencyCode' to match Flutter
  debitOrCredit: 'debit' | 'credit';
}

export interface Address {
  line1?: string;
  line2?: string;
  suburb?: string;
  streetNumber?: string;
  road?: string;
  province?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface NotificationSubscription {
  isSpendingAlertsEnabled?: string | boolean;
  isAccountUpdateEnabled?: string | boolean;
  isUnseenTransactionEnabled?: string | boolean;
  isNudgesEnabled?: string | boolean;
  isGeneralEnabled?: string | boolean;
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
  address?: Address;
  notificationSubscription?: NotificationSubscription;
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
  providerLoginId?: string;  // Added: Used to identify account provider ("ULTRA THINK" for manual accounts)
  serviceProviderId?: string;  // Added: Service provider ID for linked accounts
  deactivated: boolean;
  isDeleted: boolean;
  currencyCode?: string;  // Added: direct currency field on account
  currentBalance?: Money;  // Made optional
  availableBalance?: Money;
  budgetBalance?: Money;
  have?: Money;  // Added: used for net worth calculation
  owe?: Money;   // Added: used for net worth calculation
  totalCreditLine?: Money;
  refreshStatus?: number;  // Added: Refresh status for linked accounts
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
  spendingGroupId?: string;  // Added: spending group ID for filtering
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
  // NOTE: Categories do NOT have spendingGroupId field in the backend
  // The relationship is determined through CategoryTotal objects which have both categoryId and spendingGroupId
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

// TrackedCategory API payload (matches Flutter mobile app exactly)
export interface TrackedCategory {
  amount: Money;              // Budget amount as Money object
  isTracked: boolean;         // Always true when adding budget
  validFrom: number;          // Pay period (YYYYMM format, e.g., 202411)
  customerId?: string;        // Optional - backend fills this
  alertsEnabled: boolean;     // Spending alerts enabled
  applyOnlyToCurrentPeriod: boolean;  // Budget for current period only
  category: {
    id: string;               // Category ID (ttsId)
    description: string;      // Empty string for add
    isDeleted: boolean;       // Always false
    isCustom: boolean;        // Always false
    hasPlanned: boolean;      // Always false
  };
  spendingGroup: {
    id: string;               // Spending group ID (ttsId)
    description: string;      // Empty string for add
  };
  id?: string;                // Budget ID (null for new budget)
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
  expectedReturn?: string;  // Expected return rate/description
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

export interface ServiceProvider {
  id: string;
  ttsId: string;
  name: string;
  siteId?: number;
  multiFactorAuthenticationRequired?: boolean;
  multiFactorAuthenticationInputLabel?: string;
  copy?: string;
  countryCode?: string;
  rewardsFactor?: number;
  isBeta?: boolean;
  sortOrder?: number;
  loginMessage?: string;
  refreshEnabled?: boolean;
  canUploadStatement?: boolean;
  supportedStatementFormats?: string;
  canLink?: boolean;
  authType?: string;
  authLoginUrlTemplate?: string;
  accountLoginForm?: {
    accountLoginFields: Array<{
      label: string;
      dataType: string;
      optional: boolean;
      secure?: boolean;
    }>;
  };
  logo?: string;
  logoUrl?: string;
  integrationProviderOriginId?: string;
  integrationProvider?: string;
  preventRelinkWhileProcessing?: boolean;
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
  serviceProviders: ServiceProvider[];
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
