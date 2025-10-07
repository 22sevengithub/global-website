import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import ExitConfirmationModal from '../../components/ExitConfirmationModal';
import Link from 'next/link';
import Icon from '../../components/Icon';
import { useApp } from '../../contexts/AppContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useTheme } from '../../contexts/ThemeContext';
import { authApi } from '../../services/api';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface SettingsItem {
  title: string;
  subtitle: string;
  icon: string;
  href?: string;
  comingSoon?: boolean;
  action?: () => void;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function Settings() {
  const router = useRouter();
  const { customerInfo, logout } = useApp();
  const { selectedCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  const handleComingSoon = (feature: string) => {
    setShowComingSoon(feature);
    setTimeout(() => setShowComingSoon(null), 2000);
  };

  const handleLogoutClick = () => {
    setShowExitModal(true);
  };

  const handleExitConfirm = async () => {
    await logout();
    router.push('/');
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Personal',
      items: [
        {
          title: 'Profile',
          subtitle: 'Manage your personal information',
          icon: 'ic_profile',
          href: '/app/profile',
        },
        {
          title: 'Investment Style',
          subtitle: 'Set your risk tolerance & preferences',
          icon: 'ic_investment',
          href: '/app/investment-style',
        },
        {
          title: 'Recurring Payments',
          subtitle: 'Manage scheduled transactions',
          icon: 'ic_recurring',
          comingSoon: true,
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          title: 'Currency',
          subtitle: `Currently using ${selectedCurrency}`,
          icon: 'ic_currency',
          href: '/app/currency-settings',
        },
        {
          title: 'Security',
          subtitle: 'Manage passwords & biometric login',
          icon: 'ic_security',
          comingSoon: true,
        },
        {
          title: 'Notifications',
          subtitle: 'Manage push notifications & alerts',
          icon: 'ic_notifications',
          href: '/app/notifications',
        },
        {
          title: 'Language',
          subtitle: 'English (US)',
          icon: 'ic_language',
          comingSoon: true,
        },
        {
          title: 'Theme',
          subtitle: theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled',
          icon: 'ic_theme',
          action: toggleTheme,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          title: 'Account Preferences',
          subtitle: 'Manage linked accounts & settings',
          icon: 'ic_account_pref',
          href: '/app/accounts',
        },
        {
          title: 'Deactivated Accounts',
          subtitle: 'View and restore deactivated accounts',
          icon: 'ic_reactive_account',
          comingSoon: true,
        },
        {
          title: 'Close Account',
          subtitle: 'Permanently delete your Vault22 account',
          icon: 'ic_close_account',
          comingSoon: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          title: 'Contact Us',
          subtitle: 'Get help from our support team',
          icon: 'ic_contact',
          comingSoon: true,
        },
        {
          title: 'Third Party Management',
          subtitle: 'Manage connected services & permissions',
          icon: 'ic_third_party',
          comingSoon: true,
        },
      ],
    },
  ];

  return (
    <ProtectedRoute>
      <AppShell title="Settings | Vault22">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-in-down">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              Settings
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Manage your account preferences
            </p>
          </div>

          {/* Coming Soon Toast */}
          {showComingSoon && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-vault-green text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in animate-scale-in">
              <p className="font-semibold">{showComingSoon} - Coming Soon!</p>
            </div>
          )}

          {/* Settings Sections */}
          <div className="space-y-8">
            {settingsSections.map((section, sectionIndex) => (
              <div key={section.title} style={{ animation: `fadeInUp 0.3s ease-out ${0.5 + sectionIndex * 0.1}s both` }}>
                <h2 className="text-sm font-semibold text-vault-gray-500 dark:text-vault-gray-400 uppercase tracking-wide mb-4">
                  {section.title}
                </h2>
                <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300">
                  {section.items.map((item, index) => {
                    const ItemWrapper = item.href && !item.comingSoon ? Link : 'div';
                    const wrapperProps: any = {};

                    if (item.href && !item.comingSoon) {
                      wrapperProps.href = item.href;
                    }

                    return (
                      <div key={item.title}>
                        <ItemWrapper
                          {...wrapperProps}
                          onClick={(e: any) => {
                            if (item.comingSoon) {
                              e.preventDefault();
                              handleComingSoon(item.title);
                            } else if (item.action) {
                              e.preventDefault();
                              item.action();
                            }
                          }}
                          className="flex items-center p-4 hover:bg-vault-gray-50 dark:hover:bg-vault-gray-700 transition-all duration-300 group cursor-pointer"
                        >
                          <div className="w-12 h-12 bg-vault-green/10 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-all duration-300">
                            <Icon name={item.icon} size={24} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-vault-black dark:text-white group-hover:text-vault-green transition-all duration-200">
                                {item.title}
                              </h3>
                              {item.comingSoon && (
                                <span className="text-xs bg-vault-green/10 text-vault-green px-2 py-0.5 rounded-full font-semibold">
                                  Soon
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                              {item.subtitle}
                            </p>
                          </div>
                          {!item.action && (
                            <svg className="w-6 h-6 text-vault-gray-400 group-hover:text-vault-green transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                          {item.action && (
                            <div className={`w-12 h-6 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-vault-green' : 'bg-vault-gray-300'} relative`}>
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                            </div>
                          )}
                        </ItemWrapper>
                        {index < section.items.length - 1 && (
                          <div className="border-t border-vault-gray-200 dark:border-vault-gray-700 ml-20"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Logout Button */}
            <div className="mt-8" style={{ animation: `fadeInUp 0.3s ease-out ${0.5 + settingsSections.length * 0.1}s both` }}>
              <button
                onClick={handleLogoutClick}
                className="w-full p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Exit App
              </button>
            </div>

            {/* App Version */}
            <div className="text-center text-sm text-vault-gray-500 dark:text-vault-gray-400 mt-4 animate-fade-in" style={{ animationDelay: '1s' }}>
              Vault22 Web v{typeof window !== 'undefined' ? localStorage.getItem('APP_VERSION') || '1.0.0' : '1.0.0'}
            </div>
          </div>
        </div>

        {/* Exit Confirmation Modal */}
        <ExitConfirmationModal
          isOpen={showExitModal}
          onConfirm={handleExitConfirm}
          onCancel={handleExitCancel}
        />
      </AppShell>
    </ProtectedRoute>
  );
}
