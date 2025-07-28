import { getSession } from 'next-auth/react';
import dbConnect from '../../../../lib/dbConnect';
import Enrollment from '../../../../models/Enrollment';
import Training from '../../../../models/Training';
import User from '../../../../models/User';

/**
 * @desc    Handle enrollments - Get all enrollments or create a new enrollment
 * @route   GET /api/training/enrollment
 * @route   POST /api/training/enrollment
 * @access  Private/Admin or Manager for GET, Private for POST
 */
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  
  // Connect to database
  await dbConnect();
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      // Only admin or manager can get all enrollments
      if (!['admin', 'manager'].includes(session.user.role)) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }
      return getEnrollments(req, res);
    case 'POST':
      return createEnrollment(req, res, session.user.id);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get all enrollments with pagination, filtering, and sorting
 */
const getEnrollments = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const training = req.query.training || '';
    const sortField = req.query.sortField || 'enrollmentDate';
    const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    if (search) {
      // We need to use aggregation to search by user name or email
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');
      
      if (users.length > 0) {
        filter.user = { $in: users.map(user => user._id) };
      } else {
        // No users match the search, return empty result
        return res.status(200).json({
          success: true,
          enrollments: [],
          page,
          limit,
          totalPages: 0,
          total: 0,
        });
      }
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (training) {
      filter.training = training;
    }
    
    // Build sort object
    const sort = {};
    sort[sortField] = sortDirection;
    
    // Execute query with pagination and populate related fields
    const enrollments = await Enrollment.find(filter)
      .populate('user', 'name email')
      .populate('training', 'title slug level')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Enrollment.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    return res.status(200).json({
      success: true,
      enrollments,
      page,
      limit,
      totalPages,
      total,
    });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Create a new enrollment
 */
const createEnrollment = async (req, res, userId) => {
  try {
    const { trainingId, notes } = req.body;
    
    // Validate input
    if (!trainingId) {
      return res.status(400).json({ success: false, message: 'Training ID is required' });
    }
    
    // Check if training exists and is active
    const training = await Training.findById(trainingId);
    
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training program not found' });
    }
    
    if (!training.isActive) {
      return res.status(400).json({ success: false, message: 'This training program is currently inactive' });
    }
    
    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      training: trainingId,
    });
    
    if (existingEnrollment) {
      return res.status(409).json({ success: false, message: 'You are already enrolled in this training program' });
    }
    
    // Check if training has reached maximum capacity
    if (training.maxCapacity) {
      const currentEnrollments = await Enrollment.countDocuments({ training: trainingId });
      
      if (currentEnrollments >= training.maxCapacity) {
        return res.status(400).json({ success: false, message: 'This training program has reached its maximum capacity' });
      }
    }
    
    // Create enrollment
    const enrollment = await Enrollment.create({
      user: userId,
      training: trainingId,
      enrollmentDate: new Date(),
      status: 'confirmed',
      progressPercentage: 0,
      notes: notes || '',
    });
    
    // Increment enrolled count in training
    training.enrolledCount = (training.enrolledCount || 0) + 1;
    await training.save();
    
    // Return the enrollment populated with user and training details
    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('user', 'name email')
      .populate('training', 'title slug level');
    
    return res.status(201).json({
      success: true,
      message: 'Enrolled successfully in the training program',
      enrollment: populatedEnrollment,
    });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};