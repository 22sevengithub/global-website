import Layout from '../components/Layout';
import Link from 'next/link';

export default function App() {
  return (
    <Layout
      title="Vault22 App | Complete Financial Fitness Platform"
      description="Explore Vault22's comprehensive financial wellness platform. Track spending, manage budgets, invest smartly, and achieve your financial goals with AI-powered insights."
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-vault-black via-vault-gray-900 to-vault-blue-dark text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-vault-green rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-vault-yellow rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-vault-green/20 backdrop-blur-sm rounded-full border border-vault-green/30 mb-8">
              <span className="w-2 h-2 bg-vault-green rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium text-vault-green">Your Complete Financial Command Center</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold font-display mb-8 leading-tight">
              One App.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vault-green via-vault-green-light to-vault-yellow">
                All Your Money.
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
              Track every account, optimize every decision, and achieve every goal. Vault22 brings your entire financial life into one powerful, intelligent platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/contact"
                className="px-8 py-4 bg-vault-green text-vault-black rounded-full font-bold text-lg hover:bg-vault-green-light transition-all hover:shadow-xl hover:shadow-vault-green/50 transform hover:-translate-y-1"
              >
                Start Free Today
              </Link>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-vault-green mb-2">300+</div>
                <div className="text-sm text-white/70">Banks Connected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-vault-green mb-2">50K+</div>
                <div className="text-sm text-white/70">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-vault-green mb-2">$500M+</div>
                <div className="text-sm text-white/70">Assets Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-vault-green mb-2">4.8★</div>
                <div className="text-sm text-white/70">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-vault-black mb-6">
              Everything You Need to Win with Money
            </h2>
            <p className="text-xl text-vault-gray-600 max-w-3xl mx-auto">
              Six powerful modules working together to transform your financial future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Account Aggregation */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-vault-gray-50 to-white border-2 border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-2xl hover:shadow-vault-green/10 hover:-translate-y-2 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vault-green/5 rounded-full blur-2xl group-hover:bg-vault-green/10 transition-all" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-vault-green to-vault-green-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold font-display mb-4 text-vault-black">Account Aggregation</h3>
                <p className="text-vault-gray-600 leading-relaxed mb-6">
                  Connect all your financial accounts in one place. Banks, credit cards, investments, crypto, and more.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Open banking integration (UAE)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Multi-currency support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Real-time sync & updates</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2: Smart Transactions */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-vault-gray-50 to-white border-2 border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-2xl hover:shadow-vault-green/10 hover:-translate-y-2 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vault-blue/5 rounded-full blur-2xl group-hover:bg-vault-blue/10 transition-all" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-vault-blue to-vault-blue-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold font-display mb-4 text-vault-black">Smart Transactions</h3>
                <p className="text-vault-gray-600 leading-relaxed mb-6">
                  Automatically categorize and track every transaction. Split bills, add tags, and gain deep insights.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">AI-powered categorization</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Split transactions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Custom tags & notes</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Intelligent Budgeting */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-vault-gray-50 to-white border-2 border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-2xl hover:shadow-vault-green/10 hover:-translate-y-2 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vault-yellow/5 rounded-full blur-2xl group-hover:bg-vault-yellow/10 transition-all" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-vault-yellow to-vault-yellow-dark rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-vault-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold font-display mb-4 text-vault-black">Intelligent Budgeting</h3>
                <p className="text-vault-gray-600 leading-relaxed mb-6">
                  Create flexible budgets that adapt to your lifestyle. Get alerts before you overspend.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Pay period-based budgets</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Smart alerts at 50%, 80%, 100%</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Category & spending groups</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 4: Goal-Based Investing */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-vault-gray-50 to-white border-2 border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-2xl hover:shadow-vault-green/10 hover:-translate-y-2 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vault-green/5 rounded-full blur-2xl group-hover:bg-vault-green/10 transition-all" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-vault-green-dark to-vault-green rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold font-display mb-4 text-vault-black">Goal-Based Investing</h3>
                <p className="text-vault-gray-600 leading-relaxed mb-6">
                  Set financial goals and get AI-powered investment strategies to achieve them faster.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">AI investment recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Retirement, emergency, custom goals</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Risk profiling & optimization</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 5: Investment Management */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-vault-gray-50 to-white border-2 border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-2xl hover:shadow-vault-green/10 hover:-translate-y-2 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vault-blue/5 rounded-full blur-2xl group-hover:bg-vault-blue/10 transition-all" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-vault-blue-gradient-start to-vault-blue-gradient-end rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold font-display mb-4 text-vault-black">Investment Management</h3>
                <p className="text-vault-gray-600 leading-relaxed mb-6">
                  Open investment accounts, manage portfolios, and track performance all in one place.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Integrated KYC & account opening</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Shariah-compliant products</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Portfolio tracking & analytics</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 6: Financial Health Score */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-vault-gray-50 to-white border-2 border-vault-gray-200 hover:border-vault-green transition-all hover:shadow-2xl hover:shadow-vault-green/10 hover:-translate-y-2 duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vault-green/5 rounded-full blur-2xl group-hover:bg-vault-green/10 transition-all" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-vault-green to-vault-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold font-display mb-4 text-vault-black">Financial Health Score</h3>
                <p className="text-vault-gray-600 leading-relaxed mb-6">
                  Get a comprehensive 0-100 score tracking your overall financial fitness with personalized recommendations.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">5 categories: Savings, Insurance, Investments, Debt, Spending</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Progress tracking over time</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-vault-green mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-vault-gray-700">Personalized action plans</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-gradient-to-br from-vault-gray-900 to-vault-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Your Personalized Financial Dashboard
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Customize your view with powerful widgets that put the most important information at your fingertips
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Widget Cards */}
            {[
              { icon: '💰', title: 'Net Worth', desc: 'Assets vs Liabilities' },
              { icon: '📊', title: 'Budget Breakdown', desc: 'Spending by category' },
              { icon: '💸', title: 'Money In/Out', desc: 'Cash flow tracking' },
              { icon: '🏪', title: 'Top Merchants', desc: 'Where you spend most' },
              { icon: '🎯', title: 'Goal Progress', desc: 'Track your targets' },
              { icon: '📈', title: 'Spend Breakdown', desc: 'Visual analytics' },
              { icon: '💳', title: 'Overall Spend', desc: 'Total expenses' },
              { icon: '📅', title: 'Payday Countdown', desc: 'Days until payday' },
              { icon: '🔔', title: 'Smart Nudges', desc: 'Action items & tips' },
              { icon: '⭐', title: 'Fitness Score', desc: 'Financial health 0-100' }
            ].map((widget, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-vault-green transition-all hover:scale-105 duration-300 cursor-pointer">
                <div className="text-4xl mb-3">{widget.icon}</div>
                <h4 className="font-bold text-white mb-1">{widget.title}</h4>
                <p className="text-sm text-white/60">{widget.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-white/70 mb-4">Drag, drop, and customize your perfect financial command center</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-display text-vault-black mb-6">
              Getting Started is Simple
            </h2>
            <p className="text-xl text-vault-gray-600 max-w-3xl mx-auto">
              From signup to financial mastery in just a few steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up',
                desc: 'Create your account with email verification and secure password',
                icon: '✍️'
              },
              {
                step: '2',
                title: 'Connect Accounts',
                desc: 'Link your bank accounts via open banking or add manually',
                icon: '🔗'
              },
              {
                step: '3',
                title: 'Set Goals',
                desc: 'Define your financial goals and get AI-powered recommendations',
                icon: '🎯'
              },
              {
                step: '4',
                title: 'Track & Grow',
                desc: 'Monitor progress, adjust budgets, and achieve financial freedom',
                icon: '🚀'
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-vault-green to-vault-green-dark rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-vault-yellow rounded-full flex items-center justify-center font-bold text-vault-black text-sm shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold font-display text-vault-black mb-3">{item.title}</h3>
                <p className="text-vault-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-24 bg-vault-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-display text-vault-black mb-6">
                Bank-Level Security.<br />
                Your Privacy First.
              </h2>
              <p className="text-xl text-vault-gray-600 mb-8 leading-relaxed">
                We use the same encryption and security standards as major financial institutions. Your data is protected, never sold, and always under your control.
              </p>
              <div className="space-y-4">
                {[
                  '256-bit encryption for all data',
                  'Two-factor authentication (2FA)',
                  'Biometric login support',
                  'Regular security audits',
                  'GDPR & data privacy compliant',
                  'Read-only bank connections'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-6 h-6 bg-vault-green rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-vault-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-vault-green/10 to-vault-blue/10 border-2 border-vault-gray-200 flex items-center justify-center p-12">
                <svg className="w-full h-full text-vault-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-vault-green via-vault-green-dark to-vault-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-vault-yellow rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold font-display mb-6">
            Ready to Take Control?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
            Join thousands of users who are building wealth, achieving goals, and securing their financial future with Vault22.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-10 py-5 bg-white text-vault-green rounded-full font-bold text-lg hover:bg-vault-gray-50 dark:hover:bg-vault-gray-600 transition-all hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Your Journey Today
            </Link>
            <Link
              href="/products"
              className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
            >
              Explore Products
            </Link>
          </div>
          <p className="mt-8 text-white/70">No credit card required • Free to start • Cancel anytime</p>
        </div>
      </section>
    </Layout>
  );
}
