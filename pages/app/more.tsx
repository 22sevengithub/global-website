import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../../contexts/AppContext';
import Icon from '../../components/Icon';

export default function More() {
  const router = useRouter();
  const { customerInfo, logout } = useApp();

  const menuSections = [
    {
      title: 'Financial Tools',
      items: [
        { href: '/app/goals', label: 'Goals', icon: 'goals', description: 'Track your financial goals' },
        { href: '/app/investments', label: 'Investments', icon: 'investments', description: 'Manage your investments' },
        { href: '/app/health-score', label: 'Financial Health Score', icon: 'health-score', description: 'Check your financial health' },
      ]
    },
    {
      title: 'Account',
      items: [
        { href: '/app/profile', label: 'Profile', icon: 'ic_profile', description: 'View and edit your profile' },
        { href: '/app/settings', label: 'Settings', icon: 'settings', description: 'App preferences' },
      ]
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <AppShell title="More | Vault22" showBackButton={false}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-bulbasaur-500 to-sonic-500 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {customerInfo?.firstname?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-thanos-50">
                {customerInfo?.firstname || 'User'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-thanos-200">{customerInfo?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-thanos-300 uppercase tracking-wide mb-4">
              {section.title}
            </h2>
            <div className="bg-gray-50 dark:bg-thanos-800 rounded-2xl border border-gray-200 dark:border-thanos-700 overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-4 hover:bg-gray-100 dark:hover:bg-thanos-700 transition-colors ${
                    itemIdx < section.items.length - 1 ? 'border-b border-gray-200 dark:border-thanos-700' : ''
                  }`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-thanos-700 mr-4">
                    <Icon name={item.icon} size={20} className="opacity-70" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-900 dark:text-thanos-50">{item.label}</p>
                    <p className="text-sm text-gray-600 dark:text-thanos-200">{item.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 dark:text-thanos-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-6 py-4 bg-red-50 dark:bg-peach-900/20 hover:bg-red-100 dark:hover:bg-peach-900/30 text-red-600 dark:text-peach-400 border border-red-200 dark:border-peach-700/40 rounded-2xl transition-all font-medium"
          >
            <Icon name="exit" size={20} className="mr-3" />
            Exit to Website
          </button>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
