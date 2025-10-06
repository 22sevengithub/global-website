import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import LoadingAnimation from '../components/LoadingAnimation';

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
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
              How Can We Help You?
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Find answers to your questions about Vault22
            </p>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="search"
                placeholder="Search for answers..."
                className="w-full px-6 py-4 rounded-full text-vault-black placeholder-vault-gray-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-vault-green focus:ring-opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-vault-gray-400"
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
      <section className="py-16 bg-vault-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-display text-vault-black mb-10 text-center">
            Browse by Topic
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            <button
              onClick={() => setSelectedCategory('Getting Started')}
              className={`p-6 rounded-2xl transition-all hover:scale-105 ${
                selectedCategory === 'Getting Started'
                  ? 'bg-blue-100 border-2 border-blue-300 shadow-lg'
                  : 'bg-blue-50 border-2 border-blue-100 hover:border-blue-200'
              }`}
            >
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="font-bold text-vault-black text-sm">Getting Started</h3>
            </button>

            <button
              onClick={() => setSelectedCategory('Account Management')}
              className={`p-6 rounded-2xl transition-all hover:scale-105 ${
                selectedCategory === 'Account Management'
                  ? 'bg-green-100 border-2 border-green-300 shadow-lg'
                  : 'bg-green-50 border-2 border-green-100 hover:border-green-200'
              }`}
            >
              <div className="text-4xl mb-3">👤</div>
              <h3 className="font-bold text-vault-black text-sm">Account Management</h3>
            </button>

            <button
              onClick={() => setSelectedCategory('Security')}
              className={`p-6 rounded-2xl transition-all hover:scale-105 ${
                selectedCategory === 'Security'
                  ? 'bg-purple-100 border-2 border-purple-300 shadow-lg'
                  : 'bg-purple-50 border-2 border-purple-100 hover:border-purple-200'
              }`}
            >
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-vault-black text-sm">Security</h3>
            </button>

            <button
              onClick={() => setSelectedCategory('Billing')}
              className={`p-6 rounded-2xl transition-all hover:scale-105 ${
                selectedCategory === 'Billing'
                  ? 'bg-orange-100 border-2 border-orange-300 shadow-lg'
                  : 'bg-orange-50 border-2 border-orange-100 hover:border-orange-200'
              }`}
            >
              <div className="text-4xl mb-3">💳</div>
              <h3 className="font-bold text-vault-black text-sm">Billing</h3>
            </button>

            <button
              onClick={() => setSelectedCategory('Features')}
              className={`p-6 rounded-2xl transition-all hover:scale-105 ${
                selectedCategory === 'Features'
                  ? 'bg-yellow-100 border-2 border-yellow-300 shadow-lg'
                  : 'bg-yellow-50 border-2 border-yellow-100 hover:border-yellow-200'
              }`}
            >
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="font-bold text-vault-black text-sm">Features</h3>
            </button>

            <button
              onClick={() => setSelectedCategory('Troubleshooting')}
              className={`p-6 rounded-2xl transition-all hover:scale-105 ${
                selectedCategory === 'Troubleshooting'
                  ? 'bg-pink-100 border-2 border-pink-300 shadow-lg'
                  : 'bg-pink-50 border-2 border-pink-100 hover:border-pink-200'
              }`}
            >
              <div className="text-4xl mb-3">🔧</div>
              <h3 className="font-bold text-vault-black text-sm">Troubleshooting</h3>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-vault-green text-vault-black shadow-lg'
                    : 'bg-white text-vault-gray-700 hover:bg-vault-gray-100 border border-vault-gray-200'
                }`}
              >
                {category === 'all' ? 'All Topics' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold font-display text-vault-black mb-8">
            Frequently Asked Questions
          </h2>

          {/* FAQ List */}
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingAnimation size={120} />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {!loading && !error && filteredFAQs.length === 0 && (
            <div className="text-center py-12 text-vault-gray-500">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : 'No FAQs available in this category'
              }
            </div>
          )}

          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                  expandedFaq === faq.id ? 'border-vault-green shadow-lg' : 'border-vault-gray-200 hover:border-vault-green/50'
                }`}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-vault-gray-50 dark:hover:bg-vault-gray-600 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-vault-black pr-4">
                    {faq.attributes.question}
                  </h3>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    expandedFaq === faq.id ? 'bg-vault-green text-vault-black' : 'bg-vault-gray-100 text-vault-gray-400'
                  }`}>
                    <svg
                      className={`h-5 w-5 transform transition-transform ${
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
                  <div className="px-6 pb-6 border-t border-vault-gray-100">
                    <div className="prose prose-sm max-w-none mt-4">
                      <div
                        className="text-vault-gray-700 leading-relaxed"
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
                              return line ? `<p class="mb-3">${line}</p>` : '';
                            })
                            .join('')
                            .replace(/(<li.*?<\/li>)+/g, '<ol class="list-decimal list-inside space-y-2 my-3">$&</ol>')
                        }}
                      />
                    </div>
                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-vault-green bg-vault-green/10 rounded-full">
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
      <section className="py-16 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            Still Need Help?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-4 bg-vault-yellow text-vault-black rounded-full font-bold text-lg hover:bg-vault-yellow-light transition-all hover:shadow-xl transform hover:-translate-y-1"
          >
            Contact Support
          </a>
        </div>
      </section>
    </Layout>
  );
}
