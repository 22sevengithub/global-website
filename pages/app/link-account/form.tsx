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
    if (!aggregate?.serviceProviders || !providerId) return null;
    return aggregate.serviceProviders.find(p => p.ttsId === providerId) || null;
  }, [aggregate, providerId]);

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
        serviceProviderId: provider.ttsId,
        username: formData[Object.keys(formData)[0]], // First field is typically username
        credentials: formData
      };

      // Submit to API
      await serviceProviderApi.linkAccount(customerInfo.id, providerLogin);

      // Navigate to linking/progress screen
      router.push({
        pathname: '/app/link-account/linking',
        query: { providerId: provider.ttsId, providerName: provider.name }
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
              We couldn't find the provider you're looking for.
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
                {provider.logoUrl ? (
                  <img
                    src={`https://spi.22seven.com/${provider.ttsId}.png`}
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
