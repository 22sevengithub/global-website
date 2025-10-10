// React Hook for Lean SDK Bank Linking
// Mirrors Flutter mobile app's LeanLinkBankAccountController logic exactly

import { useState, useCallback, useRef } from 'react';
import {
  LeanResponse,
  LeanCredentials,
  ServiceProvider,
  LeanLinkState,
  LeanLinkOptions,
} from '../types/lean';
import {
  extractLeanCredentials,
  launchLeanConnect,
  handleLeanResponse,
  handleLeanCancellation,
  extractErrorMessage,
} from '../services/leanSdk';
import { leanApi } from '../services/api';
import { customerApi } from '../services/api';

/**
 * React Hook for Lean Bank Linking
 *
 * Provides complete bank linking flow matching mobile app behavior:
 * 1. Initialize provider login (get Lean credentials)
 * 2. Launch Lean SDK
 * 3. Handle success/cancel/error
 * 4. Cleanup dummy accounts on failure
 * 5. Refresh aggregate data on success
 *
 * @param customerId - Current user's customer ID
 * @param options - Success/cancel/error callbacks and configuration
 */
export const useLeanConnect = (
  customerId: string | null,
  options: LeanLinkOptions = {}
) => {
  const {
    onSuccess,
    onCancel,
    onError,
    isDarkMode = false,
  } = options;

  // State management
  const [state, setState] = useState<LeanLinkState>({
    isLoading: false,
    error: null,
    credentials: null,
    provider: null,
  });

  // Store account login ID for cleanup
  const accountLoginIdRef = useRef<string | null>(null);

  /**
   * Initialize provider login and get Lean credentials
   * Step 1: Call backend API to get Lean SDK credentials
   */
  const initializeProviderLogin = async (provider: ServiceProvider): Promise<LeanCredentials | null> => {
    if (!customerId) {
      throw new Error('Customer ID is required for bank linking');
    }

    try {
      console.log(`[useLeanConnect] Initializing provider login for: ${provider.name}`);
      console.log(`[useLeanConnect] Provider object:`, {
        name: provider.name,
        ttsId: provider.ttsId,
        providerType: provider.providerType,
      });
      console.log(`[useLeanConnect] Customer ID: ${customerId}`);
      console.log(`[useLeanConnect] API Base URL: ${process.env.NEXT_PUBLIC_API_URL || 'https://api-global.dev.vault22.io'}`);
      console.log(`[useLeanConnect] Full endpoint: POST /customer/${customerId}/accountlogins/create`);
      console.log(`[useLeanConnect] Payload:`, {
        serviceProviderId: provider.ttsId,
        loginFields: [],
      });

      // Call backend to create account login and get Lean credentials
      const response = await leanApi.providerLogin(customerId, {
        serviceProviderId: provider.ttsId,
        loginFields: [],
      });

      // Extract Lean credentials from response
      const credentials = extractLeanCredentials(response);

      if (!credentials) {
        throw new Error('Failed to extract Lean credentials from response');
      }

      // Store account login ID for potential cleanup
      accountLoginIdRef.current = credentials.accountLoginId || null;

      console.log('[useLeanConnect] Provider login initialized successfully');
      console.log(`[useLeanConnect] Account Login ID: ${accountLoginIdRef.current}`);

      return credentials;
    } catch (error: any) {
      console.error('[useLeanConnect] Provider login failed:', error);
      console.error('[useLeanConnect] Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      });
      throw error;
    }
  };

  /**
   * Launch Lean SDK with credentials
   * Step 2: Open Lean UI for user to link their bank account
   */
  const launchLean = async (
    credentials: LeanCredentials,
    provider: ServiceProvider
  ): Promise<void> => {
    try {
      console.log('[useLeanConnect] Launching Lean SDK...');

      await launchLeanConnect(credentials, {
        isSandbox: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_LEAN_SANDBOX === 'true',
        isDarkMode,
        showLogs: true,
        callback: async (response: LeanResponse) => {
          await handleLeanSDKResponse(response, provider);
        },
        failCallback: (error: Error) => {
          console.error('[useLeanConnect] Lean SDK error:', error);
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: extractErrorMessage(error),
          }));
          if (onError) {
            onError(error);
          }
        },
      });
    } catch (error) {
      console.error('[useLeanConnect] Failed to launch Lean SDK:', error);
      throw error;
    }
  };

  /**
   * Handle Lean SDK response (SUCCESS/CANCELLED/ERROR)
   * Step 3: Process user's action in Lean flow
   */
  const handleLeanSDKResponse = async (
    response: LeanResponse,
    provider: ServiceProvider
  ): Promise<void> => {
    if (!customerId) {
      console.error('[useLeanConnect] Customer ID not available for response handling');
      return;
    }

    await handleLeanResponse(response, {
      provider,
      accountLoginId: accountLoginIdRef.current || undefined,
      onSuccess: async () => {
        console.log('[useLeanConnect] Bank linked successfully - refreshing data...');

        // Clear stored account login ID on success
        accountLoginIdRef.current = null;

        // Refresh aggregate data (fetch latest account information)
        try {
          await customerApi.getAggregate(customerId, undefined, true);
          console.log('[useLeanConnect] Aggregate data refreshed');
        } catch (refreshError) {
          console.error('[useLeanConnect] Failed to refresh aggregate:', refreshError);
        }

        // Update state
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: null,
        }));

        // Call success callback
        if (onSuccess) {
          onSuccess(response);
        }
      },
      onCancelOrError: async () => {
        console.log('[useLeanConnect] Bank linking cancelled or failed');

        // Clear stored account login ID
        accountLoginIdRef.current = null;

        // Update state
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.status === 'ERROR' ? extractErrorMessage(response, false) : null,
        }));

        // Call appropriate callback
        if (response.status === 'CANCELLED' && onCancel) {
          onCancel();
        } else if (response.status === 'ERROR' && onError) {
          onError(response.message || 'Lean SDK returned an error');
        }
      },
      deleteDummyAccount: async (accountLoginId: string) => {
        await leanApi.deleteDummyAccountLogin(customerId, accountLoginId);
      },
    });
  };

  /**
   * Main function: Connect bank account
   * Complete flow from start to finish
   */
  const connectBankAccount = useCallback(
    async (provider: ServiceProvider) => {
      if (!customerId) {
        const error = 'User must be logged in to link a bank account';
        setState((prev) => ({ ...prev, error }));
        if (onError) {
          onError(error);
        }
        return;
      }

      try {
        console.log(`[useLeanConnect] Starting bank link flow for: ${provider.name}`);
        console.log(`[useLeanConnect] Customer ID: ${customerId}`);
        console.log(`[useLeanConnect] Provider ID: ${provider.ttsId}`);

        // Set loading state
        setState({
          isLoading: true,
          error: null,
          credentials: null,
          provider,
        });

        // Step 1: Initialize provider login (get credentials)
        const credentials = await initializeProviderLogin(provider);

        if (!credentials) {
          throw new Error('Failed to initialize provider login');
        }

        // Store credentials in state
        setState((prev) => ({
          ...prev,
          credentials,
        }));

        // Step 2: Launch Lean SDK
        await launchLean(credentials, provider);

        // Note: Loading state is cleared in handleLeanSDKResponse
        // after the user completes/cancels the Lean flow
      } catch (error) {
        console.error('[useLeanConnect] Bank linking error:', error);

        const errorMessage = extractErrorMessage(error);

        // Attempt to cleanup dummy account on error
        if (accountLoginIdRef.current) {
          try {
            await leanApi.deleteDummyAccountLogin(customerId, accountLoginIdRef.current);
            accountLoginIdRef.current = null;
          } catch (cleanupError) {
            console.error('[useLeanConnect] Failed to cleanup after error:', cleanupError);
          }
        }

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        if (onError) {
          onError(errorMessage);
        }
      }
    },
    [customerId, isDarkMode, onSuccess, onCancel, onError]
  );

  /**
   * Cancel bank linking (user closes without attempting)
   * Cleanup any pending operations
   */
  const cancelBankLinking = useCallback(async () => {
    if (!customerId || !accountLoginIdRef.current) {
      return;
    }

    await handleLeanCancellation({
      accountLoginId: accountLoginIdRef.current,
      deleteDummyAccount: async (accountLoginId: string) => {
        await leanApi.deleteDummyAccountLogin(customerId, accountLoginId);
      },
      onComplete: () => {
        accountLoginIdRef.current = null;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: null,
        }));

        if (onCancel) {
          onCancel();
        }
      },
    });
  }, [customerId, onCancel]);

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      credentials: null,
      provider: null,
    });
    accountLoginIdRef.current = null;
  }, []);

  return {
    // State
    isLoading: state.isLoading,
    error: state.error,
    credentials: state.credentials,
    provider: state.provider,

    // Actions
    connectBankAccount,
    cancelBankLinking,
    reset,
  };
};

export default useLeanConnect;
