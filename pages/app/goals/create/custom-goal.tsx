import AppShell from '../../../../components/AppShell';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import LoadingAnimation from '../../../../components/LoadingAnimation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../../../contexts/AppContext';
import { goalsApi } from '../../../../services/api';

interface GoalIcon {
  id: string;
  name: string;
  iconUrl: string;  // SVG URL from backend (matching mobile app VaultGoalIcon)
  icon?: string;  // Emoji (fallback only)
}

export default function CustomYourGoal() {
  const router = useRouter();
  const { goalTypeId, goalTypeName } = router.query;
  const { aggregate, customerInfo, loading: contextLoading } = useApp();

  const [goalName, setGoalName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<GoalIcon | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [goalIcons, setGoalIcons] = useState<GoalIcon[]>([]);

  // Fallback emoji icons (used if backend doesn't provide icons)
  const fallbackIcons: GoalIcon[] = [
    { id: '1', name: 'Target', icon: '🎯', iconUrl: '' },
    { id: '2', name: 'Money Bag', icon: '💰', iconUrl: '' },
    { id: '3', name: 'House', icon: '🏡', iconUrl: '' },
    { id: '4', name: 'Car', icon: '🚗', iconUrl: '' },
    { id: '5', name: 'Plane', icon: '✈️', iconUrl: '' },
    { id: '6', name: 'Graduation', icon: '🎓', iconUrl: '' },
    { id: '7', name: 'Ring', icon: '💍', iconUrl: '' },
    { id: '8', name: 'Palm Tree', icon: '🌴', iconUrl: '' },
    { id: '9', name: 'Shield', icon: '🛡️', iconUrl: '' },
    { id: '10', name: 'Chart', icon: '📈', iconUrl: '' },
    { id: '11', name: 'Rocket', icon: '🚀', iconUrl: '' },
    { id: '12', name: 'Star', icon: '⭐', iconUrl: '' },
  ];

  // Load goal icons from aggregate data (matching mobile app)
  useEffect(() => {
    if (aggregate?.goalIcons && aggregate.goalIcons.length > 0) {
      console.log('📋 [Goal Icons] Loading icons from backend:', aggregate.goalIcons);
      // Convert backend icon URLs to GoalIcon format
      const backendIcons: GoalIcon[] = aggregate.goalIcons.map((iconUrl, index) => ({
        id: `backend-${index}`,
        name: `Icon ${index + 1}`,
        iconUrl: iconUrl,
      }));
      setGoalIcons(backendIcons);
      console.log('✅ [Goal Icons] Loaded', backendIcons.length, 'icons from backend');
    } else {
      console.log('⚠️ [Goal Icons] No icons from backend, using fallback emojis');
      setGoalIcons(fallbackIcons);
    }
  }, [aggregate]);

  useEffect(() => {
    if (goalTypeName) {
      setGoalName(`My ${goalTypeName} Goal`);
    }
    // Set default icon when icons are loaded
    if (goalIcons.length > 0 && !selectedIcon) {
      setSelectedIcon(goalIcons[0]);
    }
  }, [goalTypeName, goalIcons]);

  const handleSelectIcon = (icon: GoalIcon) => {
    setSelectedIcon(icon);
    setShowIconPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!goalName.trim()) {
      setError('Please enter a goal name');
      return;
    }

    if (!selectedIcon) {
      setError('Please select an icon');
      return;
    }

    if (!customerInfo?.id) {
      setError('User not logged in');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create goal with name and icon (matching mobile app exactly)
      const createGoalData: any = {
        name: goalName.trim(),
        iconUrl: selectedIcon.iconUrl || selectedIcon.icon || '', // Use SVG URL from backend, fallback to emoji
        isShariahCompliant: false, // CRITICAL: Backend requires this field
      };

      // Only include wealthAccountInvestmentId if we have a product (not for regular goals)
      // Don't send null or false values for optional fields

      console.log('🎯 [Goal Create] Sending request:', createGoalData);
      const response = await goalsApi.createGoal(customerInfo.id, createGoalData);
      console.log('✅ [Goal Create] Response received:', response);

      // Backend returns the goal ID - verify we got it
      if (!response || !response.id) {
        console.error('❌ [Goal Create] Invalid response - missing goal ID:', response);
        throw new Error('Backend did not return a valid goal ID');
      }

      console.log('✅ [Goal Create] Goal ID:', response.id);

      // Navigate to questionnaires with the goal ID
      router.push({
        pathname: '/app/goals/create/questionnaires',
        query: {
          goalId: response.id,
          goalName: goalName.trim(),
          goalTypeId,
          goalTypeName,
        }
      });
    } catch (err: any) {
      console.error('❌ Failed to create goal:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create goal. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (contextLoading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Name Your Goal | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <LoadingAnimation size={150} />
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mt-4">Loading...</p>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppShell title="Name Your Goal | Vault22">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              Name your goal
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Give your {goalTypeName} goal a personalized name
            </p>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-700 rounded-full h-1 mb-2">
                <div
                  className="bg-vault-green h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(1 / 6) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Step 1 of 6</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Name */}
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-6">
              <label className="block text-sm font-semibold text-vault-black dark:text-white mb-3">
                Goal Name
              </label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g., Dream Home, College Fund"
                maxLength={50}
                className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 dark:text-white rounded-xl focus:border-vault-green focus:outline-none transition-all"
              />
              <p className="text-xs text-vault-gray-500 mt-2">{goalName.length}/50 characters</p>
            </div>

            {/* Icon Selector */}
            <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-6">
              <label className="block text-sm font-semibold text-vault-black dark:text-white mb-3">
                Choose an Icon
              </label>

              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-full px-4 py-3 border-2 border-vault-gray-200 dark:border-vault-gray-700 dark:bg-vault-gray-800 rounded-xl hover:border-vault-green transition-all flex items-center justify-between"
              >
                <div className="flex items-center">
                  {selectedIcon && (
                    <>
                      {selectedIcon.iconUrl ? (
                        // SVG icon from backend
                        <img
                          src={selectedIcon.iconUrl}
                          alt={selectedIcon.name}
                          className="w-10 h-10 mr-3"
                          onError={(e) => {
                            // Fallback to emoji if SVG fails to load
                            e.currentTarget.style.display = 'none';
                            const emojiSpan = e.currentTarget.nextElementSibling as HTMLElement;
                            if (emojiSpan) emojiSpan.style.display = 'inline';
                          }}
                        />
                      ) : null}
                      {selectedIcon.icon && (
                        <span className="text-3xl mr-3" style={{ display: selectedIcon.iconUrl ? 'none' : 'inline' }}>
                          {selectedIcon.icon}
                        </span>
                      )}
                      <span className="text-vault-black dark:text-white">{selectedIcon.name}</span>
                    </>
                  )}
                </div>
                <svg className={`w-5 h-5 text-vault-gray-600 transition-transform ${showIconPicker ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Icon Picker */}
              {showIconPicker && (
                <div className="mt-4 grid grid-cols-4 gap-3 p-4 bg-vault-gray-50 dark:bg-vault-gray-700 rounded-xl max-h-96 overflow-y-auto">
                  {goalIcons.map((icon) => (
                    <button
                      key={icon.id}
                      type="button"
                      onClick={() => handleSelectIcon(icon)}
                      className={`
                        p-4 rounded-xl transition-all text-center flex flex-col items-center justify-center min-h-[80px]
                        ${selectedIcon?.id === icon.id
                          ? 'bg-vault-green/20 border-2 border-vault-green'
                          : 'bg-white dark:bg-vault-gray-800 border-2 border-transparent hover:border-vault-green/50'
                        }
                      `}
                    >
                      {icon.iconUrl ? (
                        // SVG icon from backend (matching mobile app)
                        <img
                          src={icon.iconUrl}
                          alt={icon.name}
                          className="w-10 h-10 mb-1 object-contain"
                          onError={(e) => {
                            // Fallback to emoji if SVG fails to load
                            e.currentTarget.style.display = 'none';
                            const emojiSpan = e.currentTarget.nextElementSibling as HTMLElement;
                            if (emojiSpan) emojiSpan.style.display = 'block';
                          }}
                        />
                      ) : null}
                      {icon.icon && (
                        <span
                          className="text-3xl block mb-1"
                          style={{ display: icon.iconUrl ? 'none' : 'block' }}
                        >
                          {icon.icon}
                        </span>
                      )}
                      <span className="text-xs text-vault-gray-600 dark:text-vault-gray-400 line-clamp-1">
                        {icon.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="sticky bottom-0 bg-white dark:bg-vault-gray-900 py-6 border-t border-vault-gray-200 dark:border-vault-gray-700">
              <button
                type="submit"
                disabled={loading || !goalName.trim()}
                className={`
                  w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center
                  ${!loading && goalName.trim()
                    ? 'bg-vault-green text-vault-black dark:text-white hover:bg-vault-green-light'
                    : 'bg-vault-gray-300 dark:bg-vault-gray-700 text-vault-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating goal...
                  </>
                ) : (
                  'Next'
                )}
              </button>
            </div>
          </form>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
