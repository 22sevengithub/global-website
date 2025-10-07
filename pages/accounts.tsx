// Redirect to new app accounts
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AccountsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/accounts');
  }, [router]);

  return null;
}
