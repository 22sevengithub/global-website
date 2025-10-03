import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-vault-green rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-vault-yellow rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-8 leading-tight">
              Make Wealth a Process,<br />Not a Privilege
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
              Financial freedom is attainable for all. We empower you to build, grow, and protect your wealth through personalised tools, expert advice, and actionable insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-vault-yellow text-vault-black rounded-full font-bold text-lg hover:bg-vault-yellow-light transition-all hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Today
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                Discover Our Vision
              </Link>
            </div>

            {/* Global Expansion Badge */}
            <div className="mt-12 inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <svg className="w-5 h-5 mr-2 text-vault-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">From South Africa to the World • Now Live in UAE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness, Wealth, Wisdom Section */}
      <section className="py-24 bg-vault-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
              We Believe in Making You<br />Financially Fit
            </h2>
            <p className="text-xl text-vault-gray-300 max-w-3xl mx-auto">
              Vault22 is built on three pillars: Wellness, Wealth, and Wisdom
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Wellness */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-vault-blue/10 to-transparent border border-vault-gray-800 hover:border-vault-green transition-all hover:shadow-2xl hover:shadow-vault-green/20">
              <div className="w-16 h-16 bg-vault-green/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-display mb-4 text-vault-green">Wellness</h3>
              <p className="text-vault-gray-300 leading-relaxed">
                Providing tools for budgeting, debt management, insurance, and savings to establish a solid financial foundation.
              </p>
            </div>

            {/* Wealth */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-vault-green/10 to-transparent border border-vault-gray-800 hover:border-vault-green transition-all hover:shadow-2xl hover:shadow-vault-green/20">
              <div className="w-16 h-16 bg-vault-green/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-display mb-4 text-vault-green">Wealth</h3>
              <p className="text-vault-gray-300 leading-relaxed">
                Offering financial advice, goal setting, and asset management (including traditional, Shariah, and digital assets), leveraging AI and machine learning for personalised guidance.
              </p>
            </div>

            {/* Wisdom */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-vault-yellow/10 to-transparent border border-vault-gray-800 hover:border-vault-green transition-all hover:shadow-2xl hover:shadow-vault-green/20">
              <div className="w-16 h-16 bg-vault-green/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold font-display mb-4 text-vault-green">Wisdom</h3>
              <p className="text-vault-gray-300 leading-relaxed">
                Delivering actionable insights, product recommendations, portfolio optimisation, and data-driven financial planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-vault-black mb-6">
              Let's Get Your Finances in Shape
            </h2>
            <p className="text-xl text-vault-gray-600 max-w-3xl mx-auto">
              Everything you need to take control of your financial future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-vault-gray-50 to-white border border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-xl">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold font-display mb-3 text-vault-black">Complete Financial Picture</h3>
              <p className="text-vault-gray-600 leading-relaxed">
                See all your money in one place. Understand your income, expenses, and net worth at a glance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-vault-gray-50 to-white border border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-xl">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold font-display mb-3 text-vault-black">Personalised Financial Plan</h3>
              <p className="text-vault-gray-600 leading-relaxed">
                Get tailored advice on budgeting, saving, and investing based on your unique goals and lifestyle.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-vault-gray-50 to-white border border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-xl">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold font-display mb-3 text-vault-black">Conquer Your Debt</h3>
              <p className="text-vault-gray-600 leading-relaxed">
                Take control of your finances by managing and reducing debt effectively with smart strategies.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-vault-gray-50 to-white border border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-xl">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold font-display mb-3 text-vault-black">Invest Your Way</h3>
              <p className="text-vault-gray-600 leading-relaxed">
                Explore diverse investment options and let our smart tools help you build a strong portfolio.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-vault-gray-50 to-white border border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-xl">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold font-display mb-3 text-vault-black">Protect What Matters</h3>
              <p className="text-vault-gray-600 leading-relaxed">
                Identify your insurance needs and find the right coverage to safeguard your future.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-vault-gray-50 to-white border border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-xl">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold font-display mb-3 text-vault-black">Learn and Grow</h3>
              <p className="text-vault-gray-600 leading-relaxed">
                Boost your financial knowledge with our helpful resources, guides, and expert insights.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-vault-green text-vault-black rounded-full font-bold text-lg hover:bg-vault-green-light transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              Explore All Products
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Expansion Section */}
      <section className="py-24 bg-gradient-to-br from-vault-blue to-vault-blue-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-vault-green/20 rounded-full text-vault-green font-semibold mb-6">
                Going Global
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
                From South Africa to the World
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Building on our success in South Africa, we've launched in the UAE with specialized support. Our proven platform adapts to local needs while delivering world-class financial tools.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-vault-green rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-vault-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold mb-1">Established in South Africa</h4>
                    <p className="text-white/80">Winner of Best Financial Solution 2024, serving thousands of customers</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-vault-green rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-vault-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold mb-1">Now Live in UAE</h4>
                    <p className="text-white/80">Shariah-compliant products, AED support, and local partnerships</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-vault-green rounded-full flex items-center justify-center mt-1">
                    <svg className="w-4 h-4 text-vault-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold mb-1">Global Platform</h4>
                    <p className="text-white/80">Multi-currency support for globally mobile individuals</p>
                  </div>
                </div>
              </div>

              <Link
                href="/about#global"
                className="inline-flex items-center px-6 py-3 bg-white text-vault-blue rounded-full font-bold hover:bg-vault-gray-50 transition-all"
              >
                Learn More About Our Global Vision
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden">
                <div className="w-full h-96 bg-gradient-to-br from-vault-green/20 to-vault-yellow/20 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                  <svg className="w-32 h-32 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-vault-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-vault-gray-300 mb-12">
            Join thousands of users who are taking control of their wealth with Vault22
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-vault-green text-vault-black rounded-full font-bold text-lg hover:bg-vault-green-light transition-all hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Now
            </Link>
            <Link
              href="/faq"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
