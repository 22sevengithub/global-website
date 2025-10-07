import AppShell from '../../../components/AppShell';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../../contexts/AppContext';

export default function MFAVerification() {
  const router = useRouter();
  const { providerId, providerName, mfaType = 'otp' } = router.query;
  const { customerInfo } = useApp();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer for resend
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (newCode.every(digit => digit !== '') && !submitting) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter(char => /^\d$/.test(char));

    const newCode = [...code];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });
    setCode(newCode);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if complete
    if (newCode.every(digit => digit !== '')) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleSubmit = async (codeString: string) => {
    if (submitting) return;

    setSubmitting(true);
    setError('');

    try {
      // Simulate MFA verification API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real implementation, verify the MFA code here
      // const result = await serviceProviderApi.verifyMFA(customerId, providerId, codeString);

      // Navigate to linking progress screen
      router.push({
        pathname: '/app/link-account/linking',
        query: { providerId, providerName }
      });
    } catch (err: any) {
      console.error('MFA verification failed:', err);
      setError(err.message || 'Invalid code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resending || countdown > 0) return;

    setResending(true);
    setError('');

    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset countdown
      setCountdown(60);
    } catch (err: any) {
      console.error('Failed to resend code:', err);
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const getMFAMessage = () => {
    switch (mfaType) {
      case 'sms':
        return 'We\'ve sent a verification code to your registered mobile number';
      case 'email':
        return 'We\'ve sent a verification code to your registered email address';
      case 'app':
        return 'Please enter the code from your authenticator app';
      default:
        return 'Please enter the verification code sent to you';
    }
  };

  const getMFAIconSVG = () => {
    switch (mfaType) {
      case 'sms':
        return (
          <svg className="w-12 h-12 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-12 h-12 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'app':
      default:
        return (
          <svg className="w-12 h-12 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
    }
  };

  return (
    <ProtectedRoute>
      <AppShell title={`Verify - ${providerName} | Vault22`}>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/app/link-account" className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Cancel
            </Link>

            {/* MFA Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-vault-green/10 rounded-full flex items-center justify-center">
                {getMFAIconSVG()}
              </div>
            </div>

            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2 text-center">
              Verification Required
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400 text-center max-w-md mx-auto">
              {getMFAMessage()}
            </p>
          </div>

          {/* MFA Code Input */}
          <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-8 mb-6">
            <label className="block text-sm font-semibold text-vault-black dark:text-white mb-4 text-center">
              Enter 6-Digit Code
            </label>

            {/* Code Input Boxes */}
            <div className="flex justify-center gap-3 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={submitting}
                  className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold border-2 rounded-xl transition-all ${
                    digit
                      ? 'border-vault-green bg-vault-green/5 text-vault-black dark:text-white'
                      : 'border-vault-gray-300 dark:border-vault-gray-600 dark:bg-vault-gray-800 text-vault-gray-900 dark:text-white'
                  } focus:border-vault-green focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              ))}
            </div>

            {/* Loading State */}
            {submitting && (
              <div className="flex items-center justify-center mb-4">
                <svg className="animate-spin h-6 w-6 text-vault-green mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-vault-gray-600 dark:text-vault-gray-400">Verifying...</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start mb-4">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-600 dark:text-red-400 text-sm flex-1">{error}</p>
              </div>
            )}

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResend}
                disabled={resending || countdown > 0}
                className="text-vault-green hover:text-vault-green-dark font-semibold disabled:text-vault-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {resending ? (
                  'Sending...'
                ) : countdown > 0 ? (
                  `Resend code in ${countdown}s`
                ) : (
                  'Resend Code'
                )}
              </button>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-vault-gray-50 dark:bg-vault-gray-800 rounded-xl p-6 border border-vault-gray-200 dark:border-vault-gray-700">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-vault-green mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div className="text-left">
                <h3 className="font-bold text-vault-black dark:text-white mb-1 text-sm">Why do we need this?</h3>
                <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400">
                  Your bank requires multi-factor authentication for security. This extra step helps protect your account from unauthorized access.
                </p>
              </div>
            </div>
          </div>

          {/* Help Link */}
          <div className="text-center mt-6">
            <Link
              href="#"
              className="text-sm text-vault-gray-600 dark:text-vault-gray-400 hover:text-vault-black dark:hover:text-white transition-colors underline"
            >
              Having trouble? Contact Support
            </Link>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
