import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import ExitConfirmationModal from '../../components/ExitConfirmationModal';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../../contexts/AppContext';
import Icon from '../../components/Icon';
import { useState } from 'react';

export default function More() {
  const router = useRouter();
  const { customerInfo, logout } = useApp();
  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  const handleComingSoon = (feature: string) => {
    setShowComingSoon(feature);
    setTimeout(() => setShowComingSoon(null), 2000);
  };

  const handleExitClick = () => {
    setShowExitModal(true);
  };

  const handleExitConfirm = async () => {
    await logout();
    router.push('/');
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  const menuSections = [
    {
      title: 'Features',
      items: [
        { href: '/app/nudges', label: 'Nudges', icon: 'ic_nudge', description: 'Financial insights & tips', comingSoon: true },
        { href: '/app/tags', label: 'Tags', icon: 'ic_tag', description: 'Organize transactions with tags', comingSoon: true },
      ]
    },
    {
      title: 'Options',
      items: [
        { href: '/app/settings', label: 'Settings', icon: 'settings', description: 'Personal & app preferences' },
        { href: '/app/help', label: 'Help', icon: 'ic_help', description: 'Get help & support', comingSoon: true },
        { href: 'https://www.vault22.io/blog', label: 'Blog', icon: 'ic_blog', description: 'Financial tips & news', external: true },
      ]
    },
  ];

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

        {/* Coming Soon Toast */}
        {showComingSoon && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-vault-green text-white px-6 py-3 rounded-xl shadow-lg animate-bounce-in">
            <p className="font-semibold">{showComingSoon} - Coming Soon!</p>
          </div>
        )}

        {/* Menu Sections */}
        {menuSections.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-thanos-300 uppercase tracking-wide mb-4">
              {section.title}
            </h2>
            <div className="bg-gray-50 dark:bg-thanos-800 rounded-2xl border border-gray-200 dark:border-thanos-700 overflow-hidden">
              {section.items.map((item: any, itemIdx) => {
                const ItemWrapper = item.external || item.comingSoon ? 'div' : Link;
                const wrapperProps: any = {};

                if (!item.external && !item.comingSoon) {
                  wrapperProps.href = item.href;
                }

                return (
                  <ItemWrapper
                    key={item.href + itemIdx}
                    {...wrapperProps}
                    onClick={(e: any) => {
                      if (item.comingSoon) {
                        e.preventDefault();
                        handleComingSoon(item.label);
                      } else if (item.external) {
                        e.preventDefault();
                        window.open(item.href, '_blank');
                      }
                    }}
                    className={`flex items-center px-4 py-4 hover:bg-gray-100 dark:hover:bg-thanos-700 transition-colors cursor-pointer ${
                      itemIdx < section.items.length - 1 ? 'border-b border-gray-200 dark:border-thanos-700' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-thanos-700 mr-4">
                      <Icon name={item.icon} size={20} className="opacity-70" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-medium text-gray-900 dark:text-thanos-50">{item.label}</p>
                        {item.comingSoon && (
                          <span className="text-xs bg-vault-green/10 text-vault-green px-2 py-0.5 rounded-full font-semibold">
                            Soon
                          </span>
                        )}
                        {item.external && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-thanos-200">{item.description}</p>
                    </div>
                    {!item.external && !item.comingSoon && (
                      <svg className="w-5 h-5 text-gray-400 dark:text-thanos-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </ItemWrapper>
                );
              })}
            </div>
          </div>
        ))}

        {/* Exit Button */}
        <div className="mt-8">
          <button
            onClick={handleExitClick}
            className="w-full flex items-center justify-center px-6 py-4 bg-red-50 dark:bg-peach-900/20 hover:bg-red-100 dark:hover:bg-peach-900/30 text-red-600 dark:text-peach-400 border border-red-200 dark:border-peach-700/40 rounded-2xl transition-all font-medium"
          >
            <Icon name="exit" size={20} className="mr-3" />
            Exit to Website
          </button>
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
