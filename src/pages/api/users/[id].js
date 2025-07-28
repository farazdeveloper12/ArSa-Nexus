import { getSession } from 'next-auth/react';
import { hash } from 'bcryptjs';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

/**
 * @desc    Handle single user - Get, update, or delete user by ID
 * @route   GET /api/users/:id
 * @route   PUT /api/users/:id
 * @route   PATCH /api/users/:id
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export default async function handler(req, res) {
  const session = await getSession({ req });

  // Check if user is authenticated and is an admin
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  // Get user ID from the URL
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  // Connect to database
  await dbConnect();

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getUser(req, res, id);
    case 'PUT':
    case 'PATCH':
      return updateUser(req, res, id);
    case 'DELETE':
      return deleteUser(req, res, id);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get a single user by ID
 */
const getUser = async (req, res, id) => {
  try {
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(400).json({ success: false, message: 'Failed to fetch user' });
  }
};

/**
 * @desc    Update a user
 */
const updateUser = async (req, res, id) => {
  try {
    const { name, email, role, active, password } = req.body;

    const updateData = { updatedAt: new Date() };
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (role) updateData.role = role;
    if (typeof active === 'boolean') updateData.active = active;

    // If password is being updated
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Check if email is taken by another user
    if (email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id }
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update user'
    });
  }
};

/**
 * @desc    Delete a user
 */
const deleteUser = async (req, res, id) => {
  try {
    const session = await getSession({ req });

    // Prevent deleting the current user
    if (id === session.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(400).json({ success: false, message: 'Failed to delete user' });
  }
};