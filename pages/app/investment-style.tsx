import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useRouter } from 'next/router';
import { useApp } from '../../contexts/AppContext';
import { investmentStyleApi } from '../../services/api';
import { useState, useEffect } from 'react';

interface InvestmentStyle {
  id: string;
  name: string;
  description: string;
  riskLevel: string;
  icon: string;
}

const defaultInvestmentStyles: InvestmentStyle[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Conservative approach with minimal risk. Perfect for those new to investing.',
    riskLevel: 'Low Risk',
    icon: '🌱',
  },
  {
    id: 'playing_it_safe',
    name: 'Playing It Safe',
    description: 'Low to moderate risk with steady, reliable returns.',
    riskLevel: 'Low-Moderate Risk',
    icon: '🛡️',
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Equal balance between risk and reward. A moderate approach to growth.',
    riskLevel: 'Moderate Risk',
    icon: '⚖️',
  },
  {
    id: 'calculated_risk_taker',
    name: 'Calculated Risk Taker',
    description: 'Moderate to high risk for stronger growth potential.',
    riskLevel: 'Moderate-High Risk',
    icon: '📈',
  },
  {
    id: 'high_growth_seeker',
    name: 'High Growth Seeker',
    description: 'Aggressive strategy targeting maximum returns. Higher risk tolerance required.',
    riskLevel: 'High Risk',
    icon: '🚀',
  },
];

export default function InvestmentStyle() {
  const router = useRouter();
  const { customerInfo, loadAggregate } = useApp();
  const [styles, setStyles] = useState<InvestmentStyle[]>(defaultInvestmentStyles);
  const [currentStyle, setCurrentStyle] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<InvestmentStyle | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInvestmentStyle();
  }, []);

  const loadInvestmentStyle = async () => {
    if (!customerInfo?.id) return;

    setLoading(true);
    try {
      // Try to get current style
      const currentStyleData = await investmentStyleApi.getCurrentStyle(customerInfo.id);
      if (currentStyleData?.investmentStyleId) {
        setCurrentStyle(currentStyleData.investmentStyleId);
      }
    } catch (err) {
      console.log('No current investment style set');
    }

    try {
      // Try to get available options from API
      const options = await investmentStyleApi.getStyleOptions(customerInfo.id);
      if (options && options.length > 0) {
        setStyles(options);
      }
    } catch (err) {
      console.log('Using default investment styles');
    } finally {
      setLoading(false);
    }
  };

  const handleStyleClick = (style: InvestmentStyle) => {
    if (style.id === currentStyle) return; // Already selected
    setSelectedStyle(style);
    setShowConfirmModal(true);
  };

  const handleConfirmChange = async () => {
    if (!selectedStyle || !customerInfo?.id) return;

    setSaving(true);
    setError('');

    try {
      await investmentStyleApi.updateStyle(customerInfo.id, selectedStyle.id);
      await loadAggregate();
      setCurrentStyle(selectedStyle.id);
      setShowConfirmModal(false);
      setSelectedStyle(null);
    } catch (err: any) {
      console.error('Failed to update investment style:', err);
      setError(err.message || 'Failed to update investment style. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const StyleCard = ({ style }: { style: InvestmentStyle }) => {
    const isSelected = style.id === currentStyle;

    return (
      <button
        onClick={() => handleStyleClick(style)}
        className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
          isSelected
            ? 'border-vault-green bg-vault-green/10'
            : 'border-vault-gray-200 dark:border-vault-gray-700 bg-white dark:bg-vault-gray-800 hover:border-vault-green/50'
        }`}
      >
        <div className="flex items-start">
          <div className="text-4xl mr-4">{style.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-vault-black dark:text-white">
                {style.name}
              </h3>
              {isSelected && (
                <div className="w-6 h-6 bg-vault-green rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-sm font-semibold text-vault-green mb-2">{style.riskLevel}</p>
            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
              {style.description}
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <ProtectedRoute>
      <AppShell title="Investment Style | Vault22">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              Investment Style
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Choose an investment approach that matches your risk tolerance and financial goals
            </p>
          </div>

          {/* Current Selection */}
          {currentStyle && (
            <div className="bg-vault-green/10 border border-vault-green/30 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-vault-green mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Current Style</p>
                  <p className="text-lg font-semibold text-vault-black dark:text-white">
                    {styles.find((s) => s.id === currentStyle)?.name || currentStyle}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Investment Styles */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-vault-green border-t-transparent"></div>
              <p className="mt-4 text-vault-gray-600 dark:text-vault-gray-400">Loading investment styles...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {styles.map((style) => (
                <StyleCard key={style.id} style={style} />
              ))}
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 bg-vault-blue/10 border border-vault-blue/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-vault-black dark:text-white mb-3 flex items-center">
              <svg className="w-6 h-6 text-vault-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Not Sure Which Style Fits You?
            </h3>
            <p className="text-sm text-vault-gray-700 dark:text-vault-gray-300 mb-4">
              Your investment style should align with your financial goals, time horizon, and comfort with market volatility.
              Consider consulting with a financial advisor if you're uncertain.
            </p>
            <button className="px-4 py-2 bg-vault-blue text-white rounded-xl font-semibold hover:bg-vault-blue/90 transition-all">
              Take Risk Assessment Quiz (Coming Soon)
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && selectedStyle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !saving && setShowConfirmModal(false)}
            />
            <div className="relative bg-white dark:bg-vault-gray-800 rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4">{selectedStyle.icon}</div>
                  <h2 className="text-2xl font-bold font-display text-vault-black dark:text-white mb-3">
                    Change Investment Style?
                  </h2>
                </div>
                <div className="bg-vault-gray-50 dark:bg-vault-gray-900 rounded-xl p-4 mb-4">
                  <p className="text-center font-semibold text-vault-green mb-2">{selectedStyle.name}</p>
                  <p className="text-center text-sm text-vault-gray-600 dark:text-vault-gray-400">
                    {selectedStyle.description}
                  </p>
                </div>
                <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-6 text-center">
                  This will affect investment recommendations for your goals and portfolios.
                </p>

                {error && (
                  <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => !saving && setShowConfirmModal(false)}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-vault-gray-100 dark:bg-vault-gray-700 text-vault-gray-900 dark:text-vault-gray-100 rounded-xl font-semibold hover:bg-vault-gray-200 dark:hover:bg-vault-gray-600 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmChange}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all shadow-lg disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AppShell>
    </ProtectedRoute>
  );
}
