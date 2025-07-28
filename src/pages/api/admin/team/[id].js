import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import dbConnect from '../../../../lib/dbConnect';

const mongoose = require('mongoose');

// Team Member Schema (same as in index.js)
const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  expertise: [{ type: String }],
  experience: { type: String, required: true },
  education: { type: String },
  achievements: [{ type: String }],
  isCEO: { type: Boolean, default: false },
  isFounder: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  joinDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  displayOrder: { type: Number, default: 0 },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    github: { type: String },
    website: { type: String }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  try {
    if (req.method === 'GET') {
      const teamMember = await TeamMember.findById(id)
        .populate('createdBy', 'name')
        .lean();

      if (!teamMember) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      res.status(200).json({
        success: true,
        data: teamMember
      });

    } else if (req.method === 'PUT') {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const teamMember = await TeamMember.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).populate('createdBy', 'name');

      if (!teamMember) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      res.status(200).json({
        success: true,
        data: teamMember
      });

    } else if (req.method === 'DELETE') {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const teamMember = await TeamMember.findByIdAndDelete(id);

      if (!teamMember) {
        return res.status(404).json({ error: 'Team member not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Team member deleted successfully'
      });

    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Team Member API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 