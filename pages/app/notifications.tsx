import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useRouter } from 'next/router';
import { useApp } from '../../contexts/AppContext';
import { customerApi } from '../../services/api';
import { useState } from 'react';

export default function Notifications() {
  const router = useRouter();
  const { customerInfo, loadAggregate } = useApp();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const notificationSettings = [
    {
      id: 'isSpendingAlertsEnabled',
      title: 'Spending Alerts',
      description: 'Get notified when you exceed your budget limits',
      icon: '💰',
    },
    {
      id: 'isAccountUpdateEnabled',
      title: 'Account Updates',
      description: 'Notifications when your accounts are refreshed',
      icon: '🔄',
    },
    {
      id: 'isUnseenTransactionEnabled',
      title: 'Unseen Transactions',
      description: 'Alert when new transactions are detected',
      icon: '🔔',
    },
    {
      id: 'isNudgesEnabled',
      title: 'Nudges',
      description: 'Financial insights and personalized tips',
      icon: '💡',
    },
    {
      id: 'isGeneralEnabled',
      title: 'General Updates',
      description: 'Product updates and important announcements',
      icon: '📢',
    },
  ];

  const isEnabled = (settingId: string): boolean => {
    const subscriptions = customerInfo?.notificationSubscription;
    if (!subscriptions) return false;
    const value = subscriptions[settingId as keyof typeof subscriptions];
    return value === 'True' || value === true;
  };

  const handleToggle = async (settingId: string) => {
    if (!customerInfo?.id) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const currentValue = isEnabled(settingId);
      const newValue = currentValue ? 'False' : 'True';

      await customerApi.updateNotificationSubscriptions(customerInfo.id, {
        [settingId]: newValue,
      });

      await loadAggregate();
      setSuccess('Notification preferences updated');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Failed to update notification settings:', err);
      setError(err.message || 'Failed to update settings. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell title="Notifications | Vault22">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              Notifications
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Manage your notification preferences
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <p className="text-green-600 dark:text-green-400 text-sm font-semibold">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Notification Settings */}
          <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 overflow-hidden">
            {notificationSettings.map((setting, index) => (
              <div key={setting.id}>
                <div className="flex items-center p-6 hover:bg-vault-gray-50 dark:hover:bg-vault-gray-700 transition-all">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-vault-green/10 rounded-xl flex items-center justify-center mr-4 text-2xl">
                    {setting.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-vault-black dark:text-white">
                      {setting.title}
                    </h3>
                    <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                      {setting.description}
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(setting.id)}
                    disabled={saving}
                    className={`relative w-14 h-7 rounded-full transition-colors disabled:opacity-50 ${
                      isEnabled(setting.id) ? 'bg-vault-green' : 'bg-vault-gray-300 dark:bg-vault-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                        isEnabled(setting.id) ? 'translate-x-7' : 'translate-x-0.5'
                      }`}
                    ></div>
                  </button>
                </div>
                {index < notificationSettings.length - 1 && (
                  <div className="border-t border-vault-gray-200 dark:border-vault-gray-700 ml-20"></div>
                )}
              </div>
            ))}
          </div>

          {/* Info Note */}
          <div className="bg-vault-blue/10 border border-vault-blue/30 rounded-xl p-4 mt-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-vault-blue mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-vault-gray-700 dark:text-vault-gray-300">
                Changes to notification settings take effect immediately. You can adjust these preferences at any time.
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
