import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../lib/dbConnect';
import { authOptions } from '../auth/[...nextauth]';

const mongoose = require('mongoose');

// Job model
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  department: { type: String },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
  level: { type: String, enum: ['Entry', 'Mid', 'Senior', 'Lead'], default: 'Entry' },
  requirements: [String],
  responsibilities: [String],
  status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Active' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  location: { type: String },
  isRemote: { type: Boolean, default: false },
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'USD' }
  },
  applicationDeadline: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  try {
    if (req.method === 'GET') {
      const job = await Job.findById(id)
        .populate('createdBy', 'name')
        .lean();

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.status(200).json({ job });

    } else if (req.method === 'PUT') {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const job = await Job.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).populate('createdBy', 'name');

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.status(200).json({ job });

    } else if (req.method === 'DELETE') {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const job = await Job.findByIdAndDelete(id);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Job deleted successfully'
      });

    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Job API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 