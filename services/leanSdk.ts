// Lean SDK Service Layer
// Mirrors Flutter mobile app implementation exactly

import {
  LeanSDK,
  LeanConnectConfig,
  LeanResponse,
  LeanCredentials,
  ProviderLoginResponse,
  LeanThemeCustomization,
  ServiceProvider,
} from '../types/lean';

/**
 * Check if Lean SDK is loaded and available
 */
export const isLeanSDKLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.Lean !== 'undefined';
};

/**
 * Wait for Lean SDK to load
 * @param timeout Maximum time to wait in milliseconds
 */
export const waitForLeanSDK = (timeout: number = 10000): Promise<LeanSDK> => {
  return new Promise((resolve, reject) => {
    if (isLeanSDKLoaded()) {
      resolve(window.Lean!);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      if (isLeanSDKLoaded()) {
        clearInterval(interval);
        resolve(window.Lean!);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval);
        reject(new Error('Lean SDK failed to load within timeout period'));
      }
    }, 100);
  });
};

/**
 * Extract Lean credentials from Provider Login Response
 * Matches Flutter app's credential extraction logic
 */
export const extractLeanCredentials = (
  response: ProviderLoginResponse
): LeanCredentials | null => {
  try {
    const loginFields = response.loginFields || [];

    const appToken = loginFields.find((f) => f.label === 'app_token')?.value;
    const customerId = loginFields.find((f) => f.label === 'customer_id')?.value;
    const accessToken = loginFields.find((f) => f.label === 'access_token')?.value;
    const bankIdentifier = loginFields.find((f) => f.label === 'bank_identifier')?.value;
    const permissionsStr = loginFields.find((f) => f.label === 'permissions')?.value;

    // Parse permissions from JSON string to array
    let permissions: string[] = [];
    if (permissionsStr) {
      try {
        permissions = JSON.parse(permissionsStr);
      } catch (e) {
        console.error('[Lean] Failed to parse permissions:', e);
      }
    }

    // Get account login ID from response
    // CRITICAL: Use accountLoginIds array if available, fallback to response.id
    const accountLoginId =
      response.accountLoginIds && response.accountLoginIds.length > 0
        ? response.accountLoginIds[0]
        : response.id;

    if (!appToken || !customerId || !accessToken) {
      console.error('[Lean] Missing required credentials in response');
      return null;
    }

    console.log('[Lean] Credentials extracted successfully:', {
      appToken: appToken.substring(0, 10) + '...',
      customerId,
      hasAccessToken: !!accessToken,
      bankIdentifier,
      permissions,
      accountLoginId,
    });

    return {
      appToken,
      customerId,
      accessToken,
      bankIdentifier,
      permissions,
      accountLoginId,
    };
  } catch (error) {
    console.error('[Lean] Error extracting credentials:', error);
    return null;
  }
};

/**
 * Get Lean theme customization based on dark mode
 * Matches Flutter app's theme logic
 */
export const getLeanThemeCustomization = (isDarkMode: boolean): LeanThemeCustomization => {
  return {
    dialog_mode: 'uncontained',
    theme_color: isDarkMode ? '#fff203' : '#0069f1',
    button_text_color: isDarkMode ? '#000000' : '#ffffff',
  };
};

/**
 * Launch Lean Connect SDK
 * Mirrors Flutter app's Lean.connect() implementation
 */
export const launchLeanConnect = async (
  credentials: LeanCredentials,
  options: {
    isSandbox?: boolean;
    isDarkMode?: boolean;
    showLogs?: boolean;
    callback: (response: LeanResponse) => void;
    failCallback?: (error: Error) => void;
  }
): Promise<void> => {
  try {
    // Wait for Lean SDK to be available
    const Lean = await waitForLeanSDK();

    const {
      isSandbox = process.env.NODE_ENV === 'development',
      isDarkMode = false,
      showLogs = true,
      callback,
      failCallback,
    } = options;

    if (showLogs) {
      console.log('[Lean] Launching Lean.connect() with config:', {
        app_token: credentials.appToken.substring(0, 10) + '...',
        customer_id: credentials.customerId,
        bank_identifier: credentials.bankIdentifier,
        permissions: credentials.permissions,
        sandbox: isSandbox,
      });
    }

    // Get theme customization
    const customization = getLeanThemeCustomization(isDarkMode);

    // Create callback handler
    // Lean SDK only has one callback that handles all cases (SUCCESS, CANCELLED, ERROR)
    const handleCallback = (response: LeanResponse) => {
      if (showLogs) {
        console.log('[Lean] SDK Response:', response);
      }

      // Call the appropriate callback based on response status
      if (response.status === 'ERROR' && failCallback) {
        // Convert response to error for failCallback
        const error = new Error(response.message || 'Lean SDK returned an error');
        failCallback(error);
      } else {
        // Success or Cancelled - use main callback
        callback(response);
      }
    };

    // Build Lean Connect configuration
    const config: LeanConnectConfig = {
      app_token: credentials.appToken,
      customer_id: credentials.customerId,
      access_token: credentials.accessToken,
      bank_identifier: credentials.bankIdentifier,
      permissions: credentials.permissions,
      sandbox: isSandbox,
      callback: handleCallback,
      // Add customization
      ...customization,
    };

    // Launch Lean SDK
    Lean.connect(config);
  } catch (error) {
    console.error('[Lean] Failed to launch Lean SDK:', error);
    throw error;
  }
};

/**
 * Handle Lean SDK Response
 * Matches Flutter app's handleLeanResponse logic
 */
export const handleLeanResponse = async (
  response: LeanResponse,
  options: {
    provider: ServiceProvider;
    accountLoginId?: string;
    onSuccess: () => Promise<void>;
    onCancelOrError: () => Promise<void>;
    deleteDummyAccount: (accountLoginId: string) => Promise<void>;
  }
): Promise<void> => {
  try {
    console.log(`[Lean] Handling response: ${response.status} - ${response.message}`);

    if (response.status === 'SUCCESS') {
      // SUCCESS: Account linked successfully
      console.log('[Lean] Account linked successfully');
      await options.onSuccess();
    } else if (response.status === 'CANCELLED' || response.status === 'ERROR') {
      // CANCELLED or ERROR: Delete dummy account and cleanup
      console.log(`[Lean] ${response.status}: Cleaning up dummy account`);

      if (options.accountLoginId) {
        try {
          await options.deleteDummyAccount(options.accountLoginId);
          console.log('[Lean] Dummy account deleted successfully');
        } catch (deleteError) {
          console.error('[Lean] Failed to delete dummy account:', deleteError);
        }
      }

      await options.onCancelOrError();
    } else {
      // Unknown status - still try to cleanup
      console.warn('[Lean] Unknown status, cleaning up:', response.status);

      if (options.accountLoginId) {
        try {
          await options.deleteDummyAccount(options.accountLoginId);
        } catch (deleteError) {
          console.error('[Lean] Failed to delete dummy account:', deleteError);
        }
      }

      await options.onCancelOrError();
    }
  } catch (error) {
    console.error('[Lean] Error handling response:', error);

    // Attempt to delete dummy account even if error occurs
    if (options.accountLoginId) {
      try {
        await options.deleteDummyAccount(options.accountLoginId);
      } catch (deleteError) {
        console.error('[Lean] Failed to delete dummy account after error:', deleteError);
      }
    }

    throw error;
  }
};

/**
 * Handle Lean SDK Cancellation (user closes without completing)
 * Matches Flutter app's handleLeanCancellation logic
 */
export const handleLeanCancellation = async (options: {
  accountLoginId?: string;
  deleteDummyAccount: (accountLoginId: string) => Promise<void>;
  onComplete: () => void;
}): Promise<void> => {
  try {
    console.log('[Lean] User cancelled bank linking');

    if (options.accountLoginId) {
      try {
        await options.deleteDummyAccount(options.accountLoginId);
        console.log('[Lean] Dummy account deleted after cancellation');
      } catch (error) {
        console.error('[Lean] Failed to delete dummy account on cancellation:', error);
      }
    }
  } catch (error) {
    console.error('[Lean] Error handling cancellation:', error);
  } finally {
    options.onComplete();
  }
};

/**
 * Extract error message from error object
 * Matches Flutter app's error message extraction
 */
export const extractErrorMessage = (error: any, isLeanCancellation: boolean = false): string => {
  // Check for Axios/Fetch error response
  if (error?.response?.data) {
    const responseData = error.response.data;
    if (typeof responseData === 'object') {
      const backendMessage =
        responseData.message || responseData.error || responseData.errorMessage;
      if (backendMessage) {
        return backendMessage;
      }
    }
  }

  // Check for standard Error object
  if (error?.message) {
    return error.message;
  }

  // Default messages
  if (isLeanCancellation) {
    return 'Account linking was cancelled. Please try again.';
  }

  return 'An error occurred while linking your account. Please try again.';
};
