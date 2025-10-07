// Redirect to new app accounts page
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AddManualAccountRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/accounts');
  }, [router]);

  return null;
}
