import { getSession } from 'next-auth/react';
import dbConnect from '../../../../lib/dbConnect';
import Enrollment from '../../../../models/Enrollment';
import Training from '../../../../models/Training';

/**
 * @desc    Handle single enrollment - Get, update, or delete enrollment by ID
 * @route   GET /api/training/enrollment/:id
 * @route   PUT /api/training/enrollment/:id
 * @route   PATCH /api/training/enrollment/:id
 * @route   DELETE /api/training/enrollment/:id
 * @access  Private/Admin or Manager for all, Private for GET own enrollment
 */
export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  
  // Get enrollment ID from the URL
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ success: false, message: 'Enrollment ID is required' });
  }
  
  // Connect to database
  await dbConnect();
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getEnrollment(req, res, id, session.user);
    case 'PUT':
    case 'PATCH':
      // Only admin or manager can update enrollments
      if (!['admin', 'manager'].includes(session.user.role)) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }
      return updateEnrollment(req, res, id);
    case 'DELETE':
      // Only admin or manager can delete enrollments
      if (!['admin', 'manager'].includes(session.user.role)) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }
      return deleteEnrollment(req, res, id);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get a single enrollment by ID
 */
const getEnrollment = async (req, res, id, user) => {
  try {
    const enrollment = await Enrollment.findById(id)
      .populate('user', 'name email')
      .populate({
        path: 'training',
        select: 'title slug level description duration startDate endDate instructor',
        populate: {
          path: 'instructor',
          select: 'name email',
        },
      });
    
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    
    // Check if user is authorized to view this enrollment
    // Allow if user is admin/manager or if this is their own enrollment
    if (!['admin', 'manager'].includes(user.role) && enrollment.user._id.toString() !== user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this enrollment' });
    }
    
    return res.status(200).json({ success: true, enrollment });
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update an enrollment
 */
const updateEnrollment = async (req, res, id) => {
  try {
    // Get the update data from request body
    const { status, progressPercentage, completedModules, certificate, notes, feedback } = req.body;
    
    // Find the enrollment
    const enrollment = await Enrollment.findById(id);
    
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    
    // Update fields if provided
    if (status) enrollment.status = status;
    if (progressPercentage !== undefined) enrollment.progressPercentage = progressPercentage;
    if (completedModules) enrollment.completedModules = completedModules;
    if (certificate) enrollment.certificate = certificate;
    if (notes) enrollment.notes = notes;
    if (feedback) enrollment.feedback = feedback;
    
    // Update timestamps
    enrollment.updatedAt = new Date();
    
    // Save the updated enrollment
    await enrollment.save();
    
    // Return the updated enrollment with populated fields
    const updatedEnrollment = await Enrollment.findById(id)
      .populate('user', 'name email')
      .populate({
        path: 'training',
        select: 'title slug level description',
        populate: {
          path: 'instructor',
          select: 'name email',
        },
      });
    
    return res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete an enrollment
 */
const deleteEnrollment = async (req, res, id) => {
  try {
    // Find the enrollment
    const enrollment = await Enrollment.findById(id);
    
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    
    // Get the training ID to update enrolled count later
    const trainingId = enrollment.training;
    
    // Delete the enrollment
    await Enrollment.findByIdAndDelete(id);
    
    // Decrement enrolled count in training
    const training = await Training.findById(trainingId);
    if (training) {
      training.enrolledCount = Math.max((training.enrolledCount || 0) - 1, 0);
      await training.save();
    }
    
    return res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};