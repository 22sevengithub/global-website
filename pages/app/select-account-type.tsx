import AppShell from '../../components/AppShell';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface AccountTypeOption {
  id: string;
  label: string;
  icon: string;
}

const ACCOUNT_TYPES: AccountTypeOption[] = [
  { id: 'uae_banks', label: 'UAE Banks', icon: '🏦' },
  { id: 'cash', label: 'Cash', icon: '💵' },
  { id: 'deposits', label: 'Deposits', icon: '💰' },
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'investments', label: 'Investments', icon: '📈' },
  { id: 'loan', label: 'Loan', icon: '💳' },
  { id: 'real_estate', label: 'Real Estate', icon: '🏘️' },
  { id: 'retirement_fund', label: 'Retirement Fund', icon: '👴' },
  { id: 'something_else', label: 'Something Else', icon: '💼' },
];

export default function SelectAccountType() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSelectType = (typeId: string) => {
    setSelectedType(typeId);

    // Navigate based on selection
    setTimeout(() => {
      if (typeId === 'uae_banks') {
        // Show add account modal for UAE Banks
        setShowAddModal(true);
      } else {
        // Navigate to manual account for all other options
        router.push('/app/add-manual-account');
      }
    }, 300);
  };

  const handleLinkAccount = () => {
    setShowAddModal(false);
    router.push('/app/link-account');
  };

  const handleAddManually = () => {
    setShowAddModal(false);
    router.push('/app/add-manual-account');
  };

  return (
    <ProtectedRoute>
      <AppShell title="Select Account Type | Vault22">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              Select Account Type
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Choose what type of account you'd like to add
            </p>
          </div>

          {/* Account Type List */}
          <div className="space-y-3">
            {ACCOUNT_TYPES.map((accountType) => (
              <button
                key={accountType.id}
                onClick={() => handleSelectType(accountType.id)}
                className={`w-full h-14 px-6 flex items-center rounded-xl border-2 transition-all ${
                  selectedType === accountType.id
                    ? 'border-yellow bg-yellow/5'
                    : 'border-vault-gray-200 dark:border-vault-gray-700 hover:border-yellow/50'
                } bg-white dark:bg-vault-gray-800`}
              >
                {/* Custom Radio Button */}
                <div className="relative w-6 h-6 mr-4 flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedType === accountType.id
                      ? 'border-yellow'
                      : 'border-yellow'
                  }`}>
                    {selectedType === accountType.id && (
                      <div className="w-3 h-3 rounded-full bg-yellow"></div>
                    )}
                  </div>
                </div>

                {/* Icon */}
                <span className="text-2xl mr-3">{accountType.icon}</span>

                {/* Label */}
                <span className="text-base font-medium text-vault-black dark:text-white">
                  {accountType.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Account Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 animate-fade-in">
            <div
              className="bg-white dark:bg-vault-gray-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md mx-auto p-8 animate-slide-up"
              style={{ maxHeight: '90vh' }}
            >
              {/* Header Image */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-vault-green/10 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-vault-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold font-display text-vault-black dark:text-white text-center mb-3">
                Add an Account
              </h2>

              {/* Description */}
              <p className="text-vault-gray-600 dark:text-vault-gray-400 text-center mb-8">
                Track and analyze your spending across all your accounts
              </p>

              {/* Buttons */}
              <div className="space-y-4">
                {/* Link Your Account Button */}
                <button
                  onClick={handleLinkAccount}
                  className="w-full h-12 bg-yellow text-vault-black dark:text-white rounded-lg font-semibold hover:bg-yellow-dark transition-all shadow-lg hover:shadow-xl"
                >
                  Link Your Account
                </button>

                {/* Add Manually Button */}
                <button
                  onClick={handleAddManually}
                  className="w-full h-12 border-2 border-yellow text-yellow rounded-lg font-semibold hover:bg-yellow/10 transition-all"
                >
                  Add an Account Manually
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-vault-gray-100 dark:hover:bg-vault-gray-700 transition-all"
              >
                <svg className="w-6 h-6 text-vault-gray-600 dark:text-vault-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slide-up {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
        `}</style>
      </AppShell>
    </ProtectedRoute>
  );
}
