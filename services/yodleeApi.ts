// Yodlee API Service for South African Bank Linking
// Mirrors legacy webapp implementation for 22seven/Yodlee integration

import axios from 'axios';
import apiClient, { customerApi } from './api';
import { encrypt } from '../utils/encryption';

/**
 * Account Login Field
 * Represents a single field in the bank login form (e.g., username, password)
 */
export interface AccountLoginField {
  label: string;        // e.g., "Username", "Password", "Card Number"
  value: string;        // User input value
  dataType: string;     // "TEXT", "PASSWORD", "NUMBER", etc.
}

/**
 * Service Provider (Bank)
 * Contains bank information and login form configuration
 */
export interface ServiceProvider {
  id: string;           // Service provider ID (e.g., "sp_123")
  ttsId?: string;       // Alternative ID field
  name: string;         // Bank name (e.g., "Standard Bank")
  logoUrl?: string;     // Bank logo URL
  canLink: boolean;     // Whether linking is currently enabled
  isBeta?: boolean;     // Beta status flag
  accountLoginForm: {
    accountLoginFields: AccountLoginField[];
  };
}

/**
 * Create Account Login (Yodlee Integration)
 *
 * IMPORTANT: This creates an account login using the Yodlee backend.
 * The backend handles all communication with Yodlee's API.
 *
 * Flow:
 * 1. Encrypt user credentials using RSA public key
 * 2. Send encrypted credentials to backend
 * 3. Backend communicates with Yodlee (hidden from frontend)
 * 4. Poll for account updates (up to 20 seconds)
 *
 * @param customerId - Customer ID
 * @param serviceProviderId - Bank/provider ID
 * @param loginFields - Array of login fields (will be encrypted)
 * @param accountClasses - Optional account classes filter
 * @param apiBaseUrl - Optional API base URL (for multi-API mode)
 * @returns Response from backend
 */
export async function createYodleeAccountLogin(
  customerId: string,
  serviceProviderId: string,
  loginFields: AccountLoginField[],
  accountClasses: string[] = [],
  apiBaseUrl?: string
) {
  try {
    console.log(`🔗 [Yodlee] Creating account login for provider: ${serviceProviderId}`);
    console.log(`   Customer ID: ${customerId}`);
    console.log(`   Login Fields: ${loginFields.length} fields`);
    console.log(`   API Base URL: ${apiBaseUrl || 'default'}`);

    // Use provider-specific API if provided (multi-API mode)
    const client = apiBaseUrl
      ? axios.create({
          baseURL: apiBaseUrl,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-SESSION-TOKEN': sessionStorage.getItem('sessionToken') || '',
            'X-REQUEST-TOKEN': sessionStorage.getItem('requestToken') || '',
          },
          timeout: 60000,
        })
      : apiClient;

    // NOTE: Encryption happens in the calling component after getting public key
    // Here we just send the data to the backend
    const response = await client.post(
      `/customer/${customerId}/accountlogins/create`,
      {
        serviceProviderId,
        accountClasses,
        loginFields,
      }
    );

    console.log('✅ [Yodlee] Account login created');
    console.log(`   Response ID: ${response.data.id}`);

    return response.data;
  } catch (error: any) {
    console.error('❌ [Yodlee] Failed to create account login');
    console.error(`   Error Status: ${error.response?.status}`);
    console.error(`   Error Message: ${error.message}`);
    console.error(`   Error Response:`, error.response?.data);
    throw error;
  }
}

/**
 * Poll for new accounts after linking
 *
 * IMPORTANT: Yodlee integration requires polling because the backend
 * processes the account linking asynchronously.
 *
 * @param customerId - Customer ID
 * @param initialAccountCount - Number of accounts before linking
 * @param timeout - Maximum time to poll (default: 20 seconds)
 * @param pollInterval - How often to check (default: 2 seconds)
 * @returns True if new accounts detected, false if timeout
 */
export async function pollForNewAccounts(
  customerId: string,
  initialAccountCount: number,
  timeout: number = 20000,
  pollInterval: number = 2000
): Promise<boolean> {
  const startTime = Date.now();

  console.log(`⏳ [Yodlee] Polling for new accounts (timeout: ${timeout}ms)`);
  console.log(`   Initial account count: ${initialAccountCount}`);

  while (Date.now() - startTime < timeout) {
    // Wait before checking
    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    try {
      // Fetch updated aggregate data
      const aggregate = await customerApi.getAggregate(customerId, undefined, true);

      const currentAccountCount = aggregate?.accounts?.length || 0;

      console.log(`   Current account count: ${currentAccountCount}`);

      // Check if new accounts were added
      if (currentAccountCount > initialAccountCount) {
        console.log('✅ [Yodlee] New account(s) detected!');
        return true;
      }
    } catch (error) {
      console.error('⚠️ [Yodlee] Error during polling:', error);
      // Continue polling even if one request fails
    }
  }

  console.warn('⏱️ [Yodlee] Polling timeout - no new accounts detected');
  return false;
}

/**
 * Helper function to encrypt login fields
 *
 * @param fields - Array of login fields with user input
 * @param publicKey - RSA public key from aggregate.config.encryptionKey
 * @returns Array of fields with encrypted values
 */
export function encryptLoginFields(
  fields: AccountLoginField[],
  publicKey: string
): AccountLoginField[] {
  return fields.map((field) => ({
    ...field,
    value: encrypt(field.value, publicKey),
  }));
}

/**
 * Complete Yodlee bank linking flow
 *
 * This function encapsulates the entire process:
 * 1. Encrypt credentials
 * 2. Create account login
 * 3. Poll for new accounts
 * 4. Return success/failure
 *
 * @param customerId - Customer ID
 * @param serviceProvider - Selected bank/provider
 * @param loginFields - User-filled login fields
 * @param publicKey - RSA public key for encryption
 * @param initialAccountCount - Number of accounts before linking
 * @param apiBaseUrl - Optional API base URL (for multi-API mode)
 * @returns Success boolean
 */
export async function linkYodleeAccount(
  customerId: string,
  serviceProvider: ServiceProvider,
  loginFields: AccountLoginField[],
  publicKey: string,
  initialAccountCount: number,
  apiBaseUrl?: string
): Promise<boolean> {
  try {
    console.log(`🚀 [Yodlee] Starting bank link flow for: ${serviceProvider.name}`);
    if (apiBaseUrl) {
      console.log(`   Using API: ${apiBaseUrl}`);
    }

    // Step 1: Encrypt login fields
    const encryptedFields = encryptLoginFields(loginFields, publicKey);

    // Step 2: Create account login
    await createYodleeAccountLogin(
      customerId,
      serviceProvider.id || serviceProvider.ttsId!,
      encryptedFields,
      [],
      apiBaseUrl
    );

    // Step 3: Poll for new accounts
    const success = await pollForNewAccounts(customerId, initialAccountCount);

    if (success) {
      console.log(`✅ [Yodlee] Bank linking completed successfully`);
    } else {
      console.warn(`⚠️ [Yodlee] Bank linking may have failed (timeout)`);
    }

    return success;
  } catch (error) {
    console.error(`❌ [Yodlee] Bank linking failed:`, error);
    throw error;
  }
}

export const yodleeApi = {
  createAccountLogin: createYodleeAccountLogin,
  pollForNewAccounts,
  encryptLoginFields,
  linkAccount: linkYodleeAccount,
};

export default yodleeApi;
