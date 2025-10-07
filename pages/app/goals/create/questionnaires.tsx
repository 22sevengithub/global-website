import AppShell from '../../../../components/AppShell';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import LoadingAnimation from '../../../../components/LoadingAnimation';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../../../../contexts/AppContext';

interface Question {
  id: string;
  question: string;
  options: { id: string; label: string; score: number }[];
}

export default function GoalQuestionnaires() {
  const router = useRouter();
  const { goalId, goalName, goalTypeId, goalTypeName } = router.query;
  const { aggregate, customerInfo, loading } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);

  // Investment questionnaire questions
  const questions: Question[] = [
    {
      id: 'investment_experience',
      question: 'How would you describe your investment experience?',
      options: [
        { id: 'none', label: 'No experience', score: 1 },
        { id: 'limited', label: 'Limited experience', score: 2 },
        { id: 'moderate', label: 'Moderate experience', score: 3 },
        { id: 'extensive', label: 'Extensive experience', score: 4 },
      ],
    },
    {
      id: 'risk_tolerance',
      question: 'How do you feel about taking investment risks?',
      options: [
        { id: 'very_conservative', label: 'Very conservative - I prefer minimal risk', score: 1 },
        { id: 'conservative', label: 'Conservative - I prefer low risk', score: 2 },
        { id: 'moderate', label: 'Moderate - I can accept some risk', score: 3 },
        { id: 'aggressive', label: 'Aggressive - I can accept high risk for higher returns', score: 4 },
      ],
    },
    {
      id: 'investment_horizon',
      question: 'What is your investment time horizon?',
      options: [
        { id: 'short', label: 'Less than 2 years', score: 1 },
        { id: 'medium', label: '2-5 years', score: 2 },
        { id: 'long', label: '5-10 years', score: 3 },
        { id: 'very_long', label: 'More than 10 years', score: 4 },
      ],
    },
    {
      id: 'loss_reaction',
      question: 'If your investment lost 20% in value, what would you do?',
      options: [
        { id: 'sell_all', label: 'Sell everything immediately', score: 1 },
        { id: 'sell_some', label: 'Sell some of my investment', score: 2 },
        { id: 'hold', label: 'Hold and wait for recovery', score: 3 },
        { id: 'buy_more', label: 'Buy more at the lower price', score: 4 },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption || navigating) return;

    // Save answer
    const newAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Prevent duplicate navigation
      setNavigating(true);

      // Calculate risk profile based on scores
      const totalScore = questions.reduce((sum, q) => {
        const answerId = newAnswers[q.id];
        const option = q.options.find(o => o.id === answerId);
        return sum + (option?.score || 0);
      }, 0);

      const maxScore = questions.length * 4;
      const riskProfile = totalScore <= maxScore * 0.3 ? 'conservative' :
                         totalScore <= maxScore * 0.6 ? 'moderate' :
                         totalScore <= maxScore * 0.8 ? 'balanced' : 'aggressive';

      // Navigate to goal setup
      router.push({
        pathname: '/app/goals/create/setup',
        query: {
          goalId,
          goalName,
          goalTypeId,
          goalTypeName,
          riskProfile,
        }
      });
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[questions[currentQuestionIndex + 1]?.id] || null);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex === 0) {
      router.back();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[questions[currentQuestionIndex - 1]?.id] || null);
    }
  };

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppShell title="Investment Questionnaire | Vault22">
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
      <AppShell title="Investment Questionnaire | Vault22">
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
              Investment Questionnaire
            </h1>
            <p className="text-vault-gray-600 dark:text-vault-gray-400">
              Help us understand your investment preferences
            </p>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-700 rounded-full h-1 mb-2">
                <div
                  className="bg-vault-green h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(2 / 6) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">
                Step 2 of 6
              </p>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-vault-gray-800 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 p-8 mb-8">
            <div className="mb-6">
              <span className="text-sm font-semibold text-vault-green">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <h2 className="text-2xl font-bold text-vault-black dark:text-white mt-2">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`
                    w-full p-4 rounded-xl text-left transition-all border-2
                    ${selectedOption === option.id
                      ? 'border-vault-green bg-vault-green/5'
                      : 'border-vault-gray-200 dark:border-vault-gray-700 bg-vault-gray-50 dark:bg-vault-gray-700 hover:border-vault-green/50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-vault-black dark:text-white">
                      {option.label}
                    </span>
                    {selectedOption === option.id && (
                      <svg className="w-6 h-6 text-vault-green" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="sticky bottom-0 bg-white dark:bg-vault-gray-900 py-6 border-t border-vault-gray-200 dark:border-vault-gray-700">
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className={`
                w-full py-4 rounded-xl font-semibold text-lg transition-all
                ${selectedOption
                  ? 'bg-vault-green text-vault-black dark:text-white hover:bg-vault-green-light'
                  : 'bg-vault-gray-300 dark:bg-vault-gray-700 text-vault-gray-500 dark:text-vault-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isLastQuestion ? 'Continue' : 'Next Question'}
            </button>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
