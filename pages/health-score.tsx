import AppLayout from '../components/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingAnimation from '../components/LoadingAnimation';
import { useApp } from '../contexts/AppContext';
import { calculateFinancialHealthScore, getScoreLevelDescription } from '../utils/financialHealthScore';
import { getCurrentPayPeriod } from '../utils/payPeriod';

export default function HealthScore() {
  const { aggregate, customerInfo, loading } = useApp();

  if (loading || !aggregate) {
    return (
      <ProtectedRoute>
        <AppLayout title="Financial Health Score | Vault22">
          <div className="flex items-center justify-center min-h-screen">
            <LoadingAnimation size={200} />
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  const currentPayPeriod = getCurrentPayPeriod(customerInfo?.dayOfMonthPaid || 1);

  // Calculate monthly income from current pay period
  const currentMonthTransactions = aggregate.transactions.filter(t => t.payPeriod === currentPayPeriod);
  const monthlyIncome = currentMonthTransactions
    .filter(t => t.amount.debitOrCredit === 'credit')
    .reduce((sum, t) => sum + t.amount.amount, 0);

  // Calculate Financial Health Score
  const fhsData = calculateFinancialHealthScore(
    aggregate.accounts,
    aggregate.transactions,
    aggregate.categoryTotals,
    aggregate.goals,
    monthlyIncome
  );

  const scoreLevel = getScoreLevelDescription(fhsData.overallScore);

  const categories = [
    {
      name: 'Savings',
      score: (fhsData.savingsScore / 20) * 100,
      maxScore: 20,
      currentScore: fhsData.savingsScore,
      icon: '💰',
      color: 'bg-vault-green',
      insights: fhsData.recommendations.filter(r => r.toLowerCase().includes('savings') || r.toLowerCase().includes('emergency'))
    },
    {
      name: 'Insurance',
      score: (fhsData.insuranceScore / 20) * 100,
      maxScore: 20,
      currentScore: fhsData.insuranceScore,
      icon: '🛡️',
      color: 'bg-vault-blue',
      insights: fhsData.recommendations.filter(r => r.toLowerCase().includes('insurance'))
    },
    {
      name: 'Investments',
      score: (fhsData.investmentScore / 20) * 100,
      maxScore: 20,
      currentScore: fhsData.investmentScore,
      icon: '📈',
      color: 'bg-purple-500',
      insights: fhsData.recommendations.filter(r => r.toLowerCase().includes('invest'))
    },
    {
      name: 'Debt Management',
      score: (fhsData.debtScore / 20) * 100,
      maxScore: 20,
      currentScore: fhsData.debtScore,
      icon: '💳',
      color: 'bg-orange-500',
      insights: fhsData.recommendations.filter(r => r.toLowerCase().includes('debt'))
    },
    {
      name: 'Spending Habits',
      score: (fhsData.spendingScore / 20) * 100,
      maxScore: 20,
      currentScore: fhsData.spendingScore,
      icon: '💸',
      color: 'bg-vault-green',
      insights: fhsData.recommendations.filter(r => r.toLowerCase().includes('spending') || r.toLowerCase().includes('budget'))
    }
  ];

  // Financial targets based on score components
  const targets = [
    { name: 'Build 3-month emergency fund', status: fhsData.savingsScore >= 10 ? 'completed' : 'in-progress', icon: fhsData.savingsScore >= 10 ? '✅' : '🔄' },
    { name: 'Build 6-month emergency fund', status: fhsData.savingsScore >= 15 ? 'completed' : 'in-progress', icon: fhsData.savingsScore >= 15 ? '✅' : '🔄' },
    { name: 'Start investing regularly', status: fhsData.investmentScore >= 10 ? 'completed' : 'in-progress', icon: fhsData.investmentScore >= 10 ? '✅' : '🔄' },
    { name: 'Get adequate insurance coverage', status: fhsData.insuranceScore >= 15 ? 'completed' : 'in-progress', icon: fhsData.insuranceScore >= 15 ? '✅' : '🔄' },
    { name: 'Track expenses regularly', status: fhsData.spendingScore >= 10 ? 'completed' : 'in-progress', icon: fhsData.spendingScore >= 10 ? '✅' : '🔄' },
    { name: 'Reduce debt-to-income below 30%', status: fhsData.debtScore >= 15 ? 'completed' : 'in-progress', icon: fhsData.debtScore >= 15 ? '✅' : '🔄' },
    { name: 'Diversify investment portfolio', status: fhsData.investmentScore >= 18 ? 'completed' : 'in-progress', icon: fhsData.investmentScore >= 18 ? '✅' : '🔄' },
    { name: 'Maintain budget adherence', status: fhsData.spendingScore >= 15 ? 'completed' : 'in-progress', icon: fhsData.spendingScore >= 15 ? '✅' : '🔄' }
  ];

  return (
    <ProtectedRoute>
      <AppLayout title="Financial Health Score | Vault22">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-vault-black dark:text-white mb-2">
            Financial Health Score
          </h1>
          <p className="text-vault-gray-600 dark:text-vault-gray-400">Measure your overall financial wellness</p>
        </div>

        {/* Overall Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-vault-green to-vault-blue p-8 rounded-2xl text-white text-center">
              <h2 className="text-lg font-semibold mb-6">Overall Score</h2>
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="white"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(fhsData.overallScore / 100) * 552.92} 552.92`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-6xl font-bold">{fhsData.overallScore}</span>
                  <span className="text-sm opacity-90">out of 100</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{scoreLevel.level}!</p>
                <p className="text-sm opacity-90">{scoreLevel.description}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700 h-full">
              <h2 className="text-xl font-bold text-vault-black dark:text-white mb-6">Score Breakdown</h2>
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category.name}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-2xl mr-4`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-vault-black dark:text-white">{category.name}</h3>
                          <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">{category.currentScore.toFixed(1)} / {category.maxScore} points</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-vault-black dark:text-white">{category.score.toFixed(0)}</p>
                        <p className="text-xs text-vault-gray-500">score</p>
                      </div>
                    </div>
                    <div className="w-full bg-vault-gray-200 dark:bg-vault-gray-600 rounded-full h-3 mb-2">
                      <div
                        className={`${category.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${category.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {categories.map((category) => (
            <div key={category.name} className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-2xl mr-4`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-vault-black dark:text-white">{category.name}</h3>
                  <p className="text-sm text-vault-gray-600 dark:text-vault-gray-400">Score: {category.score.toFixed(0)}/100</p>
                </div>
                <div className={`px-4 py-2 rounded-full ${
                  category.score >= 80 ? 'bg-vault-green/20 text-vault-green' :
                  category.score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                  'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                } font-semibold`}>
                  {category.score >= 80 ? 'Great' : category.score >= 60 ? 'Good' : 'Needs Work'}
                </div>
              </div>
              <div className="space-y-2">
                {category.insights.length > 0 ? (
                  category.insights.map((insight, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-vault-gray-50 dark:bg-vault-gray-700 rounded-lg">
                      <span className="text-lg mr-2">💡</span>
                      <p className="text-sm text-vault-gray-700 dark:text-vault-gray-300">{insight}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start p-3 bg-vault-gray-50 dark:bg-vault-gray-700 rounded-lg">
                    <span className="text-lg mr-2">✅</span>
                    <p className="text-sm text-vault-gray-700 dark:text-vault-gray-300">
                      {category.name} is in good shape. Keep up the good work!
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Targets */}
        <div className="bg-white dark:bg-vault-gray-800 p-6 rounded-2xl border border-vault-gray-200 dark:border-vault-gray-700">
          <h2 className="text-xl font-bold text-vault-black dark:text-white mb-6">Financial Targets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targets.map((target, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 ${
                  target.status === 'completed'
                    ? 'bg-vault-green/5 border-vault-green/20'
                    : 'bg-vault-gray-50 dark:bg-vault-gray-700 border-vault-gray-200 dark:border-vault-gray-600'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{target.icon}</span>
                  <div className="flex-1">
                    <p className={`font-semibold ${
                      target.status === 'completed' ? 'text-vault-green' : 'text-vault-gray-700 dark:text-vault-gray-300'
                    }`}>
                      {target.name}
                    </p>
                    <p className="text-xs text-vault-gray-500">
                      {target.status === 'completed' ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-gradient-to-br from-vault-blue/10 to-vault-green/10 p-6 rounded-2xl border border-vault-green/20">
          <div className="flex items-start">
            <span className="text-4xl mr-4">🎯</span>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-vault-black dark:text-white mb-3">
                {fhsData.overallScore >= 90 ? 'Recommendations to Reach 100' :
                 fhsData.overallScore >= 80 ? 'Recommendations to Reach 90+' :
                 fhsData.overallScore >= 70 ? 'Recommendations to Reach 80+' :
                 'Recommendations to Improve'}
              </h3>
              <div className="space-y-3">
                {fhsData.recommendations.length > 0 ? (
                  fhsData.recommendations.slice(0, 5).map((rec, idx) => (
                    <div key={idx} className="flex items-start p-3 bg-white dark:bg-vault-gray-800 rounded-lg">
                      <span className="text-lg mr-2">💡</span>
                      <p className="text-sm text-vault-gray-700 dark:text-vault-gray-300">{rec}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start p-3 bg-white dark:bg-vault-gray-800 rounded-lg">
                    <span className="text-lg mr-2">🎉</span>
                    <p className="text-sm text-vault-gray-700 dark:text-vault-gray-300">
                      You're doing excellent! Your financial health is in great shape.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
