import Image from 'next/image';

/**
 * Professional Icon System
 *
 * Design System:
 * - Filled: Solid icons for primary actions and active states
 * - Outlined: Line-based icons for secondary actions and default states
 * - Duotone: Two-tone icons for special emphasis
 *
 * Color Palette:
 * - Primary: Vault Green (#00D66E)
 * - Secondary: Vault Blue (#0066FF)
 * - Neutral: Gray scale
 * - Accent: Custom colors for special cases
 */

export type IconVariant = 'filled' | 'outlined' | 'duotone';
export type IconColor =
  | 'primary'       // Vault Green
  | 'secondary'     // Vault Blue
  | 'success'       // Green
  | 'warning'       // Yellow/Orange
  | 'error'         // Red
  | 'neutral'       // Gray
  | 'white'         // White
  | 'inherit';      // Inherit from parent

interface IconProfessionalProps {
  name: string;
  className?: string;
  size?: number;
  variant?: IconVariant;
  color?: IconColor;
  opacity?: number;
}

export default function IconProfessional({
  name,
  className = '',
  size = 24,
  variant = 'outlined',
  color = 'neutral',
  opacity = 1
}: IconProfessionalProps) {
  // PNG icons from mobile app (all icon names that have .png extension)
  const pngIcons = [
    // Navigation icons
    'v22Logo', 'acc', 'tracking', 'budget', 'ic_menu', 'back',
    // Account group icons that are PNG (from icon_map.dart)
    'investments', 'home_loan', 'vehicle_loans', 'home',
    // Other account type icons
    'retirement',
    // Dashboard & UI icons
    'dashboard', 'add_widget', 'calendar', 'filter', 'goggles', 'checkmark_circle',
    'cog', 'more_horizontal', 'user-icon', 'merchant_logo',
    // Status & alert icons
    'ic_alert', 'ic_circle', 'ic_clock', 'ic_error', 'ic_linking_account',
    'ic_question', 'ic_refresh', 'ic_time_off', 'ic_warning',
    // Background & decorative
    'background_linear_dark', 'background_linear_light', 'bg_gradient_dark',
    'bg_gradient_light', 'widget_background', 'explore_bg',
    // Budget & transaction icons
    'budget_breakdown', 'money_in_money_out', 'overall_spend', 'no_spend_category_detail',
    'ic_budget_tag_transactions', 'transactions',
    // Emoticons (spending group icons)
    'emoBlue', 'emoPeach', 'shock', 'smiley', 'starryEyes', 'tough',
    // Other icons
    'burgers', 'fries', 'days_till_payday_shapes', 'logo_linking_account',
    'macd', 'payday_empty_state', 'pro-tip', 'speaker_angle', 'Subtract',
    'year_end_review_icon',
    // Manual account icons (PNG)
    'manual_account/bank', 'manual_account/credit_card', 'manual_account/cryptocurrency',
    'manual_account/investment', 'manual_account/real_estate', 'manual_account/loans',
    'manual_account/insurance', 'manual_account/cash', 'manual_account/deposit',
    'manual_account/vehicle', 'manual_account/vehicle_loans', 'manual_account/home',
    'manual_account/home_loan', 'manual_account/household_content', 'manual_account/jewel',
    'manual_account/precious_metals', 'manual_account/reward', 'manual_account/store_card',
    'manual_account/something_else', 'manual_account/default', 'manual_account/retirement',
    'manual_account/car', 'manual_account/life', 'manual_account/retail', 'manual_account/wallet',
  ];

  // SVG icons that need special handling (account group icons from icon_map.dart)
  const svgIcons = [
    // Account group icons that are SVG
    'bank', 'credit', 'cryptocurrency', 'loans', 'property',
    'rewards', 'vehicles', 'other',
    // Manual account SVG
    'manual_account/savings',
    // Navigation and UI
    'accounts', 'dashboard', 'exit', 'goals', 'health-score', 'settings',
  ];

  // Check if name includes subfolder (e.g., "manual_account/bank")
  const isManualAccountIcon = name.startsWith('manual_account/');

  // Determine file extension
  let isPng = pngIcons.includes(name);
  let isSvg = svgIcons.includes(name);

  // If not explicitly listed, default behavior
  if (!isPng && !isSvg) {
    // Assume SVG for non-manual-account icons
    isSvg = !isManualAccountIcon;
    isPng = isManualAccountIcon;
  }

  const iconPath = `/icons/${name}.${isPng ? 'png' : 'svg'}`;

  // Color mapping for professional palette
  const colorMap: Record<IconColor, string> = {
    primary: 'text-vault-green',
    secondary: 'text-vault-blue',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    neutral: 'text-vault-gray-600 dark:text-vault-gray-400',
    white: 'text-white',
    inherit: ''
  };

  // Account group icons that should keep their original colors (no filter)
  const accountGroupIcons = ['investments', 'home_loan', 'vehicle_loans', 'home', 'bank', 'credit',
                              'cryptocurrency', 'loans', 'property', 'rewards', 'vehicles', 'other', 'retirement'];

  // Determine if icon should be monochrome or colored
  const shouldApplyFilter = isPng && !isManualAccountIcon && !accountGroupIcons.includes(name);

  // Get color class
  const colorClass = colorMap[color] || colorMap.neutral;

  // Variant-based styling
  const variantStyles: Record<IconVariant, string> = {
    filled: 'drop-shadow-sm',
    outlined: '',
    duotone: 'opacity-90'
  };

  return (
    <div
      className={`inline-flex items-center justify-center ${colorClass} ${variantStyles[variant]} ${className}`}
      style={{
        width: size,
        height: size,
        opacity: opacity,
      }}
    >
      {isSvg ? (
        <svg
          width={size}
          height={size}
          className="w-full h-full"
          style={{
            filter: shouldApplyFilter ? 'brightness(0) saturate(100%)' : 'none',
          }}
        >
          <use href={`${iconPath}#icon`} />
        </svg>
      ) : (
        <Image
          src={iconPath}
          alt={name}
          width={size}
          height={size}
          className="w-full h-full object-contain"
          style={{
            filter: shouldApplyFilter ? 'brightness(0) saturate(100%)' : 'none',
          }}
          unoptimized // Required for static export
        />
      )}
    </div>
  );
}
