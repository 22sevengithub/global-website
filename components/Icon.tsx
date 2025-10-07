import Image from 'next/image';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function Icon({ name, className = '', size = 24 }: IconProps) {
  // PNG icons from mobile app (all icon names that have .png extension)
  const pngIcons = [
    // Navigation icons
    'v22Logo', 'acc', 'tracking', 'budget', 'ic_menu', 'back',
    // Account type icons
    'bank', 'credit', 'cryptocurrency', 'investments', 'loans', 'property',
    'retirement', 'rewards', 'vehicles', 'other', 'home', 'home_loan', 'vehicle_loans',
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
    'year_end_review_icon'
  ];

  // Determine if this is a PNG icon
  const isPng = pngIcons.includes(name);
  const iconPath = `/icons/${name}.${isPng ? 'png' : 'svg'}`;

  // Apply filter to make all PNG icons the same dark color
  // Using opacity on the parent div controlled by BottomNav
  const imageClassName = 'w-full h-full object-contain';

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        // Make all PNG icons monochrome by applying filter
        filter: isPng ? 'brightness(0) saturate(100%)' : 'none',
      }}
    >
      <Image
        src={iconPath}
        alt={name}
        width={size}
        height={size}
        className={imageClassName}
      />
    </div>
  );
}
