import Layout from '../components/Layout';
import LoadingAnimation from '../components/LoadingAnimation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../contexts/AppContext';
import { authApi } from '../services/api';
import { validateUAEMobile, formatPhoneNumber, formatPhoneInput } from '../utils/phoneValidation';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+971 ');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const { setAuthenticated, loadingPhase } = useApp();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateUAEMobile(phoneNumber)) {
      setError('Please enter a valid UAE mobile number');
      setLoading(false);
      return;
    }

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const response = await authApi.requestLoginOTP(formattedPhone);

      if (response.succeed) {
        setStep('otp');
        setCountdown(response.otpExpiresInSeconds || 30);
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      setLoading(false);
      return;
    }

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const response = await authApi.verifyLoginOTP(formattedPhone, otp);

      if (response.error) {
        setError(response.error);
        setOtp('');
        return;
      }

      // Set authentication - this triggers 3-phase data fetch in AppContext
      setAuthenticated(true, response.customerId);

      if (response.phoneOnboardStatus === 'MissingInfo') {
        router.push(`/complete-profile?customerId=${response.customerId}`);
        return;
      }

      // Navigate to app dashboard - data loading will continue in background
      router.push('/app/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setLoading(true);
    setError('');

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const response = await authApi.requestLoginOTP(formattedPhone);

      if (response.succeed) {
        setCountdown(response.otpExpiresInSeconds || 30);
        setOtp('');
      }
    } catch (err: any) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(email, password);

      setAuthenticated(true, response.customerId);
      router.push('/app/dashboard');
    } catch (err: any) {
      console.error('Email login error:', err);
      setError(err.response?.data?.error || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Login | Vault22"
      description="Sign in to your Vault22 account to manage your finances, track your goals, and achieve financial freedom."
    >
      <section className="min-h-screen bg-gradient-to-br from-vault-gray-50 via-white to-vault-green/5 dark:from-vault-gray-900 dark:via-vault-gray-800 dark:to-vault-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding & Benefits */}
            <div className="hidden md:block">
              <div className="sticky top-24">
                <h1 className="text-5xl font-bold font-display text-vault-black dark:text-white mb-6">
                  Welcome to<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-vault-green to-vault-blue">
                    Financial Freedom
                  </span>
                </h1>
                <p className="text-xl text-vault-gray-600 dark:text-vault-gray-400 mb-8 leading-relaxed">
                  Your complete financial wellness platform awaits. Track, invest, and grow your wealth all in one place.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: '🏦', title: 'Connect 300+ Banks', desc: 'Instant account linking via open banking' },
                    { icon: '📊', title: 'Smart Budgeting', desc: 'AI-powered insights and alerts' },
                    { icon: '🎯', title: 'Goal-Based Investing', desc: 'Achieve your financial dreams faster' },
                    { icon: '🔒', title: 'Bank-Level Security', desc: '256-bit encryption & 2FA protection' }
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start p-4 rounded-xl bg-white dark:bg-vault-gray-800 border border-vault-gray-200 dark:border-vault-gray-700 hover:border-vault-green transition-all hover:shadow-md">
                      <div className="text-3xl mr-4">{benefit.icon}</div>
                      <div>
                        <h3 className="font-bold text-vault-black dark:text-white mb-1">{benefit.title}</h3>
                        <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white dark:bg-vault-gray-800 rounded-3xl shadow-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-8 md:p-10">
                <h2 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
                  {loginMethod === 'email' ? 'Welcome Back' : (step === 'phone' ? 'Welcome Back' : 'Enter Verification Code')}
                </h2>
                <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-8">
                  {loginMethod === 'email' ? 'Sign in to your account' : (step === 'phone' ? 'Enter your UAE mobile number' : `We sent a code to ${phoneNumber}`)}
                </p>

                {/* Login Method Toggle */}
                <div className="flex gap-2 mb-6 p-1 bg-vault-gray-100 dark:bg-vault-gray-700 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                      loginMethod === 'email'
                        ? 'bg-white dark:bg-vault-gray-800 text-vault-green shadow-sm'
                        : 'text-vault-gray-600 dark:text-vault-gray-400'
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                      loginMethod === 'phone'
                        ? 'bg-white dark:bg-vault-gray-800 text-vault-green shadow-sm'
                        : 'text-vault-gray-600 dark:text-vault-gray-400'
                    }`}
                  >
                    Phone (OTP)
                  </button>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {loginMethod === 'email' && (
                  <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-600 dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-600 dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                        placeholder="Enter your password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-vault-green text-vault-black dark:text-white font-bold rounded-xl hover:bg-vault-green-light transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <LoadingAnimation size={24} />
                          Signing in...
                        </div>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </form>
                )}

                {loginMethod === 'phone' && step === 'phone' && (
                  <form onSubmit={handleSendOTP} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-2">
                        UAE Mobile Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-2xl">🇦🇪</span>
                        </div>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(formatPhoneInput(e.target.value))}
                          className="w-full pl-12 pr-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-600 dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                          placeholder="+971 50 123 4567"
                          maxLength={18}
                        />
                      </div>
                      <p className="mt-2 text-xs text-vault-gray-500">Enter your UAE mobile number</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-vault-green text-vault-black dark:text-white font-bold rounded-xl hover:bg-vault-green-light transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <LoadingAnimation size={24} />
                          Sending OTP...
                        </div>
                      ) : (
                        'Get OTP'
                      )}
                    </button>
                  </form>
                )}

                {loginMethod === 'phone' && step === 'otp' && (
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-vault-gray-700 dark:text-vault-gray-300 mb-2">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-vault-gray-200 dark:border-vault-gray-600 dark:bg-vault-gray-700 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
                        placeholder="0000"
                        maxLength={4}
                        inputMode="numeric"
                      />
                      <p className="mt-2 text-xs text-vault-gray-500 text-center">Enter the 4-digit code</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 4}
                      className="w-full py-4 bg-vault-green text-vault-black dark:text-white font-bold rounded-xl hover:bg-vault-green-light transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <LoadingAnimation size={24} />
                          Verifying...
                        </div>
                      ) : (
                        'Verify & Login'
                      )}
                    </button>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep('phone')}
                        className="text-sm text-vault-gray-600 dark:text-vault-gray-400 hover:text-vault-green"
                      >
                        ← Change number
                      </button>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={countdown > 0}
                        className="text-sm text-vault-green hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-6 text-center">
                  <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-vault-green hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-vault-green hover:underline">Privacy Policy</a>
                  </p>
                </div>

                {/* Alternative Login */}
                <div className="mt-8 pt-6 border-t border-vault-gray-200 dark:border-vault-gray-700">
                  <p className="text-center text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-4">
                    Need help? Contact support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
