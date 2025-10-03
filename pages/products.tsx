import Layout from '../components/Layout';
import Link from 'next/link';

export default function Products() {
  const products = [
    {
      id: 'financial-management',
      icon: '📊',
      name: 'Financial Management Products',
      description: 'Budgeting, goal setting, and calculators for responsible financial planning',
      features: ['Smart budgeting tools', 'Goal tracking', 'Financial calculators', 'Expense categorization'],
      color: 'from-vault-blue/10 to-vault-green/10'
    },
    {
      id: 'saving-vaults',
      icon: '💰',
      name: 'Saving Vaults',
      description: 'Earn the highest return / interest in the market',
      features: ['Competitive interest rates', 'Flexible terms', 'No lock-in periods', 'Instant access'],
      color: 'from-vault-green/10 to-vault-blue/10'
    },
    {
      id: 'growth-vaults',
      icon: '📈',
      name: 'Growth+ Vaults',
      description: 'Invest in minutes (requiring only Emirates ID for UAE)',
      features: ['Quick Emirates ID verification', 'Diversified portfolios', 'Professional management', 'Low minimum investment'],
      color: 'from-vault-yellow/10 to-vault-green/10'
    },
    {
      id: 'invest',
      icon: '💎',
      name: 'Vault22 Invest',
      description: 'No minimum required; access innovative theme-based funds, risk-based funds, and shariah-compliant funds',
      features: ['Theme-based investing', 'Risk-adjusted portfolios', 'Shariah-compliant options', 'AI-powered recommendations'],
      color: 'from-vault-blue/10 to-vault-yellow/10'
    },
    {
      id: 'protect',
      icon: '🛡️',
      name: 'Protect',
      description: 'Access competitive insurance products to safeguard against uncertainties',
      features: ['Life insurance', 'Health coverage', 'Asset protection', 'Competitive premiums'],
      color: 'from-vault-green/10 to-vault-blue/10'
    }
  ];

  return (
    <Layout
      title="Products | Vault22"
      description="Explore Vault22's comprehensive suite of financial products including savings, investments, insurance, and wealth management tools."
    >
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-white via-vault-green-50 to-white py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-45">
          <img
            src="/images/backgrounds/hero-products.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-vault-green-50/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-vault-green-50 border border-vault-green-100 rounded-full mb-6">
            <span className="text-xs font-medium text-vault-green-900">Our Products</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-vault-black mb-5 leading-tight">
            Discover Our Products
          </h1>
          <p className="text-base md:text-lg text-vault-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to build, grow, and protect your wealth in one comprehensive platform
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                id={product.id}
                className={`grid md:grid-cols-2 gap-6 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="bg-white rounded-xl p-6 border border-vault-gray-200 hover:border-vault-gray-300 hover:shadow-sm transition-all">
                    <div className="text-4xl mb-3">{product.icon}</div>
                    <h2 className="text-xl font-bold font-display text-vault-black mb-2">
                      {product.name}
                    </h2>
                    <p className="text-sm text-vault-gray-600 mb-4">
                      {product.description}
                    </p>
                    <ul className="space-y-2">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <svg className="w-4 h-4 text-vault-green mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-vault-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <Link
                    href="/contact"
                    className="inline-block px-6 py-2.5 bg-vault-green text-white rounded-lg font-semibold text-sm hover:bg-vault-green-dark transition-colors shadow-sm hover:shadow-md"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-vault-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-sm text-vault-gray-300 mb-6">
            Choose the right product for your financial goals
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-2.5 bg-vault-green text-white rounded-lg font-semibold text-sm hover:bg-vault-green-dark transition-colors shadow-sm hover:shadow-md"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </Layout>
  );
}
