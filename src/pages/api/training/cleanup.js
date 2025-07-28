import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Training from '../../../models/Training';

/**
 * @desc    Clean up invalid training records from database
 * @route   POST /api/training/cleanup
 * @access  Private/Admin only
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated and is admin
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Admin access required' });
    }

    await dbConnect();

    // Find and delete invalid training records
    const invalidTrainings = await Training.find({
      $or: [
        { title: { $exists: false } },
        { title: '' },
        { title: /^[a-z]{8,}$/ }, // Random lowercase strings like 'rwqerew'
        { description: { $exists: false } },
        { description: '' },
        { price: { $exists: false } },
        { category: { $exists: false } },
        { category: '' }
      ]
    });

    console.log('🧹 Found invalid training records:', invalidTrainings.map(t => ({
      id: t._id,
      title: t.title,
      description: t.description?.substring(0, 50)
    })));

    // Delete invalid records
    const deleteResult = await Training.deleteMany({
      $or: [
        { title: { $exists: false } },
        { title: '' },
        { title: /^[a-z]{8,}$/ }, // Random lowercase strings
        { description: { $exists: false } },
        { description: '' },
        { price: { $exists: false } },
        { category: { $exists: false } },
        { category: '' }
      ]
    });

    return res.status(200).json({
      success: true,
      message: `Cleaned up ${deleteResult.deletedCount} invalid training records`,
      deletedCount: deleteResult.deletedCount,
      invalidRecords: invalidTrainings.map(t => ({
        id: t._id,
        title: t.title || 'No title',
        issues: [
          !t.title ? 'Missing title' : null,
          t.title && t.title.match(/^[a-z]{8,}$/) ? 'Invalid title format' : null,
          !t.description ? 'Missing description' : null,
          t.price === undefined ? 'Missing price' : null,
          !t.category ? 'Missing category' : null
        ].filter(Boolean)
      }))
    });

  } catch (error) {
    console.error('Error cleaning up training records:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cleanup training records',
      error: error.message
    });
  }
} 