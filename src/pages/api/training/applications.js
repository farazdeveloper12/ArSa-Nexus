import dbConnect from '../../../lib/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

// In-memory storage for applications (in production, use a database)
const applications = [];

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'POST':
      return createApplication(req, res);
    case 'GET':
      return getApplications(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Create new training application
 */
const createApplication = async (req, res) => {
  try {
    const {
      trainingId,
      trainingTitle,
      fullName,
      email,
      phone,
      education,
      experience,
      motivation,
      preferredSchedule,
      paymentMethod
    } = req.body;

    // Validation
    if (!trainingId || !trainingTitle || !fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Training ID, title, full name, email, and phone are required'
      });
    }

    // Create application record
    const application = {
      id: Date.now().toString(), // Simple ID generation
      trainingId,
      trainingTitle,
      fullName,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      education: education || '',
      experience: experience || '',
      motivation: motivation || '',
      preferredSchedule: preferredSchedule || '',
      paymentMethod: paymentMethod || 'whatsapp',
      status: 'pending',
      appliedAt: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store in memory (in production, save to database)
    applications.push(application);

    console.log('📝 New training application received:', {
      id: application.id,
      training: trainingTitle,
      applicant: fullName,
      email: email,
      phone: phone
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: application.id,
        trainingTitle: application.trainingTitle,
        applicantName: application.fullName,
        status: application.status,
        appliedAt: application.appliedAt
      }
    });
  } catch (error) {
    console.error('❌ Error creating application:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to submit application'
    });
  }
};

/**
 * @desc    Get all training applications (admin only)
 */
const getApplications = async (req, res) => {
  try {
    // Check authentication for admin access
    const session = await getServerSession(req, res, authOptions);

    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Admin access required.'
      });
    }

    const { trainingId, format = 'json' } = req.query;

    // Filter applications by training if specified
    let filteredApplications = applications;
    if (trainingId) {
      filteredApplications = applications.filter(app => app.trainingId === trainingId);
    }

    // Sort by most recent first
    filteredApplications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    if (format === 'csv') {
      // Return CSV format for Excel export
      const csvHeaders = [
        'ID',
        'Training Title',
        'Full Name',
        'Email',
        'Phone',
        'Education',
        'Experience',
        'Motivation',
        'Preferred Schedule',
        'Payment Method',
        'Status',
        'Applied At'
      ];

      const csvRows = filteredApplications.map(app => [
        app.id,
        `"${app.trainingTitle}"`,
        `"${app.fullName}"`,
        app.email,
        app.phone,
        `"${app.education}"`,
        `"${app.experience}"`,
        `"${app.motivation}"`,
        app.preferredSchedule,
        app.paymentMethod,
        app.status,
        app.appliedAt
      ]);

      const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=training-applications.csv');
      return res.status(200).send(csvContent);
    }

    return res.status(200).json({
      success: true,
      data: {
        applications: filteredApplications,
        total: filteredApplications.length,
        summary: {
          pending: filteredApplications.filter(app => app.status === 'pending').length,
          approved: filteredApplications.filter(app => app.status === 'approved').length,
          rejected: filteredApplications.filter(app => app.status === 'rejected').length,
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to fetch applications'
    });
  }
}; 