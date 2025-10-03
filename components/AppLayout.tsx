import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function AppLayout({
  children,
  title = 'Dashboard | Vault22',
  description = 'Manage your finances with Vault22'
}: AppLayoutProps) {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/accounts', label: 'Accounts', icon: '🏦' },
    { href: '/transactions', label: 'Transactions', icon: '💳' },
    { href: '/budget', label: 'Budget', icon: '💰' },
    { href: '/goals', label: 'Goals', icon: '🎯' },
    { href: '/investments', label: 'Investments', icon: '📈' },
    { href: '/health-score', label: 'Health Score', icon: '❤️' }
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/vault22.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen flex flex-col bg-vault-gray-50 dark:bg-vault-gray-900 transition-colors">
        <Header />

        <div className="flex-grow flex">
          {/* Sidebar Navigation */}
          <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-vault-gray-800 border-r border-vault-gray-200 dark:border-vault-gray-700 transition-colors">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="px-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-br from-vault-green/10 to-vault-blue/10 dark:from-vault-green/20 dark:to-vault-blue/20 rounded-2xl border border-vault-green/20 dark:border-vault-green/30">
                  <div>
                    <p className="text-xs text-vault-gray-600 dark:text-vault-gray-400 mb-1">Total Net Worth</p>
                    <p className="text-2xl font-bold text-vault-black dark:text-white">$142,500</p>
                    <p className="text-xs text-vault-green">+12.5% this month</p>
                  </div>
                  <div className="text-3xl">💎</div>
                </div>
              </div>

              <nav className="flex-1 px-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive(item.href)
                        ? 'bg-vault-green text-vault-black shadow-lg'
                        : 'text-vault-gray-700 dark:text-vault-gray-300 hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 hover:text-vault-green'
                    }`}
                  >
                    <span className="text-2xl mr-3">{item.icon}</span>
                    {item.label}
                    {isActive(item.href) && (
                      <span className="ml-auto w-2 h-2 bg-vault-black rounded-full"></span>
                    )}
                  </Link>
                ))}
              </nav>

              <div className="px-3 mt-6">
                <div className="p-4 bg-gradient-to-br from-vault-blue to-vault-blue-dark dark:from-vault-blue-dark dark:to-vault-blue rounded-2xl text-white">
                  <p className="text-sm font-semibold mb-2">🎁 Upgrade to Pro</p>
                  <p className="text-xs mb-3 text-white/80">Get advanced analytics, unlimited goals, and more</p>
                  <button className="w-full py-2 bg-white dark:bg-vault-gray-900 text-vault-blue dark:text-vault-green rounded-lg text-sm font-bold hover:bg-vault-gray-50 dark:hover:bg-vault-gray-800 transition-all">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
}
