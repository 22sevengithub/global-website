import AppShell from '../../../../components/AppShell';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import LoadingAnimation from '../../../../components/LoadingAnimation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../../../contexts/AppContext';

interface GoalTypeOption {
  id: string;
  name: string;
  icon: string;
  iconUrl?: string;
}

export default function SelectGoalType() {
  const router = useRouter();
  const { aggregate, customerInfo, loading } = useApp();
  const [selectedGoalType, setSelectedGoalType] = useState<GoalTypeOption | null>(null);
  const [goalTypes, setGoalTypes] = useState<GoalTypeOption[]>([]);

  // Initialize goal types from aggregate or use defaults
  useEffect(() => {
    if (aggregate) {
      // Try to get goal types from aggregate, otherwise use defaults
      const defaultTypes: GoalTypeOption[] = [
        { id: 'emergency', name: 'Emergency Fund', icon: '🛡️' },
        { id: 'retirement', name: 'Retirement', icon: '🌴' },
        { id: 'travel', name: 'Travel', icon: '✈️' },
        { id: 'home', name: 'Home', icon: '🏡' },
        { id: 'vehicle', name: 'Vehicle', icon: '🚗' },
        { id: 'education', name: 'Education', icon: '🎓' },
        { id: 'wedding', name: 'Wedding', icon: '💍' },
        { id: 'investment', name: 'Investment', icon: '📈' },
        { id: 'custom', name: 'Custom', icon: '🎯' },
      ];
      setGoalTypes(defaultTypes);
    }
  }, [aggregate]);

  const handleSelectGoalType = (goalType: GoalTypeOption) => {
    setSelectedGoalType(goalType);
  };

  const handleNext = () => {
    if (!selectedGoalType) return;

    // Navigate to custom goal screen to name the goal
    router.push({
      pathname: '/app/goals/create/custom-goal',
      query: {
        goalTypeId: selectedGoalType.id,
        goalTypeName: selectedGoalType.name,
      }
    });
  };

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Create Goal | Vault22">
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
      <AppShell title="Select Goal Type | Vault22">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/app/goals" className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Goals
            </Link>

            <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
              What is the goal of this investment?
            </h1>

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

          {/* Goal Types Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {goalTypes.map((goalType) => (
              <button
                key={goalType.id}
                onClick={() => handleSelectGoalType(goalType)}
                className={`
                  relative p-6 rounded-2xl border-2 transition-all hover:shadow-lg
                  ${selectedGoalType?.id === goalType.id
                    ? 'border-vault-green bg-vault-green/5'
                    : 'border-vault-gray-200 dark:border-vault-gray-700 bg-white dark:bg-vault-gray-800'
                  }
                `}
              >
                {/* Check Icon */}
                {selectedGoalType?.id === goalType.id && (
                  <div className="absolute top-4 right-4">
                    <svg className="w-6 h-6 text-vault-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <span className="text-5xl mb-3">{goalType.icon}</span>
                  <span className="text-base font-semibold text-vault-black dark:text-white">
                    {goalType.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <div className="sticky bottom-0 bg-white dark:bg-vault-gray-900 py-6 border-t border-vault-gray-200 dark:border-vault-gray-700">
            <button
              onClick={handleNext}
              disabled={!selectedGoalType}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg transition-all
                ${selectedGoalType
                  ? 'bg-vault-green text-vault-black dark:text-white hover:bg-vault-green-light'
                  : 'bg-vault-gray-300 dark:bg-vault-gray-700 text-vault-gray-500 dark:text-vault-gray-500 cursor-not-allowed'
                }
              `}
            >
              Next
            </button>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
