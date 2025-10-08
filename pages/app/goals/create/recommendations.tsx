import AppShell from '../../../../components/AppShell';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import LoadingAnimation from '../../../../components/LoadingAnimation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../../../contexts/AppContext';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { formatMoney } from '../../../../utils/currency';
import { goalsApi } from '../../../../services/api';
import { Product } from '../../../../types';

export default function GoalRecommendations() {
  const router = useRouter();
  const { goalId, goalName, riskProfile, initialDeposit, recurringDeposit } = router.query;
  const { aggregate, customerInfo, loading: contextLoading } = useApp();
  const { selectedCurrency } = useCurrency();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShariahOnly, setShowShariahOnly] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (aggregate?.products && goalId) {
      // Get products from aggregate or fetch recommendations
      fetchProductRecommendations();
    }
  }, [aggregate, goalId, riskProfile]);

  const fetchProductRecommendations = async () => {
    try {
      setLoading(true);

      // Try to fetch recommendations from API
      if (customerInfo?.id && goalId) {
        try {
          const response = await goalsApi.getProductRecommendations(
            customerInfo.id,
            goalId as string,
            riskProfile as string
          );
          setProducts(response.products || []);
        } catch (err) {
          console.warn('Could not fetch recommendations, using aggregate products');
          // Fallback to aggregate products
          setProducts(aggregate?.products || []);
        }
      } else {
        // Use aggregate products as fallback
        setProducts(aggregate?.products || []);
      }
    } catch (err) {
      console.error('Failed to load product recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = showShariahOnly
    ? products.filter(p => p.isShariahCompliant)
    : products;

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleContinue = async () => {
    if (!selectedProduct || !customerInfo?.id || !goalId) return;

    setSubmitting(true);

    try {
      console.log('💰 [Product Selection] Submitting goal investment with product:', selectedProduct.id);

      // Post goal investment (links product to goal)
      // CRITICAL: Match mobile app exactly - only send goalId and productId
      await goalsApi.postGoalInvestments(customerInfo.id, {
        goalId: goalId as string,
        productId: selectedProduct.id,
      });

      console.log('✅ [Product Selection] Goal investment created successfully');

      // Navigate to success/onboarding page
      router.push({
        pathname: '/app/goals/create/success',
        query: {
          goalId,
          goalName,
          productId: selectedProduct.id,
          productName: selectedProduct.name,
        }
      });
    } catch (err: any) {
      console.error('❌ [Product Selection] Failed to create goal investment:', err);
      console.error('Error details:', err.response?.data);
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to setup goal investment. Please try again.');
      setSubmitting(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    const colors: Record<string, string> = {
      'Low': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'Medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'High': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    };
    return colors[riskLevel] || 'bg-vault-gray-100 text-vault-gray-800';
  };

  if (contextLoading || loading) {
    return (
      <ProtectedRoute>
        <AppShell title="Product Recommendations | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <LoadingAnimation size={150} />
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mt-4">Loading recommendations...</p>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppShell title="Product Recommendations | Vault22">
        <div className="max-w-5xl mx-auto">
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
              Goal & Style Recommendations
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Curated investment products for your {riskProfile} risk profile
            </p>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-700 rounded-full h-1 mb-2">
                <div
                  className="bg-vault-green h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(4 / 6) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Step 4 of 6</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-vault-blue/10 border border-vault-blue/30 rounded-xl p-4 mb-6 flex items-start">
            <svg className="w-5 h-5 text-vault-blue mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="font-bold text-vault-black dark:text-white mb-1">Why these products?</h3>
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                These investment products are recommended based on your risk profile, investment timeline, and financial goals. Each product is carefully selected to help you achieve your target.
              </p>
            </div>
          </div>

          {/* Shariah Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-vault-black dark:text-white">
              {showShariahOnly ? 'Shariah-Compliant' : 'All'} Investment Products
            </h2>
            <button
              onClick={() => setShowShariahOnly(!showShariahOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showShariahOnly ? 'bg-vault-green' : 'bg-vault-gray-300 dark:bg-vault-gray-600'}`}
            >
              <span className="sr-only">Toggle Shariah filter</span>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showShariahOnly ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Products Grid */}
          <div className="space-y-4 mb-8">
            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-12 text-center">
                <p className="text-vault-gray-600 dark:text-vault-gray-400">
                  No products available matching your criteria.
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className={`
                    w-full text-left rounded-2xl border-2 transition-all cursor-pointer overflow-hidden
                    ${selectedProduct?.id === product.id
                      ? 'border-vault-green bg-vault-green/5 ring-2 ring-vault-green ring-offset-2'
                      : 'border-vault-gray-200 dark:border-vault-gray-700 bg-white dark:bg-vault-gray-800 hover:border-vault-green/50'
                    }
                  `}
                >
                  {/* Shariah Banner */}
                  {product.isShariahCompliant && (
                    <div className="bg-vault-green/10 dark:bg-vault-green/20 px-4 py-2 text-center">
                      <p className="text-xs font-semibold text-vault-green">✓ Shariah Compliant Portfolio</p>
                    </div>
                  )}

                  {/* Main Content */}
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Product Icon/Image */}
                      {product.iconUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={product.iconUrl}
                            alt={product.name}
                            className="w-16 h-16 object-contain rounded-lg"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-xl font-bold text-vault-black dark:text-white">
                            {product.name}
                          </h3>
                          {selectedProduct?.id === product.id && (
                            <svg className="w-6 h-6 text-vault-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-vault-gray-50 dark:bg-vault-gray-700/50 rounded-xl">
                      <div>
                        <p className="text-xs text-vault-gray-500 dark:text-vault-gray-400 mb-1">Risk Level</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getRiskColor(product.riskLevel)}`}>
                          {product.riskLevel || 'Medium'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-vault-gray-500 dark:text-vault-gray-400 mb-1">Expected Return</p>
                        <p className="text-sm font-bold text-vault-black dark:text-white">
                          {product.expectedReturn || 'Variable'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-vault-gray-500 dark:text-vault-gray-400 mb-1">Minimum Investment</p>
                        <p className="text-sm font-bold text-vault-black dark:text-white">
                          {formatMoney(product.minimumInvestment || 0, selectedCurrency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-vault-gray-500 dark:text-vault-gray-400 mb-1">Management Fee</p>
                        <p className="text-sm font-bold text-vault-black dark:text-white">
                          {product.fees?.[0]?.percentage ? `${product.fees[0].percentage}%` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Find Out More Link */}
                    <div className="mt-4 flex items-center text-vault-green hover:text-vault-green-dark text-sm font-semibold">
                      <span>View Portfolio Details</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Continue Button */}
          <div className="sticky bottom-0 bg-white dark:bg-vault-gray-900 py-6 border-t border-vault-gray-200 dark:border-vault-gray-700">
            <button
              onClick={handleContinue}
              disabled={!selectedProduct || submitting}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center
                ${selectedProduct && !submitting
                  ? 'bg-vault-green text-vault-black dark:text-white hover:bg-vault-green-light'
                  : 'bg-vault-gray-300 dark:bg-vault-gray-700 text-vault-gray-500 cursor-not-allowed'
                }
              `}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Setting up goal...
                </>
              ) : (
                'Continue to Account Setup'
              )}
            </button>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
