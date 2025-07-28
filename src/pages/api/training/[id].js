import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/dbConnect';
import Training from '../../../models/Training';
import Enrollment from '../../../models/Enrollment';
import slugify from '../../../lib/slugify';

/**
 * @desc    Handle single training - Get, update, or delete training by ID
 * @route   GET /api/training/:id
 * @route   PUT /api/training/:id
 * @route   DELETE /api/training/:id
 * @access  Public for GET, Private/Admin for PUT/DELETE
 */
export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Training ID is required' });
  }

  await dbConnect();

  switch (req.method) {
    case 'GET':
      return getTraining(req, res, id);
    case 'PUT':
      return updateTraining(req, res, id);
    case 'DELETE':
      return deleteTraining(req, res, id);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get a single training by ID
 */
const getTraining = async (req, res, id) => {
  try {
    const training = await Training.findById(id).populate('createdBy', 'name email');

    if (!training) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }

    return res.status(200).json({ success: true, data: training });
  } catch (error) {
    console.error('Error fetching training:', error);
    return res.status(400).json({ success: false, message: 'Failed to fetch training' });
  }
};

/**
 * @desc    Update a training
 */
const updateTraining = async (req, res, id) => {
  try {
    const session = await getSession({ req });

    // Check if user is authenticated and is admin/instructor
    if (!session || !['admin', 'instructor'].includes(session.user.role)) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const training = await Training.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email');

    if (!training) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Training updated successfully',
      data: training
    });
  } catch (error) {
    console.error('Error updating training:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update training'
    });
  }
};

/**
 * @desc    Delete a training
 */
const deleteTraining = async (req, res, id) => {
  try {
    const session = await getSession({ req });

    // Check if user is authenticated and is admin
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const training = await Training.findByIdAndDelete(id);

    if (!training) {
      return res.status(404).json({ success: false, message: 'Training not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Training deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting training:', error);
    return res.status(400).json({ success: false, message: 'Failed to delete training' });
  }
};