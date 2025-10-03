import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

interface FAQ {
  id: number;
  attributes: {
    question: string;
    answer: string;
    category: string;
    order: number;
    publishedAt: string;
  };
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        const response = await axios.get(`${apiUrl}/api/faqs?populate=*&sort=order&pagination[pageSize]=100`);
        setFaqs(response.data.data || []);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Failed to fetch FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.attributes.category)))];

  let filteredFAQs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.attributes.category === selectedCategory);

  if (searchQuery) {
    filteredFAQs = filteredFAQs.filter(faq =>
      faq.attributes.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.attributes.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <Layout
      title="FAQ | Vault22 Help Centre"
      description="Find answers to your questions about Vault22's products, services, and features. Get help with savings, investments, and financial management."
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-vault-green-50 to-white py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/images/backgrounds/hero-faq.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-vault-green-50/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-3 py-1.5 bg-vault-green-50 border border-vault-green-100 rounded-full mb-6">
              <span className="text-xs font-medium text-vault-green-900">Help Centre</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-vault-black mb-5 leading-tight">
              How Can We Help You?
            </h1>
            <p className="text-base md:text-lg text-vault-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
              Find answers to your questions about Vault22
            </p>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="search"
                placeholder="Search for answers..."
                className="w-full px-5 py-3.5 rounded-lg text-vault-black placeholder-vault-gray-400 bg-white border border-vault-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-vault-green focus:border-vault-green"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-vault-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Topic */}
      <section className="py-12 bg-white border-b border-vault-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-display text-vault-black mb-6 text-center">
            Browse by Topic
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('Getting Started')}
              className={`p-4 rounded-lg transition-colors ${
                selectedCategory === 'Getting Started'
                  ? 'bg-vault-green-50 border border-vault-green text-vault-green'
                  : 'bg-white border border-vault-gray-200 hover:border-vault-green'
              }`}
            >
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-semibold text-vault-black text-xs">Getting Started</h3>
            </button>

            <button
              onClick={() => setSelectedCategory('Account Management')}
              className={`p-4 rounded-lg transition-colors ${
                selectedCategory === 'Account Management'
                  ? 'bg-vault-green-50 border border-vault-green text-vault-green'
                  : 'bg-white border border-vault-gray-200 hover:border-vault-green'
              }`}
            >
              <div className="text-3xl mb-2">👤</div>
              <h3 className="font-semibold text-vault-black text-xs">Account</h3>
            </button>

            <button
              onClick={() => setSelectedCategory('Security')}
              className={`p-4 rounded-lg transition-colors ${
                selectedCategory === 'Security'
                  ? 'bg-vault-green-50 border border-vault-green text-vault-green'
                  : 'bg-white border border-vault-gray-200 hover:border-vault-green'
              }`}
            >
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-vault-black text-xs">Security</h3>
            </button>

            <button
              onClick={() => setSelectedCategory('Billing')}
              className={`p-4 rounded-lg transition-colors ${
                selectedCategory === 'Billing'
                  ? 'bg-vault-green-50 border border-vault-green text-vault-green'
                  : 'bg-white border border-vault-gray-200 hover:border-vault-green'
              }`}
            >
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-semibold text-vault-black text-xs">Billing</h3>
            </button>

            <button
              onClick={() => setSelectedCategory('Features')}
              className={`p-4 rounded-lg transition-colors ${
                selectedCategory === 'Features'
                  ? 'bg-vault-green-50 border border-vault-green text-vault-green'
                  : 'bg-white border border-vault-gray-200 hover:border-vault-green'
              }`}
            >
              <div className="text-3xl mb-2">⭐</div>
              <h3 className="font-semibold text-vault-black text-xs">Features</h3>
            </button>

            <button
              onClick={() => setSelectedCategory('Troubleshooting')}
              className={`p-4 rounded-lg transition-colors ${
                selectedCategory === 'Troubleshooting'
                  ? 'bg-vault-green-50 border border-vault-green text-vault-green'
                  : 'bg-white border border-vault-gray-200 hover:border-vault-green'
              }`}
            >
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="font-semibold text-vault-black text-xs">Troubleshooting</h3>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-vault-green text-white'
                    : 'bg-white text-vault-gray-700 hover:bg-vault-gray-50 border border-vault-gray-200'
                }`}
              >
                {category === 'all' ? 'All Topics' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-vault-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold font-display text-vault-black mb-6">
            Frequently Asked Questions
          </h2>

          {/* FAQ List */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-vault-green"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!loading && !error && filteredFAQs.length === 0 && (
            <div className="text-center py-12 text-vault-gray-500 text-sm">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : 'No FAQs available in this category'
              }
            </div>
          )}

          <div className="space-y-3 max-w-4xl mx-auto">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className={`bg-white rounded-lg border overflow-hidden transition-colors ${
                  expandedFaq === faq.id ? 'border-vault-green' : 'border-vault-gray-200 hover:border-vault-green'
                }`}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-vault-gray-50 transition-colors"
                >
                  <h3 className="text-base font-semibold text-vault-black pr-4">
                    {faq.attributes.question}
                  </h3>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    expandedFaq === faq.id ? 'bg-vault-green text-white' : 'bg-vault-gray-100 text-vault-gray-400'
                  }`}>
                    <svg
                      className={`h-4 w-4 transform transition-transform ${
                        expandedFaq === faq.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-5 pb-4 border-t border-vault-gray-100">
                    <div className="prose prose-sm max-w-none mt-3">
                      <div
                        className="text-sm text-vault-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: faq.attributes.answer
                            .split('\n')
                            .map(line => {
                              if (line.match(/^\d+\./)) {
                                return `<li class="ml-4 mb-2">${line}</li>`;
                              }
                              if (line.match(/^["\-\*]/)) {
                                return `<li class="ml-4 mb-2">${line.substring(1).trim()}</li>`;
                              }
                              return line ? `<p class="mb-2">${line}</p>` : '';
                            })
                            .join('')
                            .replace(/(<li.*?<\/li>)+/g, '<ol class="list-decimal list-inside space-y-2 my-2">$&</ol>')
                        }}
                      />
                    </div>
                    <div className="mt-3">
                      <span className="inline-block px-2.5 py-1 text-xs font-medium text-vault-green bg-vault-green-50 rounded-full">
                        {faq.attributes.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-12 bg-vault-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">
            Still Need Help?
          </h2>
          <p className="text-sm text-vault-gray-300 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-2.5 bg-vault-green text-white rounded-lg font-semibold text-sm hover:bg-vault-green-dark transition-colors shadow-sm hover:shadow-md"
          >
            Contact Support
          </a>
        </div>
      </section>
    </Layout>
  );
}
