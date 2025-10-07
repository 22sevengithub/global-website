// Redirect to new app transactions
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TransactionsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/transactions');
  }, [router]);

  return null;
}
