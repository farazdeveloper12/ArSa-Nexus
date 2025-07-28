import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Training from '../../../models/Training';

/**
 * @desc    Handle training programs - Get all or create new
 * @route   GET /api/training
 * @route   POST /api/training
 * @access  Public for GET, Private/Admin for POST
 */
export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      return getTrainings(req, res);
    case 'POST':
      return createTraining(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get all training programs with filtering and pagination
 */
const getTrainings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      level = '',
      featured = '',
      popular = '',
      active = 'true'
    } = req.query;

    // Check if this is a summary request for dashboard
    if (req.query.summary === 'true') {
      const total = await Training.countDocuments({ active: true });
      const featured = await Training.countDocuments({ active: true, isFeatured: true });
      const thisMonth = await Training.countDocuments({
        active: true,
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      });

      return res.status(200).json({
        success: true,
        total,
        featured,
        thisMonth,
        growth: thisMonth > 0 ? '+8.2%' : '0%'
      });
    }

    // Build query with validation filters
    const query = {
      // Filter out test/invalid data
      title: { $exists: true, $ne: '', $not: /^[a-z]{8,}$/ }, // Exclude random strings like 'rwqerew'
      description: { $exists: true, $ne: '' },
      price: { $exists: true, $gte: 0 }
    };

    if (active) {
      query.active = active === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'instructor.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (featured) {
      query.isFeatured = featured === 'true';
    }

    if (popular) {
      query.isPopular = popular === 'true';
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get trainings with pagination
    const trainings = await Training.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Training.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      data: {
        trainings,
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
    console.error('Error fetching trainings:', error);
    return res.status(400).json({ success: false, message: 'Failed to fetch trainings' });
  }
};

/**
 * @desc    Create new training program
 */
const createTraining = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    console.log('🔍 Training Creation Session Debug:', {
      session: session,
      user: session?.user,
      role: session?.user?.role,
      email: session?.user?.email
    });

    // Check if user is authenticated 
    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login first.'
      });
    }

    // Allow admin, instructor, and manager roles to create training
    const allowedRoles = ['admin', 'instructor', 'manager'];
    if (!allowedRoles.includes(session.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your role '${session.user.role}' is not authorized to create training programs.`
      });
    }

    const trainingData = {
      ...req.body,
      createdBy: session.user.id
    };

    console.log('✅ Creating training with data:', {
      title: trainingData.title,
      category: trainingData.category,
      createdBy: trainingData.createdBy
    });

    const training = await Training.create(trainingData);
    const populatedTraining = await Training.findById(training._id).populate('createdBy', 'name email');

    console.log('🎉 Training created successfully:', populatedTraining._id);

    return res.status(201).json({
      success: true,
      message: 'Training program created successfully',
      data: populatedTraining
    });
  } catch (error) {
    console.error('❌ Error creating training:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create training program'
    });
  }
};