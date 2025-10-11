interface FlagIconProps {
  country: 'uae' | 'za';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FlagIcon({ country, size = 'md', className = '' }: FlagIconProps) {
  const sizeClasses = {
    sm: 'w-6 h-4',      // 24x16px (3:2 ratio)
    md: 'w-9 h-6',      // 36x24px (3:2 ratio)
    lg: 'w-12 h-8'      // 48x32px (3:2 ratio)
  };

  const flags = {
    // UAE Flag - Matching Figma UI Flags library format
    // Red: #EF4444, Green: #22C55E, White: #FFFFFF, Black: #000000
    // Standard 3:2 ratio (54x36) with rounded corners rx="8"
    uae: (
      <svg viewBox="0 0 54 36" className={`${sizeClasses[size]} ${className}`} style={{ display: 'inline-block' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="uae-rounded">
            <rect width="54" height="36" rx="8"/>
          </clipPath>
        </defs>
        <g clipPath="url(#uae-rounded)">
          {/* Green stripe (top) */}
          <rect width="54" height="12" fill="#22C55E"/>
          {/* White stripe (middle) */}
          <rect y="12" width="54" height="12" fill="#FFFFFF"/>
          {/* Black stripe (bottom) */}
          <rect y="24" width="54" height="12" fill="#000000"/>
          {/* Red vertical band (left) */}
          <rect width="18" height="36" fill="#EF4444"/>
        </g>
      </svg>
    ),
    // South Africa Flag - Matching Figma UI Flags library exactly
    // Colors from Figma: Yellow #FBBF24, Red #EF4444, Blue #3B82F6, Green #22C55E, Black #262626
    za: (
      <svg viewBox="0 0 54 36" className={`${sizeClasses[size]} ${className}`} style={{ display: 'inline-block' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="za-rounded">
            <rect width="54" height="36" rx="8"/>
          </clipPath>
        </defs>
        <g clipPath="url(#za-rounded)">
          {/* Yellow Y-shape triangle (base layer) */}
          <path d="M17.45 16.24L11.74 12.18L0 3.82996V6.47996L8.02 12.18L15.25 17.32C15.71 17.65 15.71 18.34 15.25 18.67L8 23.83L0 29.52V32.17L11.73 23.83L17.46 19.76C18.03 19.36 18.37 18.7 18.37 18C18.37 17.3 18.03 16.64 17.46 16.24H17.45Z" fill="#FBBF24"/>

          {/* Red top band */}
          <path d="M54 0V12.18H30.29C29.14 12.18 28.01 11.84 27.06 11.19L10.53 0H54Z" fill="#EF4444"/>

          {/* Blue bottom band */}
          <path d="M54 23.83V36H10.53L27.06 24.82C28.01 24.18 29.14 23.83 30.29 23.83H54.01H54Z" fill="#3B82F6"/>

          {/* Green Y-shape main body */}
          <path d="M54 14.34V21.67H29.62C28.47 21.67 27.35 22.01 26.39 22.66L24.65 23.83L6.66 36H0V32.17L11.73 23.83L17.46 19.76C18.03 19.36 18.37 18.7 18.37 18C18.37 17.3 18.03 16.64 17.46 16.24L11.75 12.18L0 3.83V0H6.68L24.67 12.18L26.4 13.35C27.35 14 28.48 14.34 29.63 14.34H54.01H54Z" fill="#22C55E"/>

          {/* Black triangle (center of Y) */}
          <path d="M15.25 18.67L8 23.83L0 29.52V6.47998L8.02 12.18L15.25 17.32C15.71 17.65 15.71 18.34 15.25 18.67Z" fill="#262626"/>
        </g>
      </svg>
    )
  };

  return flags[country];
}
