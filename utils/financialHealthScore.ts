// Financial Health Score Calculation Logic

import { Account, Transaction, CategoryTotal, Goal } from '../types';

export interface FHSCalculation {
  overallScore: number;
  savingsScore: number;
  insuranceScore: number;
  investmentScore: number;
  debtScore: number;
  spendingScore: number;
  recommendations: string[];
}

/**
 * Calculate Financial Health Score
 * Score ranges from 0-100, with 5 components each worth 20 points
 */
export function calculateFinancialHealthScore(
  accounts: Account[],
  transactions: Transaction[],
  categoryTotals: CategoryTotal[],
  goals: Goal[],
  monthlyIncome: number
): FHSCalculation {
  const savingsScore = calculateSavingsScore(accounts, monthlyIncome);
  const insuranceScore = calculateInsuranceScore(accounts);
  const investmentScore = calculateInvestmentScore(accounts, goals);
  const debtScore = calculateDebtScore(accounts, monthlyIncome);
  const spendingScore = calculateSpendingScore(categoryTotals, monthlyIncome);

  const overallScore = savingsScore + insuranceScore + investmentScore + debtScore + spendingScore;

  const recommendations = generateRecommendations({
    overallScore,
    savingsScore,
    insuranceScore,
    investmentScore,
    debtScore,
    spendingScore
  });

  return {
    overallScore,
    savingsScore,
    insuranceScore,
    investmentScore,
    debtScore,
    spendingScore,
    recommendations
  };
}

/**
 * Calculate Savings Score (0-20 points)
 * Based on emergency fund and savings rate
 */
function calculateSavingsScore(accounts: Account[], monthlyIncome: number): number {
  const savingsAccounts = accounts.filter(a =>
    a.accountClass === 'Bank' && a.accountType?.toLowerCase().includes('savings')
  );

  const totalSavings = savingsAccounts.reduce((sum, acc) => sum + (acc.currentBalance?.amount || 0), 0);

  let score = 0;

  // Emergency fund coverage (up to 12 points)
  const monthsCovered = totalSavings / monthlyIncome;
  if (monthsCovered >= 6) {
    score += 12;
  } else if (monthsCovered >= 3) {
    score += 8;
  } else if (monthsCovered >= 1) {
    score += 4;
  }

  // Savings rate (up to 8 points)
  // TODO: Calculate actual savings rate from transactions
  // For now, give partial credit
  score += 4;

  return Math.min(score, 20);
}

/**
 * Calculate Insurance Score (0-20 points)
 * Based on insurance coverage
 */
function calculateInsuranceScore(accounts: Account[]): number {
  // Check for insurance-related accounts or coverage
  // This would need integration with insurance data
  // For now, return partial score
  return 10; // Placeholder
}

/**
 * Calculate Investment Score (0-20 points)
 * Based on investment portfolio and diversification
 */
function calculateInvestmentScore(accounts: Account[], goals: Goal[]): number {
  const investmentAccounts = accounts.filter(a => a.accountClass === 'Investment');
  const totalInvestments = investmentAccounts.reduce((sum, acc) => sum + (acc.currentBalance?.amount || 0), 0);

  let score = 0;

  // Has investments (8 points)
  if (totalInvestments > 0) {
    score += 8;
  }

  // Has active investment goals (6 points)
  const activeGoals = goals.filter(g => g.status === 'Continue' || g.status === 'Pending');
  if (activeGoals.length > 0) {
    score += 6;
  }

  // Diversification (6 points)
  if (investmentAccounts.length >= 2) {
    score += 6;
  } else if (investmentAccounts.length === 1) {
    score += 3;
  }

  return Math.min(score, 20);
}

/**
 * Calculate Debt Score (0-20 points)
 * Based on debt-to-income ratio and payment history
 */
function calculateDebtScore(accounts: Account[], monthlyIncome: number): number {
  const debtAccounts = accounts.filter(a =>
    a.accountClass === 'CreditCard' || a.accountClass === 'Loan'
  );

  const totalDebt = debtAccounts.reduce((sum, acc) => {
    const balance = acc.currentBalance?.amount || 0;
    return sum + (balance < 0 ? Math.abs(balance) : 0);
  }, 0);

  const debtToIncomeRatio = (totalDebt / monthlyIncome) * 100;

  let score = 20;

  // Deduct points based on debt-to-income ratio
  if (debtToIncomeRatio > 50) {
    score = 0;
  } else if (debtToIncomeRatio > 40) {
    score = 5;
  } else if (debtToIncomeRatio > 30) {
    score = 10;
  } else if (debtToIncomeRatio > 20) {
    score = 15;
  }

  return score;
}

/**
 * Calculate Spending Score (0-20 points)
 * Based on budget adherence and spending patterns
 */
function calculateSpendingScore(categoryTotals: CategoryTotal[], monthlyIncome: number): number {
  let score = 0;

  // Budget tracking (10 points)
  const trackedCategories = categoryTotals.filter(ct => ct.isTrackedCategory);
  if (trackedCategories.length >= 5) {
    score += 10;
  } else if (trackedCategories.length >= 3) {
    score += 7;
  } else if (trackedCategories.length > 0) {
    score += 4;
  }

  // Budget adherence (10 points)
  const adherenceScores = trackedCategories.map(ct => {
    const budgetOrAverage = ct.plannedAmount || ct.averageAmount || 0;
    if (budgetOrAverage === 0) return 0;
    const adherence = Math.min((budgetOrAverage - ct.totalAmount) / budgetOrAverage, 1);
    return adherence > 0 ? adherence : 0;
  });

  if (adherenceScores.length > 0) {
    const avgAdherence = adherenceScores.reduce((a, b) => a + b, 0) / adherenceScores.length;
    score += Math.round(avgAdherence * 10);
  }

  return Math.min(score, 20);
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(scores: {
  overallScore: number;
  savingsScore: number;
  insuranceScore: number;
  investmentScore: number;
  debtScore: number;
  spendingScore: number;
}): string[] {
  const recommendations: string[] = [];

  if (scores.savingsScore < 15) {
    recommendations.push('Build up your emergency fund to cover at least 3 months of expenses');
  }

  if (scores.insuranceScore < 15) {
    recommendations.push('Consider adding insurance coverage to protect your assets');
  }

  if (scores.investmentScore < 15) {
    recommendations.push('Start investing regularly to build long-term wealth');
  }

  if (scores.debtScore < 15) {
    recommendations.push('Focus on reducing high-interest debt to improve your debt-to-income ratio');
  }

  if (scores.spendingScore < 15) {
    recommendations.push('Track your spending more closely and stick to your budget');
  }

  if (recommendations.length === 0) {
    recommendations.push('Great job! Keep maintaining your excellent financial habits');
  }

  return recommendations;
}

/**
 * Get score level description
 */
export function getScoreLevelDescription(score: number): {
  level: string;
  description: string;
  color: string;
} {
  if (score >= 80) {
    return {
      level: 'Excellent',
      description: "You're in great financial shape!",
      color: 'text-vault-green'
    };
  } else if (score >= 60) {
    return {
      level: 'Good',
      description: "You're doing well, with room for improvement",
      color: 'text-blue-500'
    };
  } else if (score >= 40) {
    return {
      level: 'Fair',
      description: "There's work to do to improve your finances",
      color: 'text-yellow-500'
    };
  } else {
    return {
      level: 'Needs Work',
      description: "Focus on building better financial habits",
      color: 'text-red-500'
    };
  }
}
