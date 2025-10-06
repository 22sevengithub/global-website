// Protected Route Component - Requires Authentication

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../contexts/AppContext';
import LoadingAnimation from './LoadingAnimation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated } = useApp();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Quick auth check - just verify session exists
    const sessionToken = sessionStorage.getItem('sessionToken');

    if (!sessionToken) {
      router.push('/login');
    }

    // Stop showing loading screen after quick check
    setChecking(false);
  }, [router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!checking && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, checking, router]);

  // Show brief loading state only during initial auth check
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vault-gray-50 dark:bg-vault-gray-900">
        <LoadingAnimation size={200} />
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content (individual pages handle data loading)
  return <>{children}</>;
}
