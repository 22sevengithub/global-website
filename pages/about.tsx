import Layout from '../components/Layout';
import Link from 'next/link';

export default function About() {
  return (
    <Layout
      title="About Vault22 | Our Global Vision"
      description="Learn about Vault22's mission to make wealth a process, not a privilege. Discover our expansion from South Africa to UAE."
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-vault-green-50 to-white py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-55">
          <img
            src="/images/backgrounds/vault22-top-image.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-vault-green-50/40 to-white/35" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-vault-green-50 border border-vault-green-100 rounded-full mb-8">
            <span className="text-xs font-medium text-vault-green-900">About Vault22</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-vault-black mb-8 leading-tight">
            Designed to Support You
          </h1>
          <p className="text-base md:text-lg text-vault-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to make financial freedom attainable for all. Through innovative technology and expert guidance, we empower individuals to build, grow, and protect their wealth globally.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold font-display text-vault-black mb-8">
                Our Mission
              </h2>
              <p className="text-lg text-vault-gray-700 leading-relaxed mb-8">
                At Vault22, we believe that wealth building should be a systematic process accessible to everyone, not a privilege reserved for the few. We're breaking down barriers to financial success through:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-vault-green mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong className="text-vault-black">Simple, Clear Communication</strong>
                    <p className="text-vault-gray-600">No jargon, just straightforward financial guidance</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-vault-green mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong className="text-vault-black">Digital-First Experience</strong>
                    <p className="text-vault-gray-600">Modern, mobile-first platform for today's lifestyle</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-vault-green mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong className="text-vault-black">Personalized Solutions</strong>
                    <p className="text-vault-gray-600">Tailored financial tools and advice for your unique goals</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-primary opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-vault-black">Inspiring Financial Freedom</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-display text-vault-black mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-vault-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-vault-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💚</span>
              </div>
              <h3 className="text-xl font-bold text-vault-black mb-2">Customer-Centric</h3>
              <p className="text-vault-gray-600">Your success is our success. We prioritize your needs above all.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-vault-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-vault-black mb-2">Innovative</h3>
              <p className="text-vault-gray-600">Leveraging cutting-edge technology to deliver exceptional value.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-vault-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-vault-black mb-2">Trustworthy</h3>
              <p className="text-vault-gray-600">Your financial partner, committed to transparency and security.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-vault-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-vault-black mb-2">Empowering</h3>
              <p className="text-vault-gray-600">Helping you achieve financial fitness and reach your life goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Expansion Section */}
      <section id="global" className="py-20 bg-vault-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-vault-green/20 rounded-full text-vault-green font-semibold mb-8">
              Going Global
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-8">
              Expanding Our Vision Worldwide
            </h2>
            <p className="text-xl text-vault-gray-300 max-w-3xl mx-auto">
              We're taking our mission to make wealth accessible beyond borders, starting with strategic markets in the Middle East and continuing our journey to serve customers globally.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-vault-gray-900 rounded-2xl p-8 border border-vault-gray-800">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold font-display mb-4">Global Platform</h3>
              <p className="text-vault-gray-300">
                A unified platform designed to serve customers across borders with multi-currency support and international best practices.
              </p>
            </div>

            <div className="bg-vault-gray-900 rounded-2xl p-8 border border-vault-gray-800">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold font-display mb-4">Local Expertise</h3>
              <p className="text-vault-gray-300">
                Deep understanding of regional markets, regulations, and cultural nuances to deliver relevant, compliant solutions.
              </p>
            </div>

            <div className="bg-vault-gray-900 rounded-2xl p-8 border border-vault-gray-800">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold font-display mb-4">Scalable Technology</h3>
              <p className="text-vault-gray-300">
                Cloud-native infrastructure built to scale seamlessly as we expand to new markets and serve more customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Focus Section */}
      <section id="regions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-vault-black mb-8">
              Our Regional Presence
            </h2>
            <p className="text-xl text-vault-gray-600 max-w-3xl mx-auto">
              From our established base in South Africa to exciting new markets in the Middle East, we're bringing world-class financial tools to diverse regions.
            </p>
          </div>

          {/* South Africa - Established Market */}
          <div className="mb-12 bg-gradient-to-br from-vault-green/10 to-vault-blue/10 rounded-2xl p-8 border-2 border-vault-green">
            <div className="flex items-center mb-6">
              <div className="text-5xl mr-4">🇿🇦</div>
              <div>
                <h3 className="text-3xl font-bold font-display text-vault-black">South Africa</h3>
                <span className="inline-block px-3 py-1 bg-vault-green text-vault-black text-sm font-semibold rounded-full mt-2">
                  Established Market
                </span>
              </div>
            </div>
            <p className="text-lg text-vault-gray-700 mb-6">
              Our home market where we've built a comprehensive financial platform serving thousands of customers. Winner of Best Financial Solution 2024.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-bold text-vault-black mb-2">Complete Product Suite</h4>
                <p className="text-vault-gray-700 text-sm">
                  Full range of savings, investments, insurance, and financial management tools.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-vault-black mb-2">Local Expertise</h4>
                <p className="text-vault-gray-700 text-sm">
                  Deep understanding of South African financial landscape and regulations.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-vault-black mb-2">ZAR Currency Support</h4>
                <p className="text-vault-gray-700 text-sm">
                  Native South African Rand support with local banking integrations.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-vault-black mb-2">Award-Winning Platform</h4>
                <p className="text-vault-gray-700 text-sm">
                  Recognized for excellence in financial innovation and customer service.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold font-display text-vault-black mb-2">
              Now Live in UAE
            </h3>
            <p className="text-vault-gray-600">
              Bringing our proven platform to the United Arab Emirates with specialized, localized offerings
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            {/* UAE Section */}
            <div className="bg-gradient-to-br from-vault-green/10 to-vault-blue/10 rounded-2xl p-8 border-2 border-vault-green">
              <div className="flex items-center mb-6">
                <div className="text-5xl mr-4">🇦🇪</div>
                <div>
                  <h3 className="text-3xl font-bold font-display text-vault-black">United Arab Emirates</h3>
                  <span className="inline-block px-3 py-1 bg-vault-green text-vault-black text-sm font-semibold rounded-full mt-2">
                    Now Live
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-bold text-vault-black mb-2">Shariah-Compliant Products</h4>
                  <p className="text-vault-gray-700">
                    Full range of Islamic finance solutions including Shariah-compliant investment funds and savings products, certified by leading scholars.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-vault-black mb-2">AED Currency Support</h4>
                  <p className="text-vault-gray-700">
                    Native support for UAE Dirham with seamless currency conversion and local payment methods.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-vault-black mb-2">Local Partnerships</h4>
                  <p className="text-vault-gray-700">
                    Strategic alliances with leading UAE financial institutions to provide the best rates and services.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-vault-black mb-2">Emirates ID Integration</h4>
                  <p className="text-vault-gray-700">
                    Quick onboarding requiring only Emirates ID for most investment products.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Target Markets */}
          <div className="bg-vault-gray-50 rounded-2xl p-12">
            <h3 className="text-2xl font-bold font-display text-vault-black mb-8 text-center">
              Who We Serve
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6">
                <div className="text-3xl mb-3">💼</div>
                <h4 className="font-bold text-vault-black mb-2">Professionals & Expatriates</h4>
                <p className="text-vault-gray-600 text-sm">
                  Globally mobile individuals seeking best returns on cash and hyper-personalized investment options.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-bold text-vault-black mb-2">Day-to-Day Managers</h4>
                <p className="text-vault-gray-600 text-sm">
                  Those looking for better tools to manage daily finances and build healthy financial habits.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="text-3xl mb-3">📈</div>
                <h4 className="font-bold text-vault-black mb-2">Wealth Builders</h4>
                <p className="text-vault-gray-600 text-sm">
                  Individuals managing liabilities well and ready to build wealth for future goals.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="text-3xl mb-3">💎</div>
                <h4 className="font-bold text-vault-black mb-2">Mass Affluent Investors</h4>
                <p className="text-vault-gray-600 text-sm">
                  Those with less than $1M in liquid assets seeking HNWI-level investment opportunities.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="text-3xl mb-3">📱</div>
                <h4 className="font-bold text-vault-black mb-2">Digital-First Users</h4>
                <p className="text-vault-gray-600 text-sm">
                  Tech-savvy individuals who prefer mobile-first experiences and modern interfaces.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="text-3xl mb-3">🌙</div>
                <h4 className="font-bold text-vault-black mb-2">Islamic Finance Seekers</h4>
                <p className="text-vault-gray-600 text-sm">
                  Customers requiring Shariah-compliant investment and savings solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Backed By Section */}
      <section className="py-20 bg-vault-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-vault-gray-500 uppercase tracking-wide mb-4">Backed By</p>
            <div className="flex flex-wrap justify-center items-center gap-12">
              <div className="text-2xl font-bold text-vault-gray-700">SC Ventures</div>
              <div className="text-2xl font-bold text-vault-gray-700">Old Mutual</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-vault-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-6">
            Ready to Join Our Global Community?
          </h2>
          <p className="text-sm text-vault-gray-300 mb-8">
            Start your journey to financial freedom with Vault22 today
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-2.5 bg-vault-green text-white rounded-lg font-semibold text-sm hover:bg-vault-green-dark transition-colors shadow-sm hover:shadow-md"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </Layout>
  );
}
