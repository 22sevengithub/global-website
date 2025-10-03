import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-vault-green-50 to-white">
        <div className="absolute inset-0 opacity-50">
          <img
            src="/images/backgrounds/hero-home.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-vault-green-50/30 to-white/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1.5 bg-vault-green-50 border border-vault-green-100 rounded-full mb-6">
              <svg className="w-3.5 h-3.5 mr-1.5 text-vault-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium text-vault-green-900">Now Live in UAE • Global Banking Made Simple</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-5 leading-tight text-vault-black">
              Make Wealth a Process,<br />Not a Privilege
            </h1>
            <p className="text-base md:text-lg mb-8 text-vault-gray-600 leading-relaxed max-w-2xl mx-auto">
              Financial freedom is attainable for all. We empower you to build, grow, and protect your wealth through personalised tools and expert insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/contact"
                className="px-6 py-2.5 bg-vault-green text-white rounded-lg font-semibold text-sm hover:bg-vault-green-dark transition-colors shadow-sm hover:shadow-md"
              >
                Get Started Today
              </Link>
              <Link
                href="/about"
                className="px-6 py-2.5 bg-white text-vault-gray-700 border border-vault-gray-200 rounded-lg font-semibold text-sm hover:border-vault-gray-300 hover:bg-vault-gray-50 transition-colors"
              >
                Discover Our Vision
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness, Wealth, Wisdom Section */}
      <section className="py-16 bg-white bg-grid-pattern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-3 text-vault-black">
              Built on Three Pillars
            </h2>
            <p className="text-base text-vault-gray-600 max-w-2xl mx-auto">
              Wellness, Wealth, and Wisdom for complete financial fitness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Wellness */}
            <div className="group p-6 rounded-xl bg-white border border-vault-gray-200 hover:border-vault-gray-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-vault-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-vault-green-100 transition-colors">
                <svg className="w-5 h-5 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-display mb-2 text-vault-black">Wellness</h3>
              <p className="text-vault-gray-600 leading-relaxed text-sm">
                Tools for budgeting, debt management, insurance, and savings to establish a solid financial foundation.
              </p>
            </div>

            {/* Wealth */}
            <div className="group p-6 rounded-xl bg-white border border-vault-gray-200 hover:border-vault-gray-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-vault-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-vault-green-100 transition-colors">
                <svg className="w-5 h-5 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-display mb-2 text-vault-black">Wealth</h3>
              <p className="text-vault-gray-600 leading-relaxed text-sm">
                Financial advice, goal setting, and asset management with AI-powered personalised guidance for growth.
              </p>
            </div>

            {/* Wisdom */}
            <div className="group p-6 rounded-xl bg-white border border-vault-gray-200 hover:border-vault-gray-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-vault-green-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-vault-green-100 transition-colors">
                <svg className="w-5 h-5 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-display mb-2 text-vault-black">Wisdom</h3>
              <p className="text-vault-gray-600 leading-relaxed text-sm">
                Actionable insights, product recommendations, and data-driven financial planning for smarter decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-vault-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-vault-black mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-vault-gray-600 max-w-2xl mx-auto">
              Complete financial tools to help you succeed
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-6 rounded-xl bg-white border border-vault-gray-200 hover:border-vault-green hover:shadow-md transition-all">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-bold font-display mb-2 text-vault-black">Complete Financial Picture</h3>
              <p className="text-vault-gray-600 leading-relaxed text-sm">
                See all your money in one place. Track income, expenses, and net worth effortlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-xl bg-white border border-vault-gray-200 hover:border-vault-green hover:shadow-md transition-all">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-bold font-display mb-2 text-vault-black">Personalised Financial Plan</h3>
              <p className="text-vault-gray-600 leading-relaxed text-sm">
                Tailored advice on budgeting, saving, and investing based on your unique goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-xl bg-white border border-vault-gray-200 hover:border-vault-green hover:shadow-md transition-all">
              <div className="text-3xl mb-4">💪</div>
              <h3 className="text-lg font-bold font-display mb-2 text-vault-black">Conquer Your Debt</h3>
              <p className="text-vault-gray-600 leading-relaxed text-sm">
                Smart strategies to manage and reduce debt effectively and regain control.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-xl bg-white border border-vault-gray-200 hover:border-vault-green hover:shadow-md transition-all">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-lg font-bold font-display mb-2 text-vault-black">Invest Your Way</h3>
              <p className="text-vault-gray-600 leading-relaxed text-sm">
                Diverse investment options with smart tools to build a strong portfolio.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-6 rounded-xl bg-white border border-vault-gray-200 hover:border-vault-green hover:shadow-md transition-all">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-lg font-bold font-display mb-2 text-vault-black">Protect What Matters</h3>
              <p className="text-vault-gray-600 leading-relaxed text-sm">
                Find the right insurance coverage to safeguard your future and loved ones.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-6 rounded-xl bg-white border border-vault-gray-200 hover:border-vault-green hover:shadow-md transition-all">
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-bold font-display mb-2 text-vault-black">Learn and Grow</h3>
              <p className="text-vault-gray-600 leading-relaxed text-sm">
                Helpful resources, guides, and expert insights to boost your financial knowledge.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/products"
              className="inline-flex items-center px-7 py-3 bg-vault-green text-white rounded-lg font-semibold text-base hover:bg-vault-green-dark transition-all hover:shadow-md"
            >
              Explore All Products
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Expansion Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-vault-green-50 rounded-full text-vault-green-900 font-semibold mb-6 text-sm">
                Going Global
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-6 text-vault-black">
                From South Africa to the World
              </h2>
              <p className="text-lg text-vault-gray-600 mb-8 leading-relaxed">
                Building on our success in South Africa, we've launched in the UAE with specialized support. Our proven platform adapts to local needs while delivering world-class financial tools.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-vault-green rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-vault-black mb-1 text-sm">Established in South Africa</h4>
                    <p className="text-vault-gray-600 text-sm">Winner of Best Financial Solution 2024, serving thousands of customers</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-vault-green rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-vault-black mb-1 text-sm">Now Live in UAE</h4>
                    <p className="text-vault-gray-600 text-sm">Shariah-compliant products, AED support, and local partnerships</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-vault-green rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-vault-black mb-1 text-sm">Global Platform</h4>
                    <p className="text-vault-gray-600 text-sm">Multi-currency support for globally mobile individuals</p>
                  </div>
                </div>
              </div>

              <Link
                href="/about#global"
                className="inline-flex items-center px-6 py-3 bg-vault-green text-white rounded-lg font-semibold text-base hover:bg-vault-green-dark transition-all"
              >
                Learn More About Our Global Vision
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden">
                <div className="w-full h-96 bg-gradient-to-br from-vault-green-50 to-vault-green-100 rounded-2xl border border-vault-gray-200 flex items-center justify-center">
                  <svg className="w-32 h-32 text-vault-green/30" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-vault-black text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 text-white">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-lg text-vault-gray-400 mb-10">
            Join thousands of users who are taking control of their wealth with Vault22
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-vault-green text-white rounded-lg font-semibold text-base hover:bg-vault-green-dark transition-all hover:shadow-lg"
            >
              Get Started Now
            </Link>
            <Link
              href="/faq"
              className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg font-semibold text-base hover:bg-white/20 transition-all"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
