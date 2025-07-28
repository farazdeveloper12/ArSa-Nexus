// pages/api/admin/protected-route.js
import { authMiddleware } from '@/lib/middleware/auth';
import { checkPermission, roles } from '@/lib/middleware/permissions';
import nc from 'next-connect';

const handler = nc()
  .use(authMiddleware)
  .use(checkPermission(roles.ADMIN)) // Only admins can access
  .get(async (req, res) => {
    // Handle GET request
  });

export default handler;