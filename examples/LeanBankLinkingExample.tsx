// Example Component: Bank Linking with Lean SDK
// This demonstrates the complete implementation matching the mobile app flow

import React, { useState } from 'react';
import { useLeanConnect } from '../hooks/useLeanConnect';
import { ServiceProvider } from '../types/lean';

/**
 * Example Bank Linking Component
 *
 * Demonstrates how to use the useLeanConnect hook to link bank accounts
 * Matches the mobile app's LeanLinkBankAccountPage implementation
 */
export default function LeanBankLinkingExample() {
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  // Get customer ID from your auth context/state
  // For this example, we'll use a placeholder
  const customerId = sessionStorage.getItem('customerId');

  // Initialize Lean hook with callbacks
  const {
    isLoading,
    error,
    connectBankAccount,
    cancelBankLinking,
    reset,
  } = useLeanConnect(customerId, {
    onSuccess: (response) => {
      console.log('✅ Bank linked successfully!', response);

      // Show success message
      alert('Bank account linked successfully!');

      // Navigate to accounts page
      window.location.href = '/app/accounts';
    },
    onCancel: () => {
      console.log('❌ User cancelled bank linking');

      // Reset selection
      setSelectedProvider(null);

      // Navigate back to bank list
      window.location.href = '/app/link-account';
    },
    onError: (error) => {
      console.error('⚠️ Bank linking failed:', error);

      // Show error message
      alert(`Failed to link bank account: ${error}`);
    },
    isDarkMode: false, // Get from theme context in real implementation
  });

  // Handle bank selection
  const handleBankSelect = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    connectBankAccount(provider);
  };

  // Handle manual cancel
  const handleCancel = () => {
    cancelBankLinking();
    setSelectedProvider(null);
  };

  // Loading state - show while Lean SDK is active
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-vault-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-vault-green mb-4 mx-auto"></div>
          <h2 className="text-2xl font-barlow font-semibold text-vault-black mb-2">
            Connecting to {selectedProvider?.name}
          </h2>
          <p className="text-vault-gray-600">
            Please complete the authentication in the popup window
          </p>
          <button
            onClick={handleCancel}
            className="mt-6 px-6 py-2 text-vault-gray-600 hover:text-vault-black transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-vault-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-barlow font-semibold text-vault-black mb-4">
              Connection Failed
            </h2>
            <p className="text-vault-gray-600 mb-6">{error}</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  reset();
                  if (selectedProvider) {
                    connectBankAccount(selectedProvider);
                  }
                }}
                className="flex-1 bg-vault-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  reset();
                  setSelectedProvider(null);
                  window.location.href = '/app/link-account';
                }}
                className="flex-1 bg-vault-gray-200 text-vault-black font-semibold py-3 px-6 rounded-lg hover:bg-vault-gray-300 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bank list UI (simplified example)
  return (
    <div className="min-h-screen bg-vault-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-barlow font-bold text-vault-black mb-2">
          Link Your Bank Account
        </h1>
        <p className="text-vault-gray-600 mb-8">
          Select your bank to securely connect your account
        </p>

        {/* Example Bank List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXAMPLE_BANKS.map((bank) => (
            <button
              key={bank.ttsId}
              onClick={() => handleBankSelect(bank)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 flex items-center gap-4 text-left"
            >
              {bank.logoUrl && (
                <img
                  src={bank.logoUrl}
                  alt={bank.name}
                  className="w-12 h-12 rounded-lg object-contain"
                />
              )}
              <div>
                <h3 className="font-semibold text-vault-black">{bank.name}</h3>
                <p className="text-sm text-vault-gray-600">
                  Tap to connect securely
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-vault-blue bg-opacity-10 rounded-lg p-6">
          <h3 className="font-semibold text-vault-black mb-2">
            🔒 Secure Connection
          </h3>
          <p className="text-sm text-vault-gray-700">
            Your credentials are encrypted and never stored on our servers.
            We use Lean Technologies' bank-level security to protect your data.
          </p>
        </div>
      </div>
    </div>
  );
}

// Example bank data - replace with actual data from your API
const EXAMPLE_BANKS: ServiceProvider[] = [
  {
    ttsId: 'provider-1',
    name: 'Emirates NBD',
    logoUrl: '/images/banks/emirates-nbd.png',
    showTransactionLoadingDialog: false,
    providerType: 'LEAN',
  },
  {
    ttsId: 'provider-2',
    name: 'ADCB',
    logoUrl: '/images/banks/adcb.png',
    showTransactionLoadingDialog: false,
    providerType: 'LEAN',
  },
  {
    ttsId: 'provider-3',
    name: 'Dubai Islamic Bank',
    logoUrl: '/images/banks/dib.png',
    showTransactionLoadingDialog: false,
    providerType: 'LEAN',
  },
  {
    ttsId: 'provider-4',
    name: 'First Abu Dhabi Bank',
    logoUrl: '/images/banks/fab.png',
    showTransactionLoadingDialog: true, // Shows loading dialog after linking
    providerType: 'LEAN',
  },
];

/**
 * Alternative: Minimal Implementation
 *
 * If you just need the bare minimum:
 */
export function MinimalLeanExample() {
  const customerId = sessionStorage.getItem('customerId');
  const { connectBankAccount, isLoading, error } = useLeanConnect(customerId);

  const linkBank = () => {
    connectBankAccount({
      ttsId: 'provider-id',
      name: 'Bank Name',
      providerType: 'LEAN',
    });
  };

  return (
    <div>
      <button onClick={linkBank} disabled={isLoading}>
        {isLoading ? 'Connecting...' : 'Link Bank Account'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

/**
 * Alternative: With Context/State Management
 *
 * For larger apps using Redux/Context:
 */
export function LeanWithContext() {
  // Import your auth context
  // const { user } = useAuth();
  // const { isDarkMode } = useTheme();
  // const dispatch = useDispatch();

  const customerId = 'from-auth-context';
  const isDarkMode = false; // from theme context

  const { connectBankAccount, isLoading, error } = useLeanConnect(customerId, {
    onSuccess: () => {
      // Dispatch success action
      // dispatch(bankLinkedSuccess());

      // Refresh data
      // dispatch(fetchAccounts());

      // Navigate
      // router.push('/app/accounts');
    },
    onCancel: () => {
      // dispatch(bankLinkingCancelled());
    },
    onError: (error) => {
      // dispatch(bankLinkingError(error));
    },
    isDarkMode,
  });

  // Implementation here...
  return <div>Your UI</div>;
}
