import AppShell from '../../../components/AppShell';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingAnimation from '../../../components/LoadingAnimation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../../contexts/AppContext';

const LINKING_STEPS = [
  { id: 1, label: 'Connecting to your bank', duration: 2000 },
  { id: 2, label: 'Verifying credentials', duration: 3000 },
  { id: 3, label: 'Fetching account information', duration: 3000 },
  { id: 4, label: 'Syncing transactions', duration: 2000 },
  { id: 5, label: 'Finalizing connection', duration: 2000 },
];

export default function LinkingProgress() {
  const router = useRouter();
  const { providerId, providerName } = router.query;
  const { loadAggregate } = useApp();

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!providerId) {
      router.push('/app/link-account');
      return;
    }

    simulateLinking();
  }, [providerId]);

  const simulateLinking = async () => {
    try {
      // Step through each linking phase
      for (let i = 0; i < LINKING_STEPS.length; i++) {
        setCurrentStep(i);
        setProgress((i / LINKING_STEPS.length) * 100);

        await new Promise(resolve => setTimeout(resolve, LINKING_STEPS[i].duration));
      }

      setProgress(100);

      // Reload aggregate data to get new accounts
      await loadAggregate();

      // Wait a bit to show 100% completion
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate to success screen
      router.push({
        pathname: '/app/link-account/success',
        query: { providerName: providerName || 'Your Bank' }
      });
    } catch (err: any) {
      console.error('Linking failed:', err);
      setError(err.message || 'Failed to link account');
    }
  };

  const handleCancel = () => {
    router.push('/app/accounts');
  };

  if (error) {
    return (
      <ProtectedRoute>
        <AppShell title="Link Failed | Vault22" showBackButton={false}>
          <div className="max-w-2xl mx-auto text-center py-12">
            {/* Error Icon Animation */}
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center animate-bounce-slow">
                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-4">
              Connection Failed
            </h2>
            <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-8 max-w-md mx-auto">
              {error || 'We couldn\'t connect to your bank. This could be due to incorrect credentials or a temporary issue.'}
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/app/link-account')}
                className="px-8 py-3 border-2 border-vault-gray-300 dark:border-vault-gray-600 text-vault-gray-700 dark:text-vault-gray-300 rounded-xl font-semibold hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all"
              >
                Try Another Bank
              </button>
              <button
                onClick={() => router.back()}
                className="px-8 py-3 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all"
              >
                Try Again
              </button>
            </div>

            <button
              onClick={handleCancel}
              className="mt-6 text-vault-gray-600 dark:text-vault-gray-400 hover:text-vault-black dark:hover:text-white transition-colors"
            >
              Back to Accounts
            </button>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppShell title="Linking Account | Vault22" showBackButton={false}>
        <div className="max-w-2xl mx-auto text-center py-12">
          {/* Loading Animation */}
          <div className="mb-8">
            <LoadingAnimation size={200} />
          </div>

          {/* Provider Name */}
          <h2 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
            Connecting to {providerName || 'Your Bank'}
          </h2>
          <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-8">
            Please wait while we securely connect your account
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative h-3 bg-vault-gray-200 dark:bg-vault-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-vault-green to-vault-green-dark rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-r from-transparent to-white/30 animate-pulse"></div>
              </div>
            </div>
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mt-2">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Current Step */}
          <div className="max-w-md mx-auto mb-12">
            <div className="space-y-3">
              {LINKING_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-vault-green/10 border-2 border-vault-green'
                      : index < currentStep
                      ? 'bg-vault-gray-100 dark:bg-vault-gray-800 border-2 border-transparent'
                      : 'bg-vault-gray-50 dark:bg-vault-gray-900 border-2 border-transparent opacity-50'
                  }`}
                >
                  {/* Step Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    index < currentStep
                      ? 'bg-vault-green text-white'
                      : index === currentStep
                      ? 'bg-vault-green text-white animate-pulse'
                      : 'bg-vault-gray-300 dark:bg-vault-gray-700 text-vault-gray-600 dark:text-vault-gray-400'
                  }`}>
                    {index < currentStep ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-bold">{step.id}</span>
                    )}
                  </div>

                  {/* Step Label */}
                  <span className={`text-sm font-medium ${
                    index === currentStep
                      ? 'text-vault-black dark:text-white'
                      : 'text-vault-gray-600 dark:text-vault-gray-400'
                  }`}>
                    {step.label}
                  </span>

                  {/* Loading Spinner for Current Step */}
                  {index === currentStep && (
                    <div className="ml-auto">
                      <svg className="animate-spin h-5 w-5 text-vault-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Note */}
          <div className="max-w-md mx-auto bg-vault-gray-50 dark:bg-vault-gray-800 rounded-xl p-6 border border-vault-gray-200 dark:border-vault-gray-700">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-vault-green mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="text-left">
                <h3 className="font-bold text-vault-black dark:text-white mb-1 text-sm">Secure Connection</h3>
                <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400">
                  Your connection is encrypted with 256-bit SSL security. Your credentials are never stored on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Cancel Button (subtle) */}
          <button
            onClick={handleCancel}
            className="mt-8 text-sm text-vault-gray-500 hover:text-vault-gray-700 dark:hover:text-vault-gray-300 transition-colors underline"
          >
            Cancel and return to accounts
          </button>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
