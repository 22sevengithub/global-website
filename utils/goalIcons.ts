import { GoalCategory } from '../types';

/**
 * Goal Icon Mapping Utility
 *
 * This utility provides icon mapping for goal types and categories.
 * Icons are primarily sourced from backend iconUrl field, with fallbacks for common types.
 */

// Fallback emoji icons for common goal types
export const getGoalEmojiIcon = (goalType: string): string => {
  const emojiIcons: Record<string, string> = {
    'emergency': '🛡️',
    'retirement': '🌴',
    'travel': '✈️',
    'home': '🏡',
    'house': '🏡',
    'vehicle': '🚗',
    'car': '🚗',
    'education': '🎓',
    'wedding': '💍',
    'investment': '📈',
    'savings': '💰',
    'vacation': '🏖️',
    'business': '💼',
    'medical': '🏥',
    'pilgrimage': '🕌',
    'hajj': '🕌',
    'umrah': '🕋',
    'general': '🎯',
    'custom': '🎯',
    'default': '🎯',
  };

  const normalizedType = goalType.toLowerCase().trim();
  return emojiIcons[normalizedType] || emojiIcons.default;
};

// Get icon URL or fallback to emoji
export const getGoalIcon = (iconUrl?: string, goalType?: string): string => {
  // If backend provides iconUrl, use it
  if (iconUrl && iconUrl.trim()) {
    return iconUrl;
  }

  // Otherwise, use emoji fallback
  return getGoalEmojiIcon(goalType || 'default');
};

// Get category color scheme
export const getGoalCategoryColor = (category: GoalCategory): {
  bg: string;
  border: string;
  text: string;
  gradient: string;
} => {
  switch (category) {
    case GoalCategory.General:
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
        gradient: 'from-blue-500 to-indigo-500',
      };
    case GoalCategory.Financial:
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300',
        gradient: 'from-green-500 to-emerald-500',
      };
    case GoalCategory.Lifestyle:
      return {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        text: 'text-purple-700 dark:text-purple-300',
        gradient: 'from-purple-500 to-pink-500',
      };
    case GoalCategory.Pilgrimage:
      return {
        bg: 'bg-teal-50 dark:bg-teal-900/20',
        border: 'border-teal-200 dark:border-teal-800',
        text: 'text-teal-700 dark:text-teal-300',
        gradient: 'from-teal-500 to-cyan-500',
      };
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-800',
        border: 'border-gray-200 dark:border-gray-700',
        text: 'text-gray-700 dark:text-gray-300',
        gradient: 'from-gray-500 to-gray-600',
      };
  }
};

// Get category name
export const getGoalCategoryName = (category: GoalCategory): string => {
  switch (category) {
    case GoalCategory.General:
      return 'General';
    case GoalCategory.Financial:
      return 'Financial';
    case GoalCategory.Lifestyle:
      return 'Lifestyle';
    case GoalCategory.Pilgrimage:
      return 'Pilgrimage';
    default:
      return 'Other';
  }
};

// Get goal status color and label
export const getGoalStatusDisplay = (status: string): {
  label: string;
  color: string;
  bgColor: string;
} => {
  switch (status) {
    case 'Continue':
      return {
        label: 'In Progress',
        color: 'text-blue-700 dark:text-blue-300',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      };
    case 'Pending':
      return {
        label: 'Pending Funds',
        color: 'text-yellow-700 dark:text-yellow-300',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      };
    case 'Reached':
      return {
        label: 'Goal Reached',
        color: 'text-green-700 dark:text-green-300',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
      };
    case 'None':
    default:
      return {
        label: 'Not Started',
        color: 'text-gray-700 dark:text-gray-300',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
      };
  }
};

// Get journey step name
export const getJourneyStepName = (step: number): string => {
  switch (step) {
    case 1:
      return 'Goal Creation';
    case 2:
      return 'Investment Style';
    case 3:
      return 'Goal Calculator';
    case 4:
      return 'Product Selection';
    case 5:
      return 'Completed';
    case 6:
      return 'Product Advice';
    default:
      return 'Unknown Step';
  }
};

// Calculate goal progress percentage
export const calculateGoalProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  const percentage = (current / target) * 100;
  return Math.min(Math.round(percentage), 100);
};

// Get progress color based on percentage
export const getProgressColor = (percentage: number): string => {
  if (percentage >= 100) return 'bg-green-500';
  if (percentage >= 75) return 'bg-blue-500';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 25) return 'bg-orange-500';
  return 'bg-red-500';
};
