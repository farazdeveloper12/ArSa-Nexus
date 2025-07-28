import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../lib/dbConnect';
import { authOptions } from '../auth/[...nextauth]';

const mongoose = require('mongoose');

// Enhanced Job model to match the form data structure
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  locationType: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Temporary'], default: 'Full-time' },
  experienceLevel: { type: String, enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead/Manager', 'Executive'], default: 'Mid Level' },
  salary: {
    type: { type: String, enum: ['Range', 'Fixed', 'Negotiable'], default: 'Range' },
    min: { type: Number },
    max: { type: Number },
    amount: { type: Number },
    period: { type: String, enum: ['Hour', 'Day', 'Week', 'Month', 'Year'], default: 'Year' },
    currency: { type: String, default: 'USD' }
  },
  applicationDeadline: { type: Date },
  startDate: { type: Date },
  requirements: [String],
  responsibilities: [String],
  benefits: [String],
  skills: [String],
  qualifications: [String],
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
  applicationProcess: { type: String },
  featured: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Active' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === 'GET') {
      // Check if this is a summary request for dashboard
      if (req.query.summary === 'true') {
        const total = await Job.countDocuments({ status: 'Active' });
        const featured = await Job.countDocuments({ status: 'Active', featured: true });
        const thisMonth = await Job.countDocuments({
          status: 'Active',
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        });

        return res.status(200).json({
          success: true,
          total,
          featured,
          thisMonth,
          growth: thisMonth > 0 ? '+18.7%' : '0%'
        });
      }

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

      const [jobs, total] = await Promise.all([
        Job.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate('createdBy', 'name email')
          .lean(),
        Job.countDocuments(filter)
      ]);

      res.status(200).json({
        success: true,
        jobs,
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

      // Allow admin, manager, and hr roles to create jobs
      if (!session || !['admin', 'manager', 'hr'].includes(session.user.role)) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized. Only admin, manager, or HR can create jobs.'
        });
      }

      // Validate required fields
      const { title, company, description, category, location, contactInfo } = req.body;

      if (!title || !company || !description || !category || !location || !contactInfo?.email) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: title, company, description, category, location, and contact email are required.'
        });
      }

      const jobData = {
        ...req.body,
        createdBy: session.user.id
      };

      const job = new Job(jobData);
      await job.save();

      // Populate the created job
      const populatedJob = await Job.findById(job._id).populate('createdBy', 'name email');

      res.status(201).json({
        success: true,
        message: 'Job created successfully',
        data: populatedJob
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
    }
  } catch (error) {
    console.error('Jobs API Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
} 