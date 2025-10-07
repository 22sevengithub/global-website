import AppShell from '../../../../components/AppShell';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import LoadingAnimation from '../../../../components/LoadingAnimation';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../../../contexts/AppContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'pending' | 'in_progress' | 'completed';
  action?: () => void;
}

export default function GoalOnboarding() {
  const router = useRouter();
  const { goalId, goalName, productId, productName } = router.query;
  const { aggregate, customerInfo, loading: contextLoading } = useApp();

  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'verify_identity',
      title: 'Verify Your Identity',
      description: 'Complete identity verification to comply with regulatory requirements',
      icon: '🔐',
      status: 'pending',
    },
    {
      id: 'address_details',
      title: 'Address and Work Details',
      description: 'Provide your residential address and employment information',
      icon: '🏠',
      status: 'pending',
    },
    {
      id: 'add_money',
      title: 'Add Money',
      description: 'Fund your investment account to start working towards your goal',
      icon: '💰',
      status: 'pending',
    },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleStepAction = (stepIndex: number) => {
    // In a real app, this would navigate to the actual KYC/verification flows
    // For now, we'll simulate completion
    const newSteps = [...steps];
    newSteps[stepIndex].status = 'in_progress';
    setSteps(newSteps);
    setCurrentStepIndex(stepIndex);

    // Simulate step completion after 2 seconds
    setTimeout(() => {
      const updatedSteps = [...newSteps];
      updatedSteps[stepIndex].status = 'completed';
      setSteps(updatedSteps);

      if (stepIndex < steps.length - 1) {
        setCurrentStepIndex(stepIndex + 1);
      } else {
        // All steps completed, navigate to success
        router.push({
          pathname: '/app/goals/create/success',
          query: { goalId, goalName, productName }
        });
      }
    }, 2000);
  };

  const handleStartOnboarding = () => {
    handleStepAction(0);
  };

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progress = (completedSteps / steps.length) * 100;

  if (contextLoading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Open Account | Vault22">
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
      <AppShell title="Open Account | Vault22">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/app/goals')}
              className="inline-flex items-center text-vault-green hover:text-vault-green-dark mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>

            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
                  Open Account to Invest
                </h1>
                <p className="text-vault-gray-600 dark:text-vault-gray-400">
                  Complete these steps to start investing in {productName}
                </p>
              </div>
              <div className="ml-6">
                <span className="text-6xl">🎯</span>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-700 rounded-full h-1 mb-2">
                <div
                  className="bg-vault-green h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                {completedSteps} of {steps.length} steps completed
              </p>
            </div>
          </div>

          {/* Goal Summary Card */}
          <div className="bg-gradient-to-br from-vault-green to-vault-green-dark p-6 rounded-2xl text-white mb-8">
            <h3 className="text-sm opacity-90 mb-2">Your Goal</h3>
            <h2 className="text-2xl font-bold mb-4">{goalName}</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Investment Product</p>
                <p className="font-semibold">{productName}</p>
              </div>
              <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>

          {/* Onboarding Steps */}
          <div className="space-y-4 mb-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`
                  relative bg-white dark:bg-vault-gray-800 rounded-2xl border-2 p-6 transition-all
                  ${step.status === 'completed' ? 'border-vault-green/30 bg-vault-green/5' :
                    step.status === 'in_progress' ? 'border-vault-green' :
                    'border-vault-gray-200 dark:border-vault-gray-700'
                  }
                `}
              >
                <div className="flex items-start">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-4 flex-shrink-0
                    ${step.status === 'completed' ? 'bg-vault-green/20' :
                      step.status === 'in_progress' ? 'bg-vault-green/10' :
                      'bg-vault-gray-100 dark:bg-vault-gray-700'
                    }
                  `}>
                    {step.status === 'completed' ? '✓' :
                     step.status === 'in_progress' ? (
                       <div className="w-6 h-6 border-2 border-vault-green border-t-transparent rounded-full animate-spin"></div>
                     ) : step.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-vault-black dark:text-white">
                        {step.title}
                      </h3>
                      {step.status === 'completed' && (
                        <span className="text-xs font-semibold text-vault-green">Completed</span>
                      )}
                      {step.status === 'in_progress' && (
                        <span className="text-xs font-semibold text-vault-green animate-pulse">In Progress...</span>
                      )}
                    </div>
                    <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400 mb-4">
                      {step.description}
                    </p>

                    {step.status === 'pending' && index === currentStepIndex && (
                      <button
                        onClick={() => handleStepAction(index)}
                        className="px-4 py-2 bg-vault-green text-vault-black dark:text-white rounded-lg font-semibold hover:bg-vault-green-light transition-all"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[42px] top-[84px] w-0.5 h-8 bg-vault-gray-200 dark:bg-vault-gray-700"></div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          {completedSteps === 0 && (
            <div className="bg-vault-gray-50 dark:bg-vault-gray-800 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold text-vault-black dark:text-white mb-2">
                Ready to Get Started?
              </h3>
              <p className="text-vault-gray-600 dark:text-vault-gray-400 mb-6">
                Complete all three steps to activate your investment account
              </p>
              <button
                onClick={handleStartOnboarding}
                className="px-8 py-3 bg-vault-green text-vault-black dark:text-white rounded-xl font-semibold hover:bg-vault-green-light transition-all"
              >
                Begin Verification
              </button>
            </div>
          )}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
