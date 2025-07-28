import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import JobApplication from '../../../models/JobApplication';
import Job from '../../../models/Job';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      return createJobApplication(req, res);
    case 'GET':
      return getJobApplications(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

const createJobApplication = async (req, res) => {
  try {
    const {
      jobId,
      jobTitle,
      company,
      fullName,
      email,
      phone,
      experience,
      education,
      portfolio,
      coverLetter,
      expectedSalary,
      availableStartDate,
      contactMethod = 'email'
    } = req.body;

    // Validate required fields
    if (!jobId || !jobTitle || !company || !fullName || !email || !phone || !experience || !coverLetter) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if job exists and is still active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check for duplicate applications (same email for same job)
    const existingApplication = await JobApplication.findOne({
      jobId: jobId,
      email: email
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Create the application
    const applicationData = {
      jobId,
      jobTitle,
      company,
      applicantInfo: {
        fullName,
        email,
        phone,
        experience,
        education,
        portfolio,
        expectedSalary,
        availableStartDate
      },
      coverLetter,
      contactMethod,
      status: 'Submitted',
      submittedAt: new Date()
    };

    const application = await JobApplication.create(applicationData);

    // Increment application count for the job
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationCount: 1 }
    });

    return res.status(201).json({
      success: true,
      message: 'Job application submitted successfully',
      data: {
        applicationId: application._id,
        jobTitle: application.jobTitle,
        company: application.company,
        submittedAt: application.submittedAt
      }
    });

  } catch (error) {
    console.error('Error creating job application:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit job application'
    });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated and has appropriate role
    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const allowedRoles = ['admin', 'manager', 'hr'];
    if (!allowedRoles.includes(session.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      page = 1,
      limit = 10,
      jobId = '',
      status = '',
      search = '',
      export: exportData = false
    } = req.query;

    const query = {};

    if (jobId) {
      query.jobId = jobId;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { 'applicantInfo.fullName': { $regex: search, $options: 'i' } },
        { 'applicantInfo.email': { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    if (exportData === 'true') {
      // Return all applications for export (CSV)
      const applications = await JobApplication.find(query)
        .populate('jobId', 'title company category location')
        .sort({ submittedAt: -1 });

      return res.status(200).json({
        success: true,
        data: applications,
        export: true
      });
    }

    // Paginated results
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const applications = await JobApplication.find(query)
      .populate('jobId', 'title company category location')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await JobApplication.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    // Get application statistics
    const stats = await JobApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
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
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Error fetching job applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch job applications'
    });
  }
}; 