import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../lib/dbConnect';
import { authOptions } from '../auth/[...nextauth]';

const mongoose = require('mongoose');

// Internship model
const InternshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  department: { type: String },
  duration: { type: String },
  requirements: [String],
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  selectedInterns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startDate: { type: Date },
  endDate: { type: Date },
  location: { type: String },
  isRemote: { type: Boolean, default: false },
  stipend: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Internship = mongoose.models.Internship || mongoose.model('Internship', InternshipSchema);

export default async function handler(req, res) {
  const { id } = req.query;

  await dbConnect();

  try {
    if (req.method === 'GET') {
      const internship = await Internship.findById(id)
        .populate('createdBy', 'name')
        .lean();

      if (!internship) {
        return res.status(404).json({ error: 'Internship not found' });
      }

      res.status(200).json({ internship });

    } else if (req.method === 'PUT') {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const internship = await Internship.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      ).populate('createdBy', 'name');

      if (!internship) {
        return res.status(404).json({ error: 'Internship not found' });
      }

      res.status(200).json({ internship });

    } else if (req.method === 'DELETE') {
      const session = await getServerSession(req, res, authOptions);

      if (!session || session.user.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const internship = await Internship.findByIdAndDelete(id);

      if (!internship) {
        return res.status(404).json({ error: 'Internship not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Internship deleted successfully'
      });

    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Internship API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 