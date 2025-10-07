import Link from 'next/link';
import { useRouter } from 'next/router';
import Icon from './Icon';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface BottomNavProps {
  items: NavItem[];
}

export default function BottomNav({ items }: BottomNavProps) {
  const router = useRouter();

  const isActive = (path: string) => {
    // Handle special case for Menu/More tab
    if (path === '/app/more') {
      return router.pathname === '/app/more' ||
             router.pathname === '/app/goals' ||
             router.pathname === '/app/investments' ||
             router.pathname === '/app/health-score' ||
             router.pathname === '/app/profile' ||
             router.pathname === '/app/settings' ||
             router.pathname === '/app/notifications' ||
             router.pathname === '/app/currency-settings' ||
             router.pathname === '/app/investment-style';
    }
    return router.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-thanos-900 border-t border-gray-200 dark:border-thanos-700 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-20 px-1">
        {items.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center h-full px-1 group"
            >
              <div
                className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                  active
                    ? 'w-16 h-8 bg-yellow'
                    : 'w-8 h-8 bg-transparent'
                }`}
              >
                <div className={`transition-opacity ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'} dark:invert`}>
                  <Icon
                    name={item.icon}
                    size={24}
                  />
                </div>
              </div>
              <span
                className={`text-[9px] font-medium mt-0.5 transition-colors leading-tight text-center ${
                  active
                    ? 'text-gray-900 dark:text-thanos-50'
                    : 'text-gray-600 dark:text-thanos-200'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
