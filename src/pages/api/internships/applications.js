import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import InternshipApplication from '../../../models/InternshipApplication';
import Internship from '../../../models/Internship';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      return getInternshipApplications(req, res);
    case 'POST':
      return createInternshipApplication(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

const getInternshipApplications = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    // Only authenticated admin users can view applications
    if (!session || !['admin', 'manager', 'hr'].includes(session.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      page = 1,
      limit = 10,
      internshipId = '',
      status = '',
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    if (internshipId) query.internshipId = internshipId;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const applications = await InternshipApplication.find(query)
      .populate('internshipId', 'title company location applicationDeadline status')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await InternshipApplication.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    // Get status counts
    const statusCounts = await InternshipApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          current: pageNum,
          totalPages,
          total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        },
        statusCounts
      }
    });
  } catch (error) {
    console.error('Error fetching internship applications:', error);
    return res.status(400).json({ success: false, message: 'Failed to fetch applications' });
  }
};

const createInternshipApplication = async (req, res) => {
  try {
    const {
      internshipId,
      firstName,
      lastName,
      email,
      phone,
      coverLetter,
      currentPosition,
      company,
      experience,
      skills,
      education,
      availability,
      portfolio,
      linkedinProfile,
      githubProfile,
      references,
      motivation
    } = req.body;

    // Validate required fields
    if (!internshipId || !firstName || !lastName || !email || !phone || !coverLetter) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: internshipId, firstName, lastName, email, phone, coverLetter'
      });
    }

    // Check if internship exists and is active
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    if (internship.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This internship is no longer accepting applications'
      });
    }

    if (new Date() > new Date(internship.applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if user has already applied
    const existingApplication = await InternshipApplication.findOne({
      internshipId,
      email: email.toLowerCase()
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this internship'
      });
    }

    // Create application
    const applicationData = {
      internshipId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      coverLetter,
      currentPosition,
      company,
      experience,
      skills: skills || [],
      education: education || {},
      availability: availability || {},
      portfolio: portfolio || {},
      linkedinProfile,
      githubProfile,
      references: references || [],
      motivation,
      source: 'Website',
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    const application = await InternshipApplication.create(applicationData);

    // Update internship application count
    await Internship.findByIdAndUpdate(
      internshipId,
      { $inc: { applicationCount: 1 } }
    );

    const populatedApplication = await InternshipApplication.findById(application._id)
      .populate('internshipId', 'title company location');

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: populatedApplication
    });
  } catch (error) {
    console.error('Error creating internship application:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit application'
    });
  }
}; 