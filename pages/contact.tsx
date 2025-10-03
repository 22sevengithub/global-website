import Layout from '../components/Layout';

export default function Contact() {
  return (
    <Layout title="Contact Us | Vault22">
      <section className="bg-gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-6">
            Get In Touch
          </h1>
          <p className="text-2xl">
            We are here to help you start your journey to financial freedom
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-vault-gray-50 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-6">📧</div>
            <h2 className="text-3xl font-bold font-display text-vault-black mb-4">
              Email Us
            </h2>
            <p className="text-xl text-vault-gray-600 mb-8">
              For inquiries, support, or partnership opportunities
            </p>
            <a
              href="mailto:hello@vault22.io"
              className="inline-block px-8 py-4 bg-vault-green text-vault-black rounded-full font-bold text-lg hover:bg-vault-green-light transition-all"
            >
              hello@vault22.io
            </a>
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-vault-green/5 rounded-xl border-2 border-vault-green">
              <div className="text-4xl mb-4">🇿🇦</div>
              <h3 className="font-bold text-vault-black mb-2">South Africa</h3>
              <p className="text-vault-gray-600">
                Our established home market
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-vault-green text-vault-black text-xs font-semibold rounded-full">
                Available Now
              </span>
            </div>
            <div className="text-center p-6 bg-vault-green/5 rounded-xl border-2 border-vault-green">
              <div className="text-4xl mb-4">🇦🇪</div>
              <h3 className="font-bold text-vault-black mb-2">UAE</h3>
              <p className="text-vault-gray-600">
                Now live in the United Arab Emirates
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-vault-green text-vault-black text-xs font-semibold rounded-full">
                Now Live
              </span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
