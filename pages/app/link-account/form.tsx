import AppShell from '../../../components/AppShell';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingAnimation from '../../../components/LoadingAnimation';
import Icon from '../../../components/Icon';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../../contexts/AppContext';
import { serviceProviderApi } from '../../../services/api';
import { ServiceProvider } from '../../../types';
import { useLeanConnect } from '../../../hooks/useLeanConnect';
import { ServiceProvider as LeanServiceProvider } from '../../../types/lean';
import YodleeBankLinkingForm from '../../../components/YodleeBankLinkingForm';

export default function LinkAccountForm() {
  const router = useRouter();
  const { providerId } = router.query;
  const { aggregate, customerInfo, loading: contextLoading } = useApp();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  // Get provider from aggregate data
  const provider = useMemo(() => {
    console.log('[FormPage] Looking for provider:', {
      providerId,
      providerIdType: typeof providerId,
      hasAggregate: !!aggregate,
      providerCount: aggregate?.serviceProviders?.length || 0
    });

    if (!aggregate?.serviceProviders) {
      console.log('[FormPage] No service providers in aggregate');
      return null;
    }

    if (!providerId) {
      console.log('[FormPage] No providerId in query');
      return null;
    }

    // Match by id or ttsId (backend uses 'id', not 'ttsId')
    const found = aggregate.serviceProviders.find(p =>
      p.id === providerId || p.ttsId === providerId
    );

    if (!found) {
      console.log('[FormPage] Provider not found!');
      console.log('[FormPage] Available provider IDs:', aggregate.serviceProviders.map(p => p.ttsId).slice(0, 10));
    } else {
      console.log('[FormPage] Provider found:', {
        name: found.name,
        id: found.id,
        ttsId: found.ttsId,
        hasForm: !!found.accountLoginForm,
        fields: found.accountLoginForm?.accountLoginFields?.length || 0,
        integrationProvider: found.integrationProvider,
        authType: found.authType
      });
    }

    return found || null;
  }, [aggregate, providerId]);

  // Determine provider type: LEAN, VEZGO, or YODLEE (SA banks)
  const providerType = useMemo(() => {
    if (!provider) return null;

    // Check integrationProvider field first (most reliable)
    if (provider.integrationProvider === 'LEAN') {
      return 'LEAN';
    }
    if (provider.integrationProvider === 'VEZGO') {
      return 'VEZGO';
    }

    // If provider has accountLoginForm with fields, it's Yodlee (SA banks)
    if (provider.accountLoginForm?.accountLoginFields &&
        provider.accountLoginForm.accountLoginFields.length > 0) {
      return 'YODLEE';
    }

    // If no login form and no integrationProvider, assume LEAN
    return 'LEAN';
  }, [provider]);

  const isLeanProvider = providerType === 'LEAN';
  const isVezgoProvider = providerType === 'VEZGO';
  const isYodleeProvider = providerType === 'YODLEE';

  // Initialize Lean SDK connection for Lean providers
  const {
    connectBankAccount,
    isLoading: isLeanLoading,
    error: leanError,
  } = useLeanConnect(customerInfo?.id || null, {
    onSuccess: () => {
      console.log('✅ Bank linked successfully via Lean SDK');
      // Navigate to accounts page
      router.push('/app/accounts');
    },
    onCancel: () => {
      console.log('❌ User cancelled Lean SDK');
      // Navigate back to provider list
      router.push('/app/link-account');
    },
    onError: (error) => {
      console.error('⚠️ Lean SDK error:', error);
      setError(typeof error === 'string' ? error : 'Failed to link account. Please try again.');
    },
    isDarkMode: false, // TODO: Get from theme context
  });

  // Handler to manually launch Lean SDK
  const handleLaunchLean = () => {
    if (!provider || !customerInfo?.id) {
      setError('Missing required information');
      return;
    }

    console.log('🔗 Manually launching Lean SDK for provider:', provider.name);

    // Convert to Lean provider format (use id or ttsId)
    const leanProvider: LeanServiceProvider = {
      ttsId: provider.id || provider.ttsId,  // Use id as primary identifier
      name: provider.name,
      logoUrl: provider.logoUrl || provider.logo,
      providerType: 'LEAN',
    };

    // Launch Lean SDK
    connectBankAccount(leanProvider);
  };

  useEffect(() => {
    if (provider) {
      // Initialize form data with empty strings
      const initialData: Record<string, string> = {};
      provider.accountLoginForm?.accountLoginFields?.forEach((field: any) => {
        initialData[field.label] = '';
      });
      setFormData(initialData);
    }
  }, [provider]);

  const handleInputChange = (label: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [label]: value
    }));
  };

  const togglePasswordVisibility = (label: string) => {
    setShowPassword(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!provider || !customerInfo?.id) {
      setError('Missing required information');
      return;
    }

    // Validate required fields
    const requiredFields = provider.accountLoginForm?.accountLoginFields?.filter(f => !f.optional) || [];
    for (const field of requiredFields) {
      if (!formData[field.label] || formData[field.label].trim() === '') {
        setError(`${field.label} is required`);
        return;
      }
    }

    setSubmitting(true);
    setError('');

    try {
      // Prepare provider login data
      const providerLogin = {
        serviceProviderId: provider.id || provider.ttsId,  // Use id as primary identifier
        username: formData[Object.keys(formData)[0]], // First field is typically username
        credentials: formData
      };

      // Submit to API
      await serviceProviderApi.linkAccount(customerInfo.id, providerLogin);

      // Navigate to linking/progress screen
      router.push({
        pathname: '/app/link-account/linking',
        query: { providerId: provider.id || provider.ttsId, providerName: provider.name }
      });
    } catch (err: any) {
      console.error('Failed to link account:', err);
      setError(err.response?.data?.message || 'Failed to link account. Please check your credentials and try again.');
      setSubmitting(false);
    }
  };

  if (contextLoading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Link Account | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <LoadingAnimation size={150} />
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mt-4">Loading...</p>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  if (!provider) {
    return (
      <ProtectedRoute>
        <AppShell title="Link Account | Vault22">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-vault-black dark:text-white mb-4">Provider Not Found</h2>
            <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-6">
              We couldn't find the provider you're looking for. Please select a provider from the list.
            </p>
            <Link
              href="/app/link-account"
              className="inline-flex items-center px-6 py-3 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all"
            >
              Back to Provider List
            </Link>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  // Show Lean provider page with manual connect button
  if (isLeanProvider && !isLeanLoading && !leanError && !error) {
    return (
      <ProtectedRoute>
        <AppShell title={`Link ${provider.name} | Vault22`}>
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/app/link-account" className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Providers
              </Link>

              {/* Provider Header */}
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-vault-gray-100 dark:bg-vault-gray-700 rounded-2xl flex items-center justify-center mr-4 p-2">
                  {provider.logoUrl || provider.logo ? (
                    <img
                      src={provider.logoUrl || provider.logo || `https://spi.22seven.com/${provider.id || provider.ttsId}.png`}
                      alt={provider.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-4xl">🏦</span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white">
                    {provider.name}
                  </h1>
                  <p className="text-vault-gray-600 dark:text-vault-gray-400">
                    Connect securely via Lean Technologies
                  </p>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-vault-green/10 border border-vault-green/30 rounded-xl p-4 flex items-start mb-6">
                <Icon name="ic_security" size={24} className="text-vault-green mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-vault-black dark:text-white mb-1">Your data is secure</h3>
                  <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                    We use Lean Technologies' secure platform to connect to your bank. Your credentials are encrypted and never stored on our servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Connect Card */}
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-vault-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-vault-black dark:text-white mb-2">
                  Ready to Connect
                </h2>
                <p className="text-vault-gray-600 dark:text-vault-gray-400">
                  Click the button below to securely connect your {provider.name} account
                </p>
              </div>

              <button
                onClick={handleLaunchLean}
                className="w-full px-6 py-4 bg-vault-green text-vault-black dark:text-white rounded-xl font-bold text-lg hover:bg-vault-green-light transition-all shadow-lg hover:shadow-xl"
              >
                Connect with {provider.name}
              </button>

              <div className="mt-6 text-center">
                <p className="text-xs text-vault-gray-500">
                  A secure popup window will open to complete the connection
                </p>
              </div>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  // Show Lean loading state
  if (isLeanProvider && (isLeanLoading || submitting)) {
    return (
      <ProtectedRoute>
        <AppShell title={`Connecting ${provider.name} | Vault22`}>
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <LoadingAnimation size={150} />
              <h2 className="text-2xl font-bold text-vault-black dark:text-white mt-6 mb-2">
                Connecting to {provider.name}
              </h2>
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-4">
                Please complete the authentication in the popup window
              </p>
              <div className="bg-vault-blue/10 border border-vault-blue/30 rounded-xl p-4 text-sm text-left">
                <p className="text-vault-gray-700 dark:text-vault-gray-300">
                  <strong>💡 Tip:</strong> Look for a popup window from Lean Technologies.
                  If you don't see it, check if your browser blocked popups.
                </p>
              </div>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  // Show YODLEE form for SA banks
  if (isYodleeProvider) {
    console.log('[FormPage] Rendering Yodlee form for SA bank:', provider.name);

    return (
      <ProtectedRoute>
        <AppShell title={`Link ${provider.name} | Vault22`}>
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/app/link-account" className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Providers
              </Link>

              <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
                Link Your South African Bank
              </h1>
              <p className="text-vault-gray-600 dark:text-vault-gray-400">
                Securely connect your {provider.name} account
              </p>
            </div>

            {/* Yodlee Form Component */}
            <YodleeBankLinkingForm
              serviceProvider={{
                id: provider.id || provider.ttsId,
                name: provider.name,
                canLink: true,
                accountLoginForm: {
                  accountLoginFields: provider.accountLoginForm!.accountLoginFields.map(f => ({
                    ...f,
                    value: '', // Initialize with empty value
                  })),
                },
              }}
              customerId={customerInfo?.id || ''}
              publicKey={aggregate?.config?.encryptionKey || ''}
              initialAccountCount={aggregate?.accounts?.length || 0}
              onLoading={setSubmitting}
              onSuccess={() => {
                console.log('✅ Yodlee bank linked successfully');
                router.push('/app/accounts');
              }}
              onError={(error) => {
                console.error('⚠️ Yodlee bank linking failed:', error);
                setError(error);
              }}
              onCancel={() => {
                console.log('❌ User cancelled Yodlee linking');
                router.push('/app/link-account');
              }}
            />
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  // Show Lean error state
  if (isLeanProvider && (leanError || error)) {
    return (
      <ProtectedRoute>
        <AppShell title={`Error Linking ${provider.name} | Vault22`}>
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-vault-black dark:text-white mb-4">
              Connection Failed
            </h2>
            <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-6">
              {leanError || error}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setError('');
                  const leanProvider: LeanServiceProvider = {
                    ttsId: provider.id || provider.ttsId,  // Use id as primary identifier
                    name: provider.name,
                    logoUrl: provider.logoUrl || provider.logo,
                    providerType: 'LEAN',
                  };
                  connectBankAccount(leanProvider);
                }}
                className="px-6 py-3 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all"
              >
                Try Again
              </button>
              <Link
                href="/app/link-account"
                className="px-6 py-3 border-2 border-vault-gray-300 dark:border-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all"
              >
                Back to Providers
              </Link>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppShell title={`Link ${provider.name} | Vault22`}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/app/link-account" className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Providers
            </Link>

            {/* Provider Header */}
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-vault-gray-100 dark:bg-vault-gray-700 rounded-2xl flex items-center justify-center mr-4 p-2">
                {provider.logoUrl || provider.logo ? (
                  <img
                    src={provider.logoUrl || provider.logo || `https://spi.22seven.com/${provider.id || provider.ttsId}.png`}
                    alt={provider.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-4xl">🏦</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white">
                  {provider.name}
                </h1>
                <p className="text-vault-gray-600 dark:text-vault-gray-400">Enter your credentials to link your account</p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-vault-green/10 border border-vault-green/30 rounded-xl p-4 flex items-start">
              <Icon name="ic_security" size={24} className="text-vault-green mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-vault-black dark:text-white mb-1">Your data is secure</h3>
                <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                  We use bank-level 256-bit encryption to protect your information. Your credentials are never stored on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-8">
            <h2 className="text-xl font-bold text-vault-black dark:text-white mb-6">Login Credentials</h2>

            {/* Dynamic Form Fields */}
            <div className="space-y-5">
              {provider.accountLoginForm?.accountLoginFields?.map((field, index) => {
                const isPassword = field.dataType === 'PASSWORD' || field.secure || field.label.toLowerCase().includes('password');
                const fieldType = isPassword ? (showPassword[field.label] ? 'text' : 'password') : 'text';

                return (
                  <div key={`${field.label}-${index}`}>
                    <label className="block text-sm font-semibold text-vault-black dark:text-white mb-2">
                      {field.label} {!field.optional && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={fieldType}
                        required={!field.optional}
                        value={formData[field.label] || ''}
                        onChange={(e) => handleInputChange(field.label, e.target.value)}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                        className="w-full px-4 py-3 pr-12 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                        disabled={submitting}
                      />
                      {isPassword && (
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(field.label)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 rounded-lg transition-all"
                          tabIndex={-1}
                        >
                          {showPassword[field.label] ? (
                            <svg className="w-5 h-5 text-vault-gray-600 dark:text-vault-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-vault-gray-600 dark:text-vault-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-600 dark:text-red-400 text-sm flex-1">{error}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => router.push('/app/link-account')}
                disabled={submitting}
                className="flex-1 px-6 py-3 border-2 border-vault-gray-300 dark:border-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  'Connect Account'
                )}
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-vault-gray-500">
                Having trouble? Make sure you're using the same credentials you use on your bank's website or app.
              </p>
            </div>
          </form>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
