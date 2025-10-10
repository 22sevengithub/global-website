import Layout from '../components/Layout';
import FlagIcon from '../components/FlagIcon';

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

          {/* Download App Section */}
          <div className="mt-12 space-y-6">
            {/* UAE App Download */}
            <div
              className="bg-white rounded-2xl shadow-lg border border-vault-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="bg-gradient-to-r from-vault-blue to-vault-blue-dark px-8 py-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  {/* UAE Flag */}
                  <div className="shadow-lg">
                    <FlagIcon country="uae" size="lg" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-white">
                    Vault22 UAE
                  </h2>
                </div>
                <p className="text-sm text-white/90 text-center max-w-lg mx-auto">
                  Start your wealth journey in the United Arab Emirates
                </p>
              </div>
              <div className="px-8 py-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="https://apps.apple.com/us/app/vault22-uae/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <img
                      src="/images/app-store-badge.svg"
                      alt="Download on the App Store"
                      width="180"
                      height="54"
                      style={{ display: 'block' }}
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.vault22.next.uae&gl=ae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <img
                      src="/images/google-play-badge.svg"
                      alt="Get it on Google Play"
                      width="203"
                      height="54"
                      style={{ display: 'block' }}
                    />
                  </a>
                  <a
                    href="https://appgallery.huawei.com/app/C114552769?pkgName=com.vault22.next.uae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: '0.4s' }}
                  >
                    <img
                      src="/images/huawei-appgallery-badge.svg"
                      alt="Explore it on AppGallery"
                      width="203"
                      height="54"
                      style={{ display: 'block' }}
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* South Africa App Download */}
            <div
              className="bg-white rounded-2xl shadow-lg border border-vault-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="bg-gradient-to-r from-vault-green to-vault-green-dark px-8 py-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  {/* South Africa Flag */}
                  <div className="shadow-lg">
                    <FlagIcon country="za" size="lg" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-white">
                    22seven South Africa
                  </h2>
                </div>
                <p className="text-sm text-white/90 text-center max-w-lg mx-auto">
                  Take control of your finances with South Africa's trusted money app
                </p>
              </div>
              <div className="px-8 py-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="https://apps.apple.com/us/app/apple-store/id611120440"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <img
                      src="/images/app-store-badge.svg"
                      alt="Download on the App Store"
                      width="180"
                      height="54"
                      style={{ display: 'block' }}
                    />
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.twentytwoseven.android"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: '0.4s' }}
                  >
                    <img
                      src="/images/google-play-badge.svg"
                      alt="Get it on Google Play"
                      width="203"
                      height="54"
                      style={{ display: 'block' }}
                    />
                  </a>
                  <a
                    href="https://appgallery.huawei.com/app/C100645251"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-fade-in"
                    style={{ animationDelay: '0.5s' }}
                  >
                    <img
                      src="/images/huawei-appgallery-badge.svg"
                      alt="Explore it on AppGallery"
                      width="203"
                      height="54"
                      style={{ display: 'block' }}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
