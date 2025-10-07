import Layout from '../components/Layout';

export default function Contact() {
  return (
    <Layout title="Contact Us | Vault22">
      <section className="relative bg-gradient-to-br from-white via-vault-green-50 to-white py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-45">
          <img
            src="/images/backgrounds/hero-contact.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/45 to-vault-green-50/50" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1.5 bg-vault-green-50 border border-vault-green-100 rounded-full mb-8">
            <span className="text-xs font-medium text-vault-green-900">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-vault-black mb-8 leading-tight">
            Get In Touch
          </h1>
          <p className="text-base md:text-lg text-vault-gray-600 max-w-2xl mx-auto leading-relaxed">
            We are here to help you start your journey to financial freedom
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 text-center border border-vault-gray-200 shadow-sm">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-xl font-bold font-display text-vault-black mb-2">
              Email Us
            </h2>
            <p className="text-sm text-vault-gray-600 mb-5">
              For inquiries, support, or partnership opportunities
            </p>
            <a
              href="mailto:hello@vault22.io"
              className="inline-block px-6 py-2.5 bg-vault-green text-white rounded-lg font-semibold text-sm hover:bg-vault-green-dark transition-colors shadow-sm hover:shadow-md"
            >
              hello@vault22.io
            </a>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-5 bg-white rounded-lg border border-vault-gray-200 hover:border-vault-gray-300 hover:shadow-sm transition-all">
              <div className="text-3xl mb-2.5">🇿🇦</div>
              <h3 className="font-semibold text-vault-black mb-1.5 text-sm">South Africa</h3>
              <p className="text-xs text-vault-gray-600 mb-2.5">
                Our established home market
              </p>
              <span className="inline-block px-2 py-0.5 bg-vault-green-50 text-vault-green text-xs font-medium rounded-full">
                Available Now
              </span>
            </div>
            <div className="text-center p-5 bg-white rounded-lg border border-vault-gray-200 hover:border-vault-gray-300 hover:shadow-sm transition-all">
              <div className="text-3xl mb-2.5">🇦🇪</div>
              <h3 className="font-semibold text-vault-black mb-1.5 text-sm">UAE</h3>
              <p className="text-xs text-vault-gray-600 mb-2.5">
                Now live in the United Arab Emirates
              </p>
              <span className="inline-block px-2 py-0.5 bg-vault-green-50 text-vault-green text-xs font-medium rounded-full">
                Now Live
              </span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
