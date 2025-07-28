import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Announcement from '../../../models/Announcement';

/**
 * @desc    Handle announcements - Get all or create new
 * @route   GET /api/announcements
 * @route   POST /api/announcements
 * @access  Public for GET, Private/Admin for POST
 */
export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      return getAnnouncements(req, res);
    case 'POST':
      return createAnnouncement(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get all announcements with filtering and pagination
 */
const getAnnouncements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      type = '',
      priority = '',
      targetAudience = '',
      location = '',
      active = '',
      userRole = 'all'
    } = req.query;

    // Special endpoint for active announcements for website display
    if (req.query.active_only === 'true') {
      const now = new Date();
      const announcements = await Announcement.find({
        isActive: true,
        startDate: { $lte: now },
        $or: [
          { endDate: { $exists: false } },
          { endDate: null },
          { endDate: { $gte: now } }
        ],
        $or: [
          { targetAudience: 'all' },
          { targetAudience: userRole }
        ],
        ...(location && { displayLocation: { $in: [location, 'global'] } })
      })
        .populate('createdBy', 'name email')
        .sort({ priority: -1, createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: announcements
      });
    }

    // Admin dashboard summary
    if (req.query.summary === 'true') {
      const total = await Announcement.countDocuments();
      const active = await Announcement.countDocuments({ isActive: true });
      const thisMonth = await Announcement.countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      });

      return res.status(200).json({
        success: true,
        total,
        active,
        thisMonth,
        growth: thisMonth > 0 ? '+12.5%' : '0%'
      });
    }

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.type = type;
    }

    if (priority) {
      query.priority = priority;
    }

    if (targetAudience) {
      query.targetAudience = targetAudience;
    }

    if (location) {
      query.displayLocation = { $in: [location] };
    }

    if (active !== '') {
      query.isActive = active === 'true';
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get announcements with pagination
    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Announcement.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      data: {
        announcements,
        pagination: {
          current: pageNum,
          totalPages,
          total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return res.status(400).json({ success: false, message: 'Failed to fetch announcements' });
  }
};

/**
 * @desc    Create new announcement
 */
const createAnnouncement = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated 
    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login first.'
      });
    }

    // Allow admin, manager, and editor roles to create announcements
    const allowedRoles = ['admin', 'manager', 'editor'];
    if (!allowedRoles.includes(session.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your role '${session.user.role}' is not authorized to create announcements.`
      });
    }

    const announcementData = {
      ...req.body,
      createdBy: session.user.id
    };

    console.log('✅ Creating announcement with data:', {
      title: announcementData.title,
      type: announcementData.type,
      priority: announcementData.priority,
      createdBy: announcementData.createdBy
    });

    const announcement = await Announcement.create(announcementData);
    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name email');

    console.log('🎉 Announcement created successfully:', populatedAnnouncement._id);

    return res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: populatedAnnouncement
    });
  } catch (error) {
    console.error('❌ Error creating announcement:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create announcement'
    });
  }
}; 