import { useEffect } from 'react';
import { useRouter } from 'next/router';

const HiddenAdminPortal = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to professional admin login
    router.replace('/admin/login');
  }, [router]);

  return null;
};

export default HiddenAdminPortal; 