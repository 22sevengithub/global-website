// API Service Layer for Vault22 Global

import axios, { AxiosInstance, AxiosError } from 'axios';
import { getPlatformInfo, getDeviceInfo } from '../utils/platform';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev-api.22seven.com';
const SIGNALR_URL = process.env.NEXT_PUBLIC_SIGNALR_URL || 'https://dev-api.22seven.com';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const sessionToken = localStorage.getItem('sessionToken');
    const requestToken = localStorage.getItem('requestToken');

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
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('requestToken');
      localStorage.removeItem('customerId');
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

    // Store tokens
    localStorage.setItem('sessionToken', sessionToken);
    localStorage.setItem('requestToken', requestToken);
    localStorage.setItem('customerId', customerId);

    // Store app version
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
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('requestToken');
      localStorage.removeItem('customerId');
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

    const response = await apiClient.post('/api/auth/otp/request', {
      countryCallingCode: dialCode,
      phoneNumber: phoneNumber, // Already formatted (e.g., "501234567")
      appCountryCode: 'AE',
      platformInformation: {
        deviceType: platformInfo.deviceType,
        appVersion: platformInfo.appVersion,
        osVersion: platformInfo.osVersion,
        versionCode: platformInfo.versionCode,
        appBuild: platformInfo.appBuild,
      },
      pushToken: null,
      pushProvider: 'FLUTTER_FCM',
    });

    return response.data;
  },

  /**
   * Verify OTP and login (Step 2)
   * POST /api/auth/otp/verify
   */
  verifyLoginOTP: async (phoneNumber: string, otpCode: string, dialCode: string = '+971') => {
    const response = await apiClient.post('/api/auth/otp/verify', {
      countryCallingCode: dialCode,
      phoneNumber: phoneNumber, // Already formatted (e.g., "501234567")
      otpCode: otpCode,
    });

    const { sessionToken, requestToken, customerId } = response.data;

    // Store tokens
    localStorage.setItem('sessionToken', sessionToken);
    localStorage.setItem('requestToken', requestToken);
    localStorage.setItem('customerId', customerId);

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

// Customer Functions
export const customerApi = {
  /**
   * Get aggregate data (all customer data)
   */
  getAggregate: async (customerId: string, updatedSince?: string, getDeltas: boolean = false) => {
    const params: any = {};
    if (updatedSince) params.updatedSince = updatedSince;
    if (getDeltas) params.getDeltas = true;

    const response = await apiClient.get(`/customer/${customerId}/aggregate`, { params });
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
   * Update tracked categories (set budgets)
   */
  updateTrackedCategories: async (customerId: string, trackedCategories: Array<{
    categoryId: string;
    isTracked: boolean;
    plannedAmount: any;
    alertsEnabled: boolean;
    applyOnlyToCurrentPeriod: boolean;
  }>) => {
    const response = await apiClient.put(`/customer/${customerId}/trackedCategories`, {
      trackedCategories,
    });
    return response.data;
  },
};

// Goals Functions
export const goalsApi = {
  /**
   * Get all goals
   */
  getAllGoals: async (customerId: string, isNoGoal: boolean = false) => {
    const response = await apiClient.get(`/customer/${customerId}/goals/all`, {
      params: { isNoGoal },
    });
    return response.data;
  },

  /**
   * Create goal
   */
  createGoal: async (customerId: string, goalData: any) => {
    const response = await apiClient.post(`/customer/${customerId}/goals`, goalData);
    return response.data;
  },

  /**
   * Setup goal
   */
  setupGoal: async (customerId: string, goalId: string, setupData: any) => {
    const response = await apiClient.put(`/customer/${customerId}/goals/setup/${goalId}`, setupData);
    return response.data;
  },

  /**
   * Get product recommendations for goal
   */
  getProductRecommendations: async (customerId: string, goalId: string, investmentStyle: string) => {
    const response = await apiClient.get(
      `/customer/${customerId}/goals/products-recommendation/${goalId}`,
      { params: { investmentStyle } }
    );
    return response.data;
  },
};

export default apiClient;
