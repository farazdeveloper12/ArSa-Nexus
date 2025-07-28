import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import dbConnect from '../../../../lib/dbConnect';

const mongoose = require('mongoose');

// Team Member Schema
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
  await dbConnect();

  try {
    if (req.method === 'GET') {
      const {
        status = 'active',
        featured,
        department,
        limit = 50
      } = req.query;

      let filter = {};
      if (status) filter.status = status;
      if (featured) filter.isFeatured = featured === 'true';
      if (department) filter.department = department;

      const teamMembers = await TeamMember.find(filter)
        .sort({ displayOrder: 1, createdAt: -1 })
        .limit(parseInt(limit))
        .populate('createdBy', 'name')
        .lean();

      res.status(200).json({
        success: true,
        data: teamMembers
      });

    } else if (req.method === 'POST') {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const teamMemberData = {
        ...req.body,
        createdBy: session.user.id
      };

      const teamMember = new TeamMember(teamMemberData);
      await teamMember.save();

      const populatedMember = await TeamMember.findById(teamMember._id)
        .populate('createdBy', 'name');

      res.status(201).json({
        success: true,
        data: populatedMember
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Team API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 