// API Service Layer for Vault22 Global

import axios, { AxiosInstance, AxiosError } from 'axios';
import { getPlatformInfo, getDeviceInfo } from '../utils/platform';

// API Configuration
// For static export (S3), we call the API directly (CORS must be configured on API server)
// For development with Next.js server, we can use proxy routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-global.dev.vault22.io';
const SIGNALR_URL = process.env.NEXT_PUBLIC_SIGNALR_URL || 'https://steph.develop.my227.net';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 60000, // 60 seconds (increased from 30s to handle large aggregate responses)
});

// Request interceptor to add auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const sessionToken = sessionStorage.getItem('sessionToken');
    const requestToken = sessionStorage.getItem('requestToken');

    if (sessionToken && requestToken) {
      config.headers['X-SESSION-TOKEN'] = sessionToken;
      config.headers['X-REQUEST-TOKEN'] = requestToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear tokens and redirect to login
      sessionStorage.removeItem('sessionToken');
      sessionStorage.removeItem('requestToken');
      sessionStorage.removeItem('customerId');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Authentication Functions
export const authApi = {
  /**
   * Login user (complete implementation based on Flutter app)
   */
  login: async (email: string, password: string, rememberMe: boolean = true) => {
    const platformInfo = getPlatformInfo();
    const deviceInfo = getDeviceInfo();

    const response = await apiClient.post('/sessions', {
      username: email.trim().toLowerCase(),
      password: password,
      platformInformation: {
        deviceType: platformInfo.deviceType,
        appVersion: platformInfo.appVersion,
        osVersion: platformInfo.osVersion,
        versionCode: platformInfo.versionCode,
        appBuild: platformInfo.appBuild,
      },
      rememberMe: rememberMe,
      pushToken: null,
      pushProvider: null,
      deviceId: deviceInfo.deviceId,
      deviceName: deviceInfo.deviceName,
    });

    const { sessionToken, requestToken, customerId } = response.data;

    // Store tokens in sessionStorage (cleared when tab closes)
    sessionStorage.setItem('sessionToken', sessionToken);
    sessionStorage.setItem('requestToken', requestToken);
    sessionStorage.setItem('customerId', customerId);

    // Store app version in localStorage (persistent)
    localStorage.setItem('APP_VERSION', platformInfo.appVersion);

    return {
      ...response.data,
      statusCode: 200,
      statusMessage: 'Logged in Successfully!',
    };
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await apiClient.delete('/sessions');
    } finally {
      sessionStorage.removeItem('sessionToken');
      sessionStorage.removeItem('requestToken');
      sessionStorage.removeItem('customerId');
    }
  },

  /**
   * Register new user
   */
  register: async (name: string, surname: string, email: string, password: string) => {
    const response = await apiClient.put('/register', {
      name,
      surname,
      username: email,
      email,
      password,
      platformInformation: {
        platform: 'web',
        osVersion: navigator.userAgent,
        appVersion: '1.0.0',
      },
    });

    return response.data;
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string) => {
    const response = await apiClient.post('/passwordReset', {
      email,
      is22sevenLite: false,
    });

    return response.data;
  },

  /**
   * Send 2FA OTP via SMS
   */
  send2FAOTP: async (customerId: string, phoneNumber: string) => {
    const response = await apiClient.post(`/customer/${customerId}/two-factor/send-otp-via-sms`, {
      phoneNumber,
    });

    return response.data;
  },

  /**
   * Verify 2FA OTP
   */
  verify2FAOTP: async (customerId: string, code: string) => {
    const response = await apiClient.post(`/customer/${customerId}/two-factor/verify-otp-via-sms`, {
      code,
    });

    return response.data;
  },

  /**
   * Request OTP for phone-based login (Step 1)
   * POST /api/auth/otp/request
   */
  requestLoginOTP: async (phoneNumber: string, dialCode: string = '+971') => {
    const platformInfo = getPlatformInfo();

    const payload = {
      countryCallingCode: dialCode,
      phoneNumber: phoneNumber,
      appCountryCode: 'ARE', // ISO 3166-1 alpha-3 (3 characters)
      platformInformation: {
        deviceType: platformInfo.deviceType,
        appVersion: platformInfo.appVersion,
        osVersion: platformInfo.osVersion,
        versionCode: platformInfo.versionCode,
        appBuild: platformInfo.appBuild,
      },
      pushToken: null,
      pushProvider: 'FLUTTER_FCM',
    };

    console.log('[API] OTP Request Payload:', JSON.stringify(payload, null, 2));
    console.log('[API] API Base URL:', API_BASE_URL);

    const response = await apiClient.post('/api/auth/otp/request', payload);

    return response.data;
  },

  /**
   * Verify OTP and login (Step 2)
   * POST /api/auth/otp/verify
   */
  verifyLoginOTP: async (phoneNumber: string, otpCode: string, dialCode: string = '+971') => {
    const response = await apiClient.post('/api/auth/otp/verify', {
      countryCallingCode: dialCode,
      phoneNumber: phoneNumber,
      otpCode: otpCode,
    });

    const { sessionToken, requestToken, customerId } = response.data;

    // Store tokens in sessionStorage (cleared when tab closes)
    sessionStorage.setItem('sessionToken', sessionToken);
    sessionStorage.setItem('requestToken', requestToken);
    sessionStorage.setItem('customerId', customerId);

    return response.data;
  },

  /**
   * Update user info for new users (Step 3)
   * PUT /api/auth/otp/{customerId}/info
   */
  updateUserInfo: async (customerId: string, userInfo: {
    firstName: string;
    lastName: string;
    middleName?: string | null;
    email: string;
  }) => {
    const response = await apiClient.put(`/api/auth/otp/${customerId}/info`, userInfo);
    return response.data;
  },
};

// Helper function to extract amount from Money object
const extractMoney = (moneyObj: any): number | undefined => {
  if (!moneyObj) return undefined;
  return moneyObj.amount;
};

// Transform backend CategoryTotal (with Money objects) to web app format (flat numbers)
const transformCategoryTotals = (backendCategoryTotals: any[]): any[] => {
  if (!backendCategoryTotals) return [];

  return backendCategoryTotals.map(ct => ({
    id: ct.id,
    ttsId: ct.id,
    customerId: ct.customerId,
    categoryId: ct.categoryId,
    spendingGroupId: ct.spendingGroupId,
    categoryDescription: ct.categoryDescription,
    spendingGroupDescription: ct.spendingGroupDescription,
    payPeriod: ct.payPeriod,

    // CRITICAL FIX: Extract .amount from Money objects
    // Backend sends: { "total": { "amount": 100, "currencyCode": "ZAR" } }
    // Web app needs: { "totalAmount": 100 }
    totalAmount: extractMoney(ct.total) || 0,
    averageAmount: extractMoney(ct.average),
    plannedAmount: extractMoney(ct.plannedAmount),
    previousPlannedAmount: extractMoney(ct.previousPlannedAmount),

    isTrackedCategory: ct.isTrackedCategory || false,
    isTrackedForPayPeriod: ct.isTrackedForPayPeriod || false,
    alertsEnabled: ct.alertsEnabled || false,
    applyOnlyToCurrentPeriod: ct.applyOnlyToCurrentPeriod || false,
  }));
};

// Transform backend Transactions (with Money objects) to web app format
const transformTransactions = (backendTransactions: any[]): any[] => {
  if (!backendTransactions) return [];

  return backendTransactions.map(tx => ({
    ...tx,
    // Transform amount Money object to keep both object and extract values
    amount: {
      amount: extractMoney(tx.amount) || 0,
      currencyCode: tx.amount?.currencyCode || 'ZAR',
      debitOrCredit: tx.amount?.debitOrCredit || 'debit',
    },
    originalAmount: tx.originalAmount ? {
      amount: extractMoney(tx.originalAmount) || 0,
      currencyCode: tx.originalAmount?.currencyCode || 'ZAR',
      debitOrCredit: tx.originalAmount?.debitOrCredit || 'debit',
    } : undefined,
  }));
};

// Transform backend Accounts (with Money objects) to web app format
const transformAccounts = (backendAccounts: any[]): any[] => {
  if (!backendAccounts) return [];

  return backendAccounts.map(acc => ({
    ...acc,
    currentBalance: acc.currentBalance ? {
      amount: extractMoney(acc.currentBalance) || 0,
      currencyCode: acc.currentBalance?.currencyCode || 'ZAR',
      debitOrCredit: acc.currentBalance?.debitOrCredit || 'debit',
    } : undefined,
    availableBalance: acc.availableBalance ? {
      amount: extractMoney(acc.availableBalance) || 0,
      currencyCode: acc.availableBalance?.currencyCode || 'ZAR',
      debitOrCredit: acc.availableBalance?.debitOrCredit || 'debit',
    } : undefined,
    budgetBalance: acc.budgetBalance ? {
      amount: extractMoney(acc.budgetBalance) || 0,
      currencyCode: acc.budgetBalance?.currencyCode || 'ZAR',
      debitOrCredit: acc.budgetBalance?.debitOrCredit || 'debit',
    } : undefined,
    have: acc.have ? {
      amount: extractMoney(acc.have) || 0,
      currencyCode: acc.have?.currencyCode || 'ZAR',
      debitOrCredit: acc.have?.debitOrCredit || 'credit',
    } : undefined,
    owe: acc.owe ? {
      amount: extractMoney(acc.owe) || 0,
      currencyCode: acc.owe?.currencyCode || 'ZAR',
      debitOrCredit: acc.owe?.debitOrCredit || 'debit',
    } : undefined,
    totalCreditLine: acc.totalCreditLine ? {
      amount: extractMoney(acc.totalCreditLine) || 0,
      currencyCode: acc.totalCreditLine?.currencyCode || 'ZAR',
      debitOrCredit: acc.totalCreditLine?.debitOrCredit || 'credit',
    } : undefined,
  }));
};

// Customer Functions
export const customerApi = {
  /**
   * Get aggregate data (all customer data)
   *
   * Using Next.js API routes as backend
   */
  getAggregate: async (customerId: string, updatedSince?: string, getDeltas: boolean = false) => {
    console.log('📊 Fetching aggregate data from backend API...');

    const params: any = {};
    if (updatedSince) params.updatedSince = updatedSince;
    if (getDeltas) params.getDeltas = getDeltas;

    const response = await apiClient.get(`/customer/${customerId}/aggregate`, { params });

    // Transform all Money objects to ensure proper format
    if (response.data) {
      console.log('🔧 Transforming aggregate data: extracting amounts from Money objects...');

      if (response.data.categoryTotals) {
        response.data.categoryTotals = transformCategoryTotals(response.data.categoryTotals);
      }

      if (response.data.transactions) {
        response.data.transactions = transformTransactions(response.data.transactions);
      }

      if (response.data.accounts) {
        response.data.accounts = transformAccounts(response.data.accounts);
      }
    }

    console.log('✅ Aggregate data fetched and transformed successfully');
    return response.data;
  },

  /**
   * Update preferred name
   */
  updatePreferredName: async (customerId: string, preferredName: string) => {
    const response = await apiClient.put(`/customer/${customerId}/preferredName`, {
      preferredName,
    });
    return response.data;
  },

  /**
   * Update currency
   */
  updateCurrency: async (customerId: string, currencyCode: string) => {
    const response = await apiClient.put(`/customer/${customerId}/currency`, {
      currencyCode,
    });
    return response.data;
  },

  /**
   * Update email
   */
  updateEmail: async (customerId: string, newEmail: string) => {
    const response = await apiClient.post(`/customer/${customerId}/emailchange`, {
      newEmail,
    });
    return response.data;
  },

  /**
   * Update first name (legal name)
   */
  updateFirstName: async (customerId: string, firstname: string) => {
    const response = await apiClient.put(`/customer/${customerId}/legal-first-names`, {
      name: firstname,
    });
    return response.data;
  },

  /**
   * Update surname
   */
  updateSurname: async (customerId: string, surname: string) => {
    const response = await apiClient.put(`/customer/${customerId}/surname`, {
      surname,
    });
    return response.data;
  },

  /**
   * Update address details
   */
  updateAddress: async (customerId: string, address: {
    line1?: string;
    line2?: string;
    suburb?: string;
    streetNumber?: string;
    road?: string;
    province?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  }) => {
    const response = await apiClient.put(`/customer/${customerId}/address-details`, address);
    return response.data;
  },

  /**
   * Update notification subscriptions
   */
  updateNotificationSubscriptions: async (customerId: string, subscriptions: {
    isSpendingAlertsEnabled?: string;
    isAccountUpdateEnabled?: string;
    isUnseenTransactionEnabled?: string;
    isNudgesEnabled?: string;
    isGeneralEnabled?: string;
  }) => {
    const response = await apiClient.put(`/customer/${customerId}/notificationSubscriptions`, subscriptions);
    return response.data;
  },
};

// Account Functions
export const accountApi = {
  /**
   * Add manual account
   */
  addManualAccount: async (customerId: string, accountData: any) => {
    const response = await apiClient.post(`/customer/${customerId}/accounts/manual`, accountData);
    return response.data;
  },

  /**
   * Delete account
   */
  deleteAccount: async (customerId: string, accountId: string) => {
    const response = await apiClient.delete(`/customer/${customerId}/accounts/${accountId}`);
    return response.data;
  },

  /**
   * Refresh accounts
   */
  refreshAccounts: async (customerId: string, accountLoginIds: string[]) => {
    const response = await apiClient.post(`/customer/${customerId}/refresh`, {
      accountLoginIds,
    });
    return response.data;
  },
};

// Transaction Functions
export const transactionApi = {
  /**
   * Categorize transactions
   */
  categorizeTransactions: async (customerId: string, transactions: Array<{
    transactionId: string;
    categoryId: string;
    merchantId?: string;
  }>) => {
    const response = await apiClient.put(`/customer/${customerId}/transactions/categorisation`, {
      transactions,
    });
    return response.data;
  },

  /**
   * Split transaction
   */
  splitTransaction: async (customerId: string, transactionId: string, splits: Array<{
    description: string;
    categoryId: string;
    amount: any;
  }>) => {
    const response = await apiClient.put(
      `/customer/${customerId}/transactions/${transactionId}`,
      splits
    );
    return response.data;
  },

  /**
   * Add manual transaction
   */
  addManualTransaction: async (customerId: string, transactionData: any) => {
    const response = await apiClient.put(
      `/customer/${customerId}/transactions/addManual`,
      transactionData
    );
    return response.data;
  },

  /**
   * Tag transaction
   */
  tagTransaction: async (customerId: string, transactionId: string, tagId: string) => {
    const response = await apiClient.put(
      `/customer/${customerId}/transactions/${transactionId}/${tagId}/tagTransaction`
    );
    return response.data;
  },
};

// Budget Functions
export const budgetApi = {
  /**
   * Update tracked categories (add or modify budgets)
   * PUT /customer/{customerId}/trackedCategories
   *
   * IMPORTANT: This endpoint expects a SINGLE TrackedCategory object, NOT an array
   * Matches Flutter mobile app implementation exactly
   */
  updateTrackedCategories: async (customerId: string, trackedCategory: any) => {
    console.log('[Budget API] Sending tracked category payload:', JSON.stringify(trackedCategory, null, 2));

    const response = await apiClient.put(
      `/customer/${customerId}/trackedCategories`,
      trackedCategory  // Send single object, not wrapped in array
    );

    console.log('[Budget API] Update successful:', response.data);
    return response.data;
  },
};

// Investment Style Functions
export const investmentStyleApi = {
  /**
   * Get current investment style
   */
  getCurrentStyle: async (customerId: string) => {
    const response = await apiClient.get(`/customer/${customerId}/investment-style`);
    return response.data;
  },

  /**
   * Get available investment style options
   */
  getStyleOptions: async (customerId: string) => {
    const response = await apiClient.get(`/customer/${customerId}/investment-style/options`);
    return response.data;
  },

  /**
   * Update investment style
   */
  updateStyle: async (customerId: string, styleId: string) => {
    const response = await apiClient.put(`/customer/${customerId}/investment-style`, {
      investmentStyleId: styleId,
    });
    return response.data;
  },

  /**
   * Remove investment style
   */
  removeStyle: async (customerId: string) => {
    const response = await apiClient.delete(`/customer/${customerId}/investment-style`);
    return response.data;
  },
};

// Goals Functions
export const goalsApi = {
  /**
   * Get all goals
   * GET /customer/{customerId}/goals/all
   */
  getAllGoals: async (customerId: string, isNoGoal: boolean = false) => {
    const response = await apiClient.get(`/customer/${customerId}/goals/all`, {
      params: { isNoGoal },
    });
    return response.data;
  },

  /**
   * Get goal by ID
   * GET /customer/{customerId}/goals/{goalId}
   */
  getGoalById: async (customerId: string, goalId: string) => {
    const response = await apiClient.get(`/customer/${customerId}/goals/${goalId}`);
    return response.data;
  },

  /**
   * Get goals grouped by category
   * GET /customer/{customerId}/goals/groups
   */
  getGoalGroups: async (customerId: string) => {
    const response = await apiClient.get(`/customer/${customerId}/goals/groups`);
    return response.data;
  },

  /**
   * Create goal
   * POST /customer/{customerId}/goals
   */
  createGoal: async (customerId: string, goalData: any) => {
    console.log('[Goals API] Creating goal:', goalData);
    const response = await apiClient.post(`/customer/${customerId}/goals`, goalData);
    console.log('[Goals API] Goal created:', response.data);
    return response.data;
  },

  /**
   * Update goal by ID
   * PUT /customer/{customerId}/goals/{id}
   */
  updateGoalById: async (customerId: string, goalId: string, updateData: any) => {
    console.log('[Goals API] Updating goal:', goalId, updateData);
    const response = await apiClient.put(`/customer/${customerId}/goals/${goalId}`, updateData);
    console.log('[Goals API] Goal updated:', response.data);
    return response.data;
  },

  /**
   * Delete goal by ID
   * DELETE /customer/{customerId}/goals/{goalId}
   */
  deleteGoalById: async (customerId: string, goalId: string) => {
    console.log('[Goals API] Deleting goal:', goalId);
    const response = await apiClient.delete(`/customer/${customerId}/goals/${goalId}`);
    console.log('[Goals API] Goal deleted');
    return response.data;
  },

  /**
   * Setup goal (target amount, date, deposits)
   * PUT /customer/{customerId}/goals/setup/{goalId}
   */
  setupGoal: async (customerId: string, goalId: string, setupData: any) => {
    console.log('[Goals API] Setting up goal:', goalId, setupData);
    const response = await apiClient.put(`/customer/${customerId}/goals/setup/${goalId}`, setupData);
    console.log('[Goals API] Goal setup complete:', response.data);
    return response.data;
  },

  /**
   * Get goal onboarding guidance
   * GET /customer/{customerId}/goal-onboardings?goalId={goalId}
   */
  getGoalOnboarding: async (customerId: string, goalId: string) => {
    const response = await apiClient.get(`/customer/${customerId}/goal-onboardings`, {
      params: { goalId },
    });
    return response.data;
  },

  /**
   * Get goal questionnaires (for risk assessment)
   * GET /customer/{customerId}/goal-questionnaires
   */
  getGoalQuestionnaires: async (customerId: string) => {
    const response = await apiClient.get(`/customer/${customerId}/goal-questionnaires`);
    return response.data;
  },

  /**
   * Submit questionnaire answers
   * POST /customer/{customerId}/goal-questionnaires
   */
  postGoalQuestionnaires: async (customerId: string, answers: any) => {
    console.log('[Goals API] Submitting questionnaire answers');
    const response = await apiClient.post(`/customer/${customerId}/goal-questionnaires`, answers);
    console.log('[Goals API] Questionnaire submitted:', response.data);
    return response.data;
  },

  /**
   * Update goal journey step
   * PUT /customer/{customerId}/goals/update-journey-step/{goalId}
   */
  updateJourneyStep: async (customerId: string, goalId: string, journeyStep: number) => {
    console.log('[Goals API] Updating journey step for goal:', goalId, 'to step:', journeyStep);
    const response = await apiClient.put(`/customer/${customerId}/goals/update-journey-step/${goalId}`, {
      journeyStep,
    });
    console.log('[Goals API] Journey step updated successfully');
    return response.data;
  },

  /**
   * Get risk profile recommendation for goal
   * GET /customer/{customerId}/goal-risk-profiles/recommendation?goalId={goalId}
   */
  getGoalRiskProfileRecommendation: async (customerId: string, goalId?: string) => {
    const response = await apiClient.get(`/customer/${customerId}/goal-risk-profiles/recommendation`, {
      params: goalId ? { goalId } : {},
    });
    return response.data;
  },

  /**
   * Get product recommendations for goal
   * GET /customer/{customerId}/goals/products-recommendation/{goalId}
   */
  getProductRecommendations: async (customerId: string, goalId: string, investmentStyle?: string) => {
    const response = await apiClient.get(
      `/customer/${customerId}/goals/products-recommendation/${goalId}`,
      { params: investmentStyle ? { investmentStyle } : {} }
    );
    return response.data;
  },

  /**
   * Get goal product advice/guidance
   * GET /customer/{customerId}/goals/product-advice/{goalId}
   */
  getGoalProductAdvice: async (customerId: string, goalId: string) => {
    const response = await apiClient.get(`/customer/${customerId}/goals/product-advice/${goalId}`);
    return response.data;
  },

  /**
   * Get recurring deposit recommendation
   * POST /customer/{customerId}/goals/recurring-recommendation
   */
  goalRecurringRecommendation: async (customerId: string, recommendationData: any) => {
    const response = await apiClient.post(
      `/customer/${customerId}/goals/recurring-recommendation`,
      recommendationData
    );
    return response.data;
  },

  /**
   * Create goal investment
   * POST /customer/{customerId}/goal-investments
   */
  postGoalInvestments: async (customerId: string, investmentData: any) => {
    console.log('[Goals API] Creating goal investment:', investmentData);
    const response = await apiClient.post(`/customer/${customerId}/goal-investments`, investmentData);
    console.log('[Goals API] Investment created:', response.data);
    return response.data;
  },

  /**
   * Update goal investment
   * PUT /customer/{customerId}/goal-investments/{goalId}
   */
  putGoalInvestments: async (customerId: string, goalId: string, investmentData: any) => {
    console.log('[Goals API] Updating goal investment:', goalId);
    const response = await apiClient.put(`/customer/${customerId}/goal-investments/${goalId}`, investmentData);
    console.log('[Goals API] Investment updated:', response.data);
    return response.data;
  },

  /**
   * Update goal journey step
   * PUT /customer/{customerId}/goals/update-journey-step/{goalId}
   */
  updateJourneyStep: async (customerId: string, goalId: string, journeyStep: number) => {
    console.log('[Goals API] Updating journey step:', goalId, 'step:', journeyStep);
    const response = await apiClient.put(
      `/customer/${customerId}/goals/update-journey-step/${goalId}`,
      { journeyStep }
    );
    console.log('[Goals API] Journey step updated');
    return response.data;
  },

  /**
   * Mark goal reached popup as shown
   * PUT /customer/{customerId}/goals/mark-reached-popup/{goalId}
   */
  markReachedPopup: async (customerId: string, goalId: string) => {
    const response = await apiClient.put(`/customer/${customerId}/goals/mark-reached-popup/${goalId}`);
    return response.data;
  },
};

// Exchange Rate Functions
export const exchangeRateApi = {
  /**
   * Get exchange rates from dedicated endpoint
   * CRITICAL: Must be fetched BEFORE showing any UI with currency conversion
   *
   * @param date - Optional date for historical rates (format: "YYYY-MM-DD HH:mm:ss")
   * @param type - Optional filter: "fx" for forex, "crypto" for crypto, or null for all
   */
  getExchangeRates: async (date?: string, type?: string) => {
    console.log('💱 Fetching exchange rates from dedicated endpoint...');

    const params: any = {};
    if (date) params.date = date;
    if (type) params.type = type;

    const response = await apiClient.get('/api/exchange-rates/rates', { params });

    // Response is a Map object, not an array
    console.log('✅ Exchange rate response received:', response.data);
    return response.data;
  },
};

// Service Provider API (for account linking)
// NOTE: Service providers come from aggregate data, not a separate endpoint
export const serviceProviderApi = {
  /**
   * Link account via service provider (open banking)
   */
  linkAccount: async (customerId: string, providerLogin: any) => {
    console.log(`🔗 Linking account for customer: ${customerId}`);
    const response = await apiClient.post(`/customer/${customerId}/account-logins`, providerLogin);
    console.log('✅ Account login created');
    return response.data;
  },
};

// Manual Account API
export const manualAccountApi = {
  /**
   * Create a manual account
   */
  createManualAccount: async (customerId: string, accountData: any) => {
    console.log(`✍️ Creating manual account for customer: ${customerId}`);
    const response = await apiClient.post(`/customer/${customerId}/manual-accounts`, accountData);
    console.log('✅ Manual account created');
    return response.data;
  },

  /**
   * Update an existing manual account
   */
  updateManualAccount: async (customerId: string, accountId: string, accountData: any) => {
    console.log(`✍️ Updating manual account: ${accountId}`);
    const response = await apiClient.put(`/customer/${customerId}/manual-accounts/${accountId}`, accountData);
    console.log('✅ Manual account updated');
    return response.data;
  },

  /**
   * Delete a manual account
   */
  deleteManualAccount: async (customerId: string, accountId: string) => {
    console.log(`🗑️ Deleting manual account: ${accountId}`);
    const response = await apiClient.delete(`/customer/${customerId}/manual-accounts/${accountId}`);
    console.log('✅ Manual account deleted');
    return response.data;
  },
};

export default apiClient;
