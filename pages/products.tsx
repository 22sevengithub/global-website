import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';

export default function Products() {
  const products = [
    {
      id: 'financial-management',
      icon: '📊',
      name: 'Financial Management Products',
      description: 'Budgeting, goal setting, and calculators for responsible financial planning',
      features: ['Smart budgeting tools', 'Goal tracking', 'Financial calculators', 'Expense categorization'],
      pattern: 'dots' as const
    },
    {
      id: 'saving-vaults',
      icon: '💰',
      name: 'Saving Vaults',
      description: 'Earn the highest return / interest in the market',
      features: ['Competitive interest rates', 'Flexible terms', 'No lock-in periods', 'Instant access'],
      pattern: 'grid' as const
    },
    {
      id: 'growth-vaults',
      icon: '📈',
      name: 'Growth+ Vaults',
      description: 'Invest in minutes (requiring only Emirates ID for UAE)',
      features: ['Quick Emirates ID verification', 'Diversified portfolios', 'Professional management', 'Low minimum investment'],
      pattern: 'waves' as const
    },
    {
      id: 'invest',
      icon: '💎',
      name: 'Vault22 Invest',
      description: 'No minimum required; access innovative theme-based funds, risk-based funds, and shariah-compliant funds',
      features: ['Theme-based investing', 'Risk-adjusted portfolios', 'Shariah-compliant options', 'AI-powered recommendations'],
      pattern: 'gradient' as const
    },
    {
      id: 'protect',
      icon: '🛡️',
      name: 'Protect',
      description: 'Access competitive insurance products to safeguard against uncertainties',
      features: ['Life insurance', 'Health coverage', 'Asset protection', 'Competitive premiums'],
      pattern: 'dots' as const
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
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((product) => (
              <div key={product.id} id={product.id}>
                <ProductCard
                  icon={product.icon}
                  name={product.name}
                  description={product.description}
                  features={product.features}
                  pattern={product.pattern}
                />
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
