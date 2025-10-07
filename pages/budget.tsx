// Redirect to new app budget
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BudgetRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/budget');
  }, [router]);

  return null;
}
