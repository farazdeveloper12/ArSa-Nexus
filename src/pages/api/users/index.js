import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../lib/dbConnect';
import { authOptions } from '../auth/[...nextauth]';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === 'GET') {
      const session = await getServerSession(req, res, authOptions);

      // Enhanced debugging for production
      console.log('🔍 Users API - Session check:', {
        hasSession: !!session,
        userRole: session?.user?.role,
        userEmail: session?.user?.email,
        timestamp: new Date().toISOString()
      });

      // Check if this is a summary request for dashboard
      if (req.query.summary === 'true') {
        if (!session) {
          console.log('❌ No session found for summary request');
          return res.status(401).json({
            success: false,
            message: 'No session found - please login'
          });
        }

        if (!['admin', 'manager'].includes(session.user?.role)) {
          console.log('❌ Insufficient role for summary request:', session.user?.role);
          return res.status(401).json({
            success: false,
            message: 'Insufficient permissions'
          });
        }

        console.log('✅ Authorized summary request for:', session.user.email);

        const total = await User.countDocuments();
        const active = await User.countDocuments({ active: { $ne: false } });
        const newThisMonth = await User.countDocuments({
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        });

        return res.status(200).json({
          success: true,
          total,
          active,
          newThisMonth,
          growth: newThisMonth > 0 ? '+12.5%' : '0%'
        });
      }

      // Regular user listing
      if (!session) {
        console.log('❌ No session found for user listing');
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!['admin', 'manager', 'hr'].includes(session.user?.role)) {
        console.log('❌ Insufficient role for user listing:', session.user?.role);
        return res.status(401).json({
          success: false,
          message: 'Unauthorized access'
        });
      }

      const {
        page = 1,
        limit = 10,
        search = '',
        role = '',
        status = ''
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build filter
      let filter = {};
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      if (role) {
        filter.role = role;
      }
      if (status) {
        filter.status = status;
      }

      const [users, total] = await Promise.all([
        User.find(filter, '-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        User.countDocuments(filter)
      ]);

      res.status(200).json({
        success: true,
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          hasNext: skip + parseInt(limit) < total,
          hasPrev: parseInt(page) > 1
        }
      });

    } else if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);

      if (!session || !['admin', 'manager', 'hr'].includes(session.user.role)) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { name, email, password, confirmPassword, role, active } = req.body;

      // Validation
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Name and email are required'
        });
      }

      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Password is required'
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Passwords do not match'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role || 'user',
        active: active !== undefined ? active : true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await user.save();

      // Return user without password
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: userResponse
      });

    } else if (req.method === 'PUT') {
      const session = await getServerSession(req, res, authOptions);

      if (!session || !['admin', 'manager', 'hr'].includes(session.user.role)) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { id, name, email, role, active, password } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      // Validation
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: 'Name and email are required'
        });
      }

      // Check if user exists
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if email is already taken by another user
      const emailCheck = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: id }
      });

      if (emailCheck) {
        return res.status(409).json({
          success: false,
          message: 'Email already taken by another user'
        });
      }

      // Prepare update data
      const updateData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: role || existingUser.role,
        active: active !== undefined ? active : existingUser.active,
        updatedAt: new Date()
      };

      // Hash new password if provided
      if (password && password.trim()) {
        if (password.length < 6) {
          return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
          });
        }
        updateData.password = await bcrypt.hash(password, 12);
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, select: '-password' }
      );

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user: updatedUser
      });

    } else if (req.method === 'DELETE') {
      const session = await getServerSession(req, res, authOptions);

      if (!session || !['admin', 'manager'].includes(session.user.role)) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - Admin or Manager role required'
        });
      }

      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent deleting own account
      if (user._id.toString() === session.user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      // Prevent deleting admin accounts (additional safety)
      if (user.role === 'admin' && session.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Cannot delete admin accounts'
        });
      }

      // Delete user
      await User.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });

    } else if (req.method === 'PATCH') {
      const session = await getServerSession(req, res, authOptions);

      if (!session || !['admin', 'manager', 'hr'].includes(session.user.role)) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const { id, field, value } = req.body;

      if (!id || !field) {
        return res.status(400).json({
          success: false,
          message: 'User ID and field are required'
        });
      }

      // Allowed fields for patching
      const allowedFields = ['active', 'role', 'name', 'email'];
      if (!allowedFields.includes(field)) {
        return res.status(400).json({
          success: false,
          message: `Field '${field}' is not allowed for updates`
        });
      }

      // Check if user exists
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prepare update data
      const updateData = {
        [field]: value,
        updatedAt: new Date()
      };

      // Additional validation for email
      if (field === 'email') {
        const emailCheck = await User.findOne({
          email: value.toLowerCase().trim(),
          _id: { $ne: id }
        });

        if (emailCheck) {
          return res.status(409).json({
            success: false,
            message: 'Email already taken by another user'
          });
        }
        updateData.email = value.toLowerCase().trim();
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, select: '-password' }
      );

      res.status(200).json({
        success: true,
        message: `User ${field} updated successfully`,
        user: updatedUser
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
    }
  } catch (error) {
    console.error('❌ Users API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}
