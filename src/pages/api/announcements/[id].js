import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Announcement from '../../../models/Announcement';

/**
 * @desc    Handle single announcement - Get, update, or delete announcement by ID
 * @route   GET /api/announcements/:id
 * @route   PUT /api/announcements/:id
 * @route   PATCH /api/announcements/:id
 * @route   DELETE /api/announcements/:id
 * @access  Public for GET, Private/Admin for PUT/DELETE
 */
export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Announcement ID is required' });
  }

  await dbConnect();

  switch (req.method) {
    case 'GET':
      return getAnnouncement(req, res, id);
    case 'PUT':
    case 'PATCH':
      return updateAnnouncement(req, res, id);
    case 'DELETE':
      return deleteAnnouncement(req, res, id);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get a single announcement by ID
 */
const getAnnouncement = async (req, res, id) => {
  try {
    const announcement = await Announcement.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    return res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return res.status(400).json({ success: false, message: 'Failed to fetch announcement' });
  }
};

/**
 * @desc    Update an announcement
 */
const updateAnnouncement = async (req, res, id) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated and has appropriate role
    if (!session || !['admin', 'manager', 'editor'].includes(session.user.role)) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const updateData = {
      ...req.body,
      updatedBy: session.user.id,
      updatedAt: new Date()
    };

    const announcement = await Announcement.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcement
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update announcement'
    });
  }
};

/**
 * @desc    Delete an announcement
 */
const deleteAnnouncement = async (req, res, id) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated and has appropriate role
    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return res.status(400).json({ success: false, message: 'Failed to delete announcement' });
  }
}; 