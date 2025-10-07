// Redirect to new app page
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Redirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/health-score');
  }, [router]);

  return null;
}
