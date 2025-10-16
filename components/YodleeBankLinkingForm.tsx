// Yodlee Bank Linking Form Component
// Mirrors legacy webapp: /webapp/app/pages/_ng/Onboarding/StandardBankSignup.jsx
// For South African banks using Yodlee/22seven integration

import React, { useState, useEffect } from 'react';
import { yodleeApi, AccountLoginField, ServiceProvider } from '../services/yodleeApi';
import { EnhancedServiceProvider, getProviderApiUrl, getProviderEncryptionKey } from '../services/multiApiService';

interface YodleeBankLinkingFormProps {
  /** Selected service provider (bank) */
  serviceProvider: ServiceProvider;

  /** Customer ID */
  customerId: string;

  /** RSA public key for encryption (from aggregate.config.encryptionKey) */
  publicKey: string;

  /** Current number of linked accounts (for polling detection) */
  initialAccountCount: number;

  /** Called when linking starts */
  onLoading?: (isLoading: boolean) => void;

  /** Called when linking completes successfully */
  onSuccess?: () => void;

  /** Called when linking fails */
  onError?: (error: string) => void;

  /** Called when user cancels */
  onCancel?: () => void;
}

/**
 * Yodlee Bank Linking Form
 *
 * Displays a form for users to enter their bank credentials.
 * Credentials are encrypted and sent to the backend for Yodlee processing.
 *
 * IMPORTANT: This is for SA banks using the legacy Yodlee integration.
 * For UAE/Global banks, use the Lean SDK integration instead.
 */
export default function YodleeBankLinkingForm({
  serviceProvider,
  customerId,
  publicKey,
  initialAccountCount,
  onLoading,
  onSuccess,
  onError,
  onCancel,
}: YodleeBankLinkingFormProps) {
  const accountLoginFields = serviceProvider.accountLoginForm.accountLoginFields;

  const [fields, setFields] = useState<AccountLoginField[]>(
    accountLoginFields.map(f => ({ ...f, value: '' }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasEmptyFields, setHasEmptyFields] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if all fields are filled
  useEffect(() => {
    setHasEmptyFields(fields.some((f) => !f.value || f.value.trim() === ''));
  }, [fields]);

  /**
   * Handle field value change
   */
  const handleFieldChange = (index: number, value: string) => {
    setFields(fields.map((f, i) => (i === index ? { ...f, value } : f)));
    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasEmptyFields) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    onLoading && onLoading(true);

    try {
      console.log(`[YodleeBankLinkingForm] Submitting credentials for: ${serviceProvider.name}`);

      // Multi-API Mode: Get provider-specific API URL and encryption key
      const enhancedProvider = serviceProvider as any as EnhancedServiceProvider;
      const providerApiUrl = enhancedProvider.apiBaseUrl || undefined;
      const providerEncryptionKey = getProviderEncryptionKey(enhancedProvider, publicKey);

      if (providerApiUrl) {
        console.log(`[YodleeBankLinkingForm] Using provider-specific API: ${providerApiUrl}`);
      }

      if (enhancedProvider.encryptionKey && enhancedProvider.encryptionKey !== publicKey) {
        console.log(`[YodleeBankLinkingForm] Using provider-specific encryption key`);
      }

      // Use the complete linkAccount function which handles encryption, API call, and polling
      const success = await yodleeApi.linkAccount(
        customerId,
        serviceProvider,
        fields,
        providerEncryptionKey,
        initialAccountCount,
        providerApiUrl
      );

      if (success) {
        console.log('[YodleeBankLinkingForm] Bank linked successfully!');
        onSuccess && onSuccess();
      } else {
        // Polling timeout - account may still be linking
        const message = 'Account linking is taking longer than expected. Please check your accounts page in a few moments.';
        setErrorMessage(message);
        onError && onError(message);
      }
    } catch (error: any) {
      console.error('[YodleeBankLinkingForm] Linking failed:', error);

      const message = error.response?.data?.message ||
                      error.message ||
                      'Sorry, there was a problem linking your account. Please try again later.';

      setErrorMessage(message);
      onError && onError(message);
    } finally {
      setIsSubmitting(false);
      onLoading && onLoading(false);
    }
  };

  /**
   * Get placeholder text based on field data type
   */
  const getPlaceholder = (field: AccountLoginField): string => {
    if (field.dataType === 'PASSWORD') {
      return 'Enter your password';
    }
    if (field.label.toLowerCase().includes('username')) {
      return 'Enter your username';
    }
    if (field.label.toLowerCase().includes('card')) {
      return 'Enter your card number';
    }
    return `Enter your ${field.label.toLowerCase()}`;
  };

  return (
    <div className="flex flex-col items-center p-5 w-full">
      {/* Bank Logo and Name */}
      <div className="w-20 h-20 mb-4">
        {serviceProvider.logoUrl ? (
          <img
            src={serviceProvider.logoUrl}
            alt={serviceProvider.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = '/icons/bank.png';
            }}
          />
        ) : (
          <div className="w-full h-full bg-vault-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-vault-gray-600">
              {serviceProvider.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-barlow font-semibold text-vault-black mb-6 text-center">
        {serviceProvider.name}
      </h2>

      {/* Error Alert */}
      {errorMessage && (
        <div className="w-full mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full">
        {fields.map((field, index) => (
          <div key={field.label} className="mb-4">
            <label
              htmlFor={`field-${index}`}
              className="block text-sm font-medium text-vault-gray-700 mb-2"
            >
              {field.label}
            </label>
            <input
              id={`field-${index}`}
              type={field.dataType === 'PASSWORD' ? 'password' : 'text'}
              value={field.value}
              onChange={(e) => handleFieldChange(index, e.target.value)}
              placeholder={getPlaceholder(field)}
              autoComplete={field.dataType === 'PASSWORD' ? 'new-password' : 'off'}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-vault-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vault-green focus:border-transparent disabled:bg-vault-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        ))}

        {/* Info Items */}
        <div className="my-6 space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-vault-gray-100 rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-vault-gray-900">
                {serviceProvider.name} account information
              </h3>
              <p className="text-sm text-vault-gray-600 mt-1">
                We will fetch information for all your {serviceProvider.name} products.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-vault-gray-100 rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-vault-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-vault-gray-900">
                Bank notifications
              </h3>
              <p className="text-sm text-vault-gray-600 mt-1">
                You may see a notification from your bank to let you know we have signed in.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-vault-gray-100 rounded-full flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-vault-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-vault-gray-900">
                Secure connection
              </h3>
              <p className="text-sm text-vault-gray-600 mt-1">
                Your credentials are encrypted and never stored on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6 pt-4 border-t border-vault-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-vault-gray-300 rounded-lg text-vault-gray-700 font-semibold hover:bg-vault-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={hasEmptyFields || isSubmitting}
            className="flex-1 px-6 py-3 bg-vault-green text-white font-semibold rounded-lg hover:bg-opacity-90 disabled:bg-vault-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Linking...
              </span>
            ) : (
              'Link Account'
            )}
          </button>
        </div>
      </form>

      {/* Loading Message */}
      {isSubmitting && (
        <div className="mt-4 text-center">
          <p className="text-sm text-vault-gray-600">
            This may take up to 20 seconds. Please don't close this window.
          </p>
        </div>
      )}
    </div>
  );
}
