// Lean Technologies SDK TypeScript Definitions
// Based on mobile app implementation and Lean Web SDK documentation

/**
 * Lean SDK Response Status
 */
export type LeanResponseStatus = 'SUCCESS' | 'CANCELLED' | 'ERROR';

/**
 * Lean Permissions - Available data access permissions
 */
export enum LeanPermission {
  IDENTITY = 'identity',
  ACCOUNTS = 'accounts',
  BALANCE = 'balance',
  TRANSACTIONS = 'transactions',
  PAYMENTS = 'payments',
}

/**
 * Lean SDK Response Object
 * Returned in callback after user completes/cancels/errors in Lean flow
 */
export interface LeanResponse {
  status: LeanResponseStatus;
  message?: string;
  exit_point?: string;
  bank?: {
    bank_identifier: string;
    name?: string;
  };
}

/**
 * Lean Connect Configuration
 * Parameters for Lean.connect() method
 */
export interface LeanConnectConfig {
  app_token: string;
  customer_id: string;
  access_token: string;
  bank_identifier?: string;
  permissions: string[];
  sandbox: boolean;
  callback: (response: LeanResponse) => void;
  // Theme customization (optional)
  dialog_mode?: 'contained' | 'uncontained';
  theme_color?: string;
  button_text_color?: string;
}

/**
 * Lean Reconnect Configuration
 * Parameters for Lean.reconnect() method
 */
export interface LeanReconnectConfig {
  app_token: string;
  access_token: string;
  reconnect_id: string;
  sandbox: boolean;
  callback: (response: LeanResponse) => void;
  // Theme customization (optional)
  dialog_mode?: 'contained' | 'uncontained';
  theme_color?: string;
  button_text_color?: string;
}

/**
 * Lean Pay Configuration
 * Parameters for Lean.pay() method
 */
export interface LeanPayConfig {
  app_token: string;
  access_token: string;
  payment_intent_id: string;
  sandbox: boolean;
  callback: (response: LeanResponse) => void;
  // Theme customization (optional)
  dialog_mode?: 'contained' | 'uncontained';
  theme_color?: string;
  button_text_color?: string;
}

/**
 * Provider Login Request
 * Sent to backend to initialize Lean connection
 */
export interface ProviderLoginRequest {
  serviceProviderId: string;
  loginFields?: Array<{
    label: string;
    value: string;
  }>;
}

/**
 * Provider Login Response
 * Received from backend with Lean credentials
 */
export interface ProviderLoginResponse {
  id: string;
  accountLoginIds?: string[];
  loginFields?: Array<{
    label: string;
    value: string;
  }>;
}

/**
 * Lean Credentials
 * Extracted from Provider Login Response
 */
export interface LeanCredentials {
  appToken: string;
  customerId: string;
  accessToken: string;
  bankIdentifier?: string;
  permissions: string[];
  accountLoginId?: string;
}

/**
 * Service Provider
 * Bank/Financial institution details
 */
export interface ServiceProvider {
  ttsId: string;
  name: string;
  logoUrl?: string;
  showTransactionLoadingDialog?: boolean;
  providerType?: string;
}

/**
 * Lean Link State
 * React state management for Lean linking flow
 */
export interface LeanLinkState {
  isLoading: boolean;
  error: string | null;
  credentials: LeanCredentials | null;
  provider: ServiceProvider | null;
}

/**
 * Global Lean SDK Interface
 * TypeScript declaration for window.Lean
 */
export interface LeanSDK {
  connect: (config: LeanConnectConfig) => void;
  reconnect: (config: LeanReconnectConfig) => void;
  pay: (config: LeanPayConfig) => void;
}

/**
 * Extend Window interface to include Lean SDK
 */
declare global {
  interface Window {
    Lean?: LeanSDK;
  }
}

/**
 * Lean Link Options
 * Configuration for useLeanConnect hook
 */
export interface LeanLinkOptions {
  onSuccess?: (response: LeanResponse) => void;
  onCancel?: () => void;
  onError?: (error: Error | string) => void;
  isDarkMode?: boolean;
}

/**
 * Lean Theme Customization
 * Colors and styling for Lean SDK UI
 */
export interface LeanThemeCustomization {
  dialog_mode?: 'contained' | 'uncontained';
  theme_color?: string;
  button_text_color?: string;
}
