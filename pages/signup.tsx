import Layout from '../components/Layout';
import LoadingAnimation from '../components/LoadingAnimation';
import FlagIcon from '../components/FlagIcon';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../contexts/AppContext';
import { authApi } from '../services/api';
import { validateUAEMobile, formatPhoneNumber, formatPhoneInput } from '../utils/phoneValidation';

// Password validation helper functions (matching mobile app logic)
const hasAtLeastTenChars = (password: string) => password.length >= 10;
const hasUpperCaseChar = (password: string) => /[A-Z]/.test(password);
const hasLowerCaseChar = (password: string) => /[a-z]/.test(password);
const hasNumber = (password: string) => /\d/.test(password);
const hasSpecialChar = (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password);

const isPasswordValid = (password: string) => {
  return hasAtLeastTenChars(password) &&
    hasUpperCaseChar(password) &&
    hasLowerCaseChar(password) &&
    hasNumber(password) &&
    hasSpecialChar(password);
};

type SignupStep = 'information' | 'password' | 'verify2fa' | 'linkAccount';

interface SignupError {
  errorName?: string;
  errorMessage?: string;
  errorCode?: string;
}

export default function Signup() {
  const router = useRouter();
  const { setAuthenticated } = useApp();

  // Multi-step state
  const [step, setStep] = useState<SignupStep>('information');

  // Step 1: Personal Information
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+971 ');
  const [countryCode, setCountryCode] = useState('+971');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Step 2: Password
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Progress calculation (matching mobile app)
  const getProgress = () => {
    switch (step) {
      case 'information': return 1 / 4;   // 25%
      case 'password': return 2 / 4;       // 50%
      case 'verify2fa': return 1 / 6;      // ~17% (2FA is separate flow)
      case 'linkAccount': return 4 / 5;    // 80%
      default: return 0.25;
    }
  };
  const progress = getProgress();

  // Validate Step 1 form
  const isStep1Valid = () => {
    return firstName.trim() !== '' &&
      surname.trim() !== '' &&
      email.trim() !== '' &&
      phoneNumber.replace(/\D/g, '').length >= 9 &&
      agreedToTerms;
  };

  // Handle Step 1: Verify Personal Information
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailError('');
    setPhoneError('');

    try {
      // Validate UAE phone number
      if (!validateUAEMobile(phoneNumber)) {
        setPhoneError('Please enter a valid UAE mobile number');
        setLoading(false);
        return;
      }

      // Format phone number (remove country code for backend)
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const phoneWithoutDialCode = formattedPhone.replace(countryCode, '');

      // Construct date of birth (send null if not provided, matching mobile app)
      const dateOfBirth = dobYear && dobMonth && dobDay
        ? `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`
        : null;

      const payload = {
        firstName: firstName.trim(),
        surName: surname.trim(),
        email: email.trim(),
        phoneNumber: phoneWithoutDialCode,
        countryCode: countryCode,
        dateOfBirth: dateOfBirth,
      };

      console.log('[Signup] Verifying personal information...');
      console.log('[Signup] === PAYLOAD DEBUG ===');
      console.log('[Signup] Raw phone input:', phoneNumber);
      console.log('[Signup] Formatted phone:', formattedPhone);
      console.log('[Signup] Phone without dial code:', phoneWithoutDialCode);
      console.log('[Signup] Full payload:', JSON.stringify(payload, null, 2));
      console.log('[Signup] ===================');

      const response = await authApi.verifyPersonalInformation(payload);

      console.log('[Signup] Verification response:', response);

      if (response.isValid) {
        // Success - move to password step
        console.log('[Signup] Personal information validated, moving to Step 2');
        setStep('password');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Handle validation errors
        console.error('[Signup] Validation failed:', response.errors);
        const errors: SignupError[] = response.errors || [];

        const emailErr = errors.find((err: SignupError) => err.errorName === 'Email');
        const phoneErr = errors.find((err: SignupError) => err.errorName === 'PhoneNumber');

        if (emailErr) {
          setEmailError(emailErr.errorMessage || 'Email is already registered');
        }
        if (phoneErr) {
          setPhoneError(phoneErr.errorMessage || 'Phone number is already registered');
        }
        if (!emailErr && !phoneErr) {
          setError('Please check your information and try again');
        }
      }
    } catch (err: any) {
      console.error('[Signup] Step 1 error:', err);
      console.error('[Signup] Error status:', err.response?.status);
      console.error('[Signup] Error response:', err.response?.data);
      console.error('[Signup] Full error response:', JSON.stringify(err.response?.data, null, 2));

      const errors = err.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        const emailErr = errors.find((e: SignupError) => e.errorName === 'Email');
        const phoneErr = errors.find((e: SignupError) => e.errorName === 'PhoneNumber');

        if (emailErr) setEmailError(emailErr.errorMessage || 'Email is already registered');
        if (phoneErr) setPhoneError(phoneErr.errorMessage || 'Phone number is already registered');
      } else {
        // Show detailed error message from API if available
        const errorMsg = err.response?.data?.message
          || err.response?.data?.error
          || err.response?.data?.title
          || 'Unable to verify your information. Please try again.';
        setError(`API Error: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Create Account with Password
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isPasswordValid(password)) {
      setError('Please ensure your password meets all requirements');
      setLoading(false);
      return;
    }

    try {
      // Format phone number for registration
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const phoneWithoutDialCode = formattedPhone.replace(countryCode, '');

      // Add "0" prefix as per mobile app logic
      const phoneForRegistration = `0${phoneWithoutDialCode}`;

      // Construct date of birth
      const dateOfBirth = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;

      console.log('[Signup] Creating account with registerV2...');
      const registerResponse = await authApi.registerV2({
        email: email.trim(),
        password: password.trim(),
        firstName: firstName.trim(),
        surName: surname.trim(),
        phoneNumber: phoneForRegistration,
        countryCode: countryCode,
        dateOfBirth: dateOfBirth,
        vaultProfileCountryCode: countryCode === '+971' ? 'ARE' : 'ZAF',
      });

      console.log('[Signup] Register response:', registerResponse);

      if (registerResponse.isSuccess) {
        // Account created successfully - now auto-login
        console.log('[Signup] Account created, auto-logging in...');

        const loginResponse = await authApi.login(email.trim(), password.trim());
        console.log('[Signup] Login response:', loginResponse);

        if (loginResponse.sessionToken && loginResponse.customerId) {
          // Set authenticated state
          setAuthenticated(true, loginResponse.customerId);

          // Navigate to 2FA setup step (matching mobile app flow)
          console.log('[Signup] Moving to 2FA setup step...');
          setStep('verify2fa');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setError('Account created but login failed. Please try logging in manually.');
          setTimeout(() => router.push('/login'), 3000);
        }
      } else {
        // Registration failed
        console.error('[Signup] Registration failed:', registerResponse.errors);
        const errors: SignupError[] = registerResponse.errors || [];

        if (errors.length > 0) {
          setError(errors[0].errorMessage || 'Registration failed. Please try again.');
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('[Signup] Step 2 error:', err);
      console.error('[Signup] Error response:', err.response?.data);

      setError(err.response?.data?.message || err.response?.data?.error || 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'linkAccount') {
      setStep('verify2fa');
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 'verify2fa') {
      setStep('password');
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 'password') {
      setStep('information');
      setPassword('');
      setError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/login');
    }
  };

  return (
    <Layout
      title="Sign Up | Vault22"
      description="Create your Vault22 account and start your journey to financial freedom."
    >
      <section className="min-h-screen bg-gradient-to-br from-vault-gray-50 via-white to-vault-green/5 dark:from-vault-gray-900 dark:via-vault-gray-800 dark:to-vault-gray-900 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Signup Card */}
          <div className="bg-white dark:bg-vault-gray-800 rounded-3xl shadow-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-8 md:p-10">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBack}
                className="text-vault-gray-600 dark:text-vault-gray-400 hover:text-vault-green transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => router.push('/login')}
                className="text-vault-gray-600 dark:text-vault-gray-400 hover:text-vault-green transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Title & Progress */}
            <h2 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              {step === 'information' && 'Tell us about yourself'}
              {step === 'password' && 'Create password'}
              {step === 'verify2fa' && 'Confirm email & phone number'}
              {step === 'linkAccount' && 'Link your account'}
            </h2>
            <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-6">
              {step === 'information' && 'Enter your personal information to get started'}
              {step === 'password' && 'Choose a strong password for your account'}
              {step === 'verify2fa' && 'We will send you an email and an SMS'}
              {step === 'linkAccount' && 'Connect your bank account now'}
            </p>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-1 bg-vault-gray-200 dark:bg-vault-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-vault-green transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="text-xs text-vault-gray-500 dark:text-vault-gray-400 mt-2 text-right">
                {step === 'information' && 'Step 1 of 4'}
                {step === 'password' && 'Step 2 of 4'}
                {step === 'verify2fa' && 'Verify your details'}
                {step === 'linkAccount' && 'Almost there!'}
              </p>
            </div>

            {/* Global Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Step 1: Personal Information */}
            {step === 'information' && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-600 dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Surname */}
                <div>
                  <label className="block text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-2">
                    Surname *
                  </label>
                  <input
                    type="text"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-600 dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                    placeholder="Enter your surname"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className={`w-full px-4 py-3 border-2 ${
                      emailError
                        ? 'border-red-500 dark:border-red-600'
                        : 'border-vault-gray-200 dark:border-vault-gray-600'
                    } dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all`}
                    placeholder="you@example.com"
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-2">
                    UAE Mobile Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FlagIcon country="uae" size="md" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(formatPhoneInput(e.target.value));
                        if (phoneError) setPhoneError('');
                      }}
                      className={`w-full pl-12 pr-4 py-3 border-2 ${
                        phoneError
                          ? 'border-red-500 dark:border-red-600'
                          : 'border-vault-gray-200 dark:border-vault-gray-600'
                      } dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all`}
                      placeholder="+971 50 123 4567"
                      maxLength={18}
                    />
                  </div>
                  {phoneError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{phoneError}</p>
                  )}
                  <p className="mt-2 text-xs text-vault-gray-500">Enter your UAE mobile number</p>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-2">
                    Date of Birth (Optional)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={dobDay}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setDobDay(val);
                      }}
                      className="px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-600 dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all text-center"
                      placeholder="DD"
                      maxLength={2}
                    />
                    <input
                      type="text"
                      value={dobMonth}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setDobMonth(val);
                      }}
                      className="px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-600 dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all text-center"
                      placeholder="MM"
                      maxLength={2}
                    />
                    <input
                      type="text"
                      value={dobYear}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setDobYear(val);
                      }}
                      className="px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-600 dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all text-center"
                      placeholder="YYYY"
                      maxLength={4}
                    />
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 border-2 border-vault-gray-300 dark:border-vault-gray-600 rounded focus:ring-vault-green"
                  />
                  <label htmlFor="terms" className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                    I agree to the{' '}
                    <a href="#" className="text-vault-green hover:underline">
                      Terms & Conditions
                    </a>
                    {' '}and{' '}
                    <a href="#" className="text-vault-green hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !isStep1Valid()}
                  className="w-full py-4 bg-vault-green text-vault-black dark:text-white font-bold rounded-xl hover:bg-vault-green-light transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingAnimation size={24} />
                      Verifying...
                    </div>
                  ) : (
                    'Next'
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Password Creation */}
            {step === 'password' && (
              <form onSubmit={handleStep2Submit} className="space-y-6">
                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-2">
                    Choose a Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-600 dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all pr-12"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-vault-gray-500 hover:text-vault-green transition-colors"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-vault-gray-50 dark:bg-vault-gray-900 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-3">
                    Password must contain:
                  </p>
                  {[
                    { label: 'At least 10 characters', valid: hasAtLeastTenChars(password) },
                    { label: 'One uppercase letter (A-Z)', valid: hasUpperCaseChar(password) },
                    { label: 'One lowercase letter (a-z)', valid: hasLowerCaseChar(password) },
                    { label: 'One number (0-9)', valid: hasNumber(password) },
                    { label: 'One special character (!@#$...)', valid: hasSpecialChar(password) },
                  ].map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className={`text-sm ${
                        password && req.valid
                          ? 'text-vault-green'
                          : 'text-vault-gray-500 dark:text-vault-gray-400'
                      }`}>
                        {password && req.valid ? '✓' : '○'}
                      </span>
                      <span className={`text-sm ${
                        password && req.valid
                          ? 'text-vault-green'
                          : 'text-vault-gray-600 dark:text-vault-gray-400'
                      }`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Security Note */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Remember to use a unique password and keep it safe. You will need this to sign in.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !isPasswordValid(password)}
                  className="w-full py-4 bg-vault-green text-vault-black dark:text-white font-bold rounded-xl hover:bg-vault-green-light transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingAnimation size={24} />
                      Creating Account...
                    </div>
                  ) : (
                    'Continue'
                  )}
                </button>
              </form>
            )}

            {/* Step 3: Verify 2FA (Email & Phone) */}
            {step === 'verify2fa' && (
              <div className="space-y-6">
                <div className="bg-vault-gray-50 dark:bg-vault-gray-900 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-vault-black dark:text-white mb-2">
                    Verify your details
                  </h3>
                  <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                    We will send you an email and an SMS to verify your contact information
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Skip 2FA and go to link account
                      console.log('[Signup] User skipped 2FA setup');
                      setStep('linkAccount');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 py-4 bg-vault-gray-100 dark:bg-vault-gray-700 text-vault-gray-700 dark:text-vault-gray-200 font-semibold rounded-xl hover:bg-vault-gray-200 dark:hover:bg-vault-gray-600 transition-all"
                  >
                    Maybe later
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement actual 2FA verification
                      // For now, skip to link account
                      console.log('[Signup] User chose to verify 2FA');
                      setStep('linkAccount');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 py-4 bg-vault-green text-vault-black dark:text-white font-bold rounded-xl hover:bg-vault-green-light transition-all hover:shadow-lg"
                  >
                    Continue
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-4">
                  <svg className="w-4 h-4 text-vault-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-vault-gray-500">
                    We use bank-grade 256-bit encryption
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Link Account Onboarding */}
            {step === 'linkAccount' && (
              <div className="space-y-6">
                <div className="bg-vault-gray-50 dark:bg-vault-gray-900 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-vault-black dark:text-white">
                    Connect your bank account now
                  </h3>
                  <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                    Link your accounts to get the most out of Vault22
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-4 pt-4">
                    {[
                      {
                        icon: '🔒',
                        title: 'We cannot access your money',
                        desc: 'We only track your transactions'
                      },
                      {
                        icon: '👀',
                        title: 'Password-protected account details',
                        desc: 'Secure, transparent, and private'
                      },
                      {
                        icon: '🔌',
                        title: 'Disconnect your account anytime',
                        desc: 'You are always in control'
                      }
                    ].map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="text-2xl">{benefit.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-vault-black dark:text-white text-sm">
                            {benefit.title}
                          </h4>
                          <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400 mt-1">
                            {benefit.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Skip linking and go to dashboard
                      console.log('[Signup] User skipped account linking');
                      router.push('/app/dashboard');
                    }}
                    className="flex-1 py-4 bg-vault-gray-100 dark:bg-vault-gray-700 text-vault-gray-700 dark:text-vault-gray-200 font-semibold rounded-xl hover:bg-vault-gray-200 dark:hover:bg-vault-gray-600 transition-all"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => {
                      // Go to link account flow
                      console.log('[Signup] User chose to link account');
                      router.push('/app/link-account');
                    }}
                    className="flex-1 py-4 bg-vault-green text-vault-black dark:text-white font-bold rounded-xl hover:bg-vault-green-light transition-all hover:shadow-lg"
                  >
                    Link your account
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-4">
                  <svg className="w-4 h-4 text-vault-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-vault-gray-500">
                    We use bank-grade 256-bit encryption
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-vault-gray-200 dark:border-vault-gray-700 text-center">
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-vault-green hover:underline font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
