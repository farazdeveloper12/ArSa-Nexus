import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../lib/dbConnect';
import { authOptions } from '../auth/[...nextauth]';

const mongoose = require('mongoose');

// Enhanced Internship model
const InternshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  locationType: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
  requirements: [String],
  responsibilities: [String],
  skills: [String],
  qualifications: [String],
  benefits: [String],
  stipend: {
    amount: { type: Number, default: 0 },
    period: { type: String, enum: ['Month', 'Week', 'Total'], default: 'Month' },
    currency: { type: String, default: 'USD' }
  },
  applicationDeadline: { type: Date },
  startDate: { type: Date },
  endDate: { type: Date },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String },
    website: { type: String }
  },
  companyInfo: {
    name: { type: String },
    size: { type: String },
    industry: { type: String },
    description: { type: String },
    logo: { type: String },
    website: { type: String }
  },
  status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Active' },
  featured: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  selectedInterns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Internship = mongoose.models.Internship || mongoose.model('Internship', InternshipSchema);

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === 'GET') {
      const {
        page = 1,
        limit = 12,
        search = '',
        category = '',
        status = 'Active'
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build filter
      let filter = {};
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }
      if (category && category !== 'All Categories') {
        filter.category = { $regex: category, $options: 'i' };
      }
      if (status && status !== 'All Statuses') {
        filter.status = status;
      }

      const [internships, total] = await Promise.all([
        Internship.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate('createdBy', 'name email')
          .lean(),
        Internship.countDocuments(filter)
      ]);

      res.status(200).json({
        success: true,
        internships,
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

      // Allow admin, manager, and hr roles
      if (!session || !['admin', 'manager', 'hr'].includes(session.user.role)) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized. Only admin, manager, or HR can create internships.'
        });
      }

      // Validate required fields
      const { title, company, description, category, duration, location, contactInfo } = req.body;

      if (!title || !company || !description || !category || !duration || !location || !contactInfo?.email) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: title, company, description, category, duration, location, and contact email are required.'
        });
      }

      const internshipData = {
        ...req.body,
        createdBy: session.user.id
      };

      const internship = new Internship(internshipData);
      await internship.save();

      // Populate the created internship
      const populatedInternship = await Internship.findById(internship._id).populate('createdBy', 'name email');

      res.status(201).json({
        success: true,
        message: 'Internship created successfully',
        data: populatedInternship
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
    }
  } catch (error) {
    console.error('Internships API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
} 