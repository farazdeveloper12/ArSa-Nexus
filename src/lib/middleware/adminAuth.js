// Admin Authentication Middleware
// Protects all /admin/* routes from unauthorized access

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../pages/api/auth/[...nextauth]';

export async function requireAdminAuth(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

    // Check if user has admin or manager role
    const allowedRoles = ['admin', 'manager'];
    if (!allowedRoles.includes(session.user.role)) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }

    // User is authenticated and authorized
    return {
      props: {
        session,
      },
    };
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
}

// Client-side hook for admin authentication
export function useAdminAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      router.push('/admin/login');
      return;
    }
  }, [session, status, router]);

  return { session, status };
} 