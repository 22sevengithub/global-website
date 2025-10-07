import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';
import { useApp } from '../../contexts/AppContext';
import { authApi } from '../../services/api';
import { useRouter } from 'next/router';

interface SettingsItem {
  title: string;
  subtitle: string;
  icon: string;
  href: string;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function Settings() {
  const router = useRouter();
  const { customerInfo } = useApp();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Personal',
      items: [
        {
          title: 'Profile',
          subtitle: 'Manage your personal information',
          icon: '/icons/ic_profile.svg',
          href: '/profile',
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          title: 'Currency',
          subtitle: `Currently using ${customerInfo?.defaultCurrencyCode || 'AED'}`,
          icon: '/icons/ic_currency.svg',
          href: '/currency-selection',
        },
        {
          title: 'Security',
          subtitle: 'Manage passwords and authentication',
          icon: '/icons/ic_security.svg',
          href: '#',
        },
        {
          title: 'Theme',
          subtitle: 'Choose your preferred theme',
          icon: '/icons/ic_theme.svg',
          href: '#',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          title: 'Account Preferences',
          subtitle: 'Manage account settings',
          icon: '/icons/ic_account_pref.svg',
          href: '#',
        },
        {
          title: 'Deactivated Accounts',
          subtitle: 'View and restore deactivated accounts',
          icon: '/icons/ic_reactive_account.svg',
          href: '#',
        },
      ],
    },
  ];

  return (
    <ProtectedRoute>
      <AppShell title="Settings | Vault22">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Manage your account preferences
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-8">
            {settingsSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-semibold text-vault-gray-500 dark:text-vault-gray-400 uppercase tracking-wide mb-4">
                  {section.title}
                </h2>
                <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 overflow-hidden">
                  {section.items.map((item, index) => (
                    <div key={item.title}>
                      <Link
                        href={item.href}
                        className="flex items-center p-4 hover:bg-vault-gray-50 dark:hover:bg-vault-gray-700 transition-all group"
                      >
                        <div className="w-12 h-12 bg-vault-green/10 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                          <img src={item.icon} alt={item.title} className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-vault-black dark:text-white group-hover:text-vault-green transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                            {item.subtitle}
                          </p>
                        </div>
                        <svg className="w-6 h-6 text-vault-gray-400 group-hover:text-vault-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      {index < section.items.length - 1 && (
                        <div className="border-t border-vault-gray-200 dark:border-vault-gray-700 ml-20"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Logout Button */}
            <div className="mt-8">
              <button
                onClick={handleLogout}
                className="w-full p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>

            {/* App Version */}
            <div className="text-center text-sm text-vault-gray-500 dark:text-vault-gray-400 mt-4">
              Vault22 Web v{typeof window !== 'undefined' ? localStorage.getItem('APP_VERSION') || '1.0.0' : '1.0.0'}
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
