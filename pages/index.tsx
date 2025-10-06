import Layout from '../components/Layout';
import FeatureCard from '../components/FeatureCard';
import ProductFeatureCard from '../components/ProductFeatureCard';
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

        {/* Stats Overlay - Two columns below header */}
        <div className="absolute top-4 left-6 lg:left-8 space-y-3">
          {/* Top Left - Projects */}
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-vault-gray-100">
            <div className="w-12 h-12 bg-vault-green/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-vault-black">1200+</div>
              <div className="text-xs text-vault-gray-600">Projects Completed</div>
            </div>
          </div>

          {/* Bottom Left - Awards */}
          <div className="hidden md:flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-vault-gray-100">
            <div className="w-12 h-12 bg-vault-green/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-vault-black">4+</div>
              <div className="text-xs text-vault-gray-600">Awards</div>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-6 lg:right-8 space-y-3">
          {/* Top Right - Brands */}
          <div className="hidden md:flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-vault-gray-100">
            <div className="w-12 h-12 bg-vault-green/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-vault-black">100+</div>
              <div className="text-xs text-vault-gray-600">Brands Served</div>
            </div>
          </div>

          {/* Bottom Right - Experience */}
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-vault-gray-100">
            <div className="w-12 h-12 bg-vault-green/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-bold text-vault-black">14+</div>
              <div className="text-xs text-vault-gray-600">Years Of Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features Grid */}
      <section className="py-16 bg-white border-b border-vault-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-vault-black mb-3">
              Everything You Need to Succeed
            </h2>
            <p className="text-base text-vault-gray-600 max-w-2xl mx-auto">
              Powerful tools to help you track, save, invest, and grow your wealth
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <ProductFeatureCard
              icon={
                <svg className="w-full h-full text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Track your money"
              description="See all your accounts, spending, and savings in one dashboard"
            />
            <ProductFeatureCard
              icon={
                <svg className="w-full h-full text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
              title="Set money goals"
              description="Create goal-based vaults and track your progress visually"
            />
            <ProductFeatureCard
              icon={
                <svg className="w-full h-full text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Save smarter"
              description="Grow your money with the best interest rates through Saving Vaults"
            />
            <ProductFeatureCard
              icon={
                <svg className="w-full h-full text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
              title="Automate savings"
              description="Enable autosave or round-up rules to grow your balance effortlessly"
            />
            <ProductFeatureCard
              icon={
                <svg className="w-full h-full text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              title="Invest wisely"
              description="Explore Growth+ Vaults — themed, risk-based, or Shariah-compliant"
            />
            <ProductFeatureCard
              icon={
                <svg className="w-full h-full text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Get protected"
              description="Access competitive insurance options with full transparency"
            />
            <ProductFeatureCard
              icon={
                <svg className="w-full h-full text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
              title="Watch your wealth"
              description="View total wealth — savings, investments, and returns in one dashboard"
            />
            <ProductFeatureCard
              icon={
                <svg className="w-full h-full text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
              title="Plan your future"
              description="Use smart calculators to plan for retirement or education"
            />
            <ProductFeatureCard
              icon={
                <svg className="w-full h-full text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
              title="Invest your values"
              description="Choose ethical or Shariah-compliant investments that reflect your beliefs"
            />
            <ProductFeatureCard
              icon={
                <svg className="w-full h-full text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              title="Get smart tips"
              description="Receive real-time tips and tailored recommendations"
            />
          </div>
        </div>
      </section>

      {/* Wellness, Wealth, Wisdom Section */}
      <section className="py-16 bg-vault-gray-50">
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
            <FeatureCard
              icon="❤️"
              title="Wellness"
              description="Tools for budgeting, debt management, insurance, and savings to establish a solid financial foundation."
              pattern="dots"
            />
            <FeatureCard
              icon="📈"
              title="Wealth"
              description="Financial advice, goal setting, and asset management with AI-powered personalised guidance for growth."
              pattern="grid"
            />
            <FeatureCard
              icon="💡"
              title="Wisdom"
              description="Actionable insights, product recommendations, and data-driven financial planning for smarter decisions."
              pattern="waves"
            />
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
                className="inline-flex items-center px-6 py-3 bg-vault-green text-white rounded-lg font-semibold text-base hover:bg-vault-green-dark transition-all shadow-sm hover:shadow-md"
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
