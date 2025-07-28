import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Handle website settings - Get current settings or update them
 * @route   GET /api/settings
 * @route   POST /api/settings
 * @route   PUT /api/settings
 * @access  Public for GET, Private/Admin for POST/PUT
 */
export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getSettings(req, res);
    case 'POST':
    case 'PUT':
      return updateSettings(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get current website settings
 */
const getSettings = async (req, res) => {
  try {
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

    // Check if settings file exists
    if (!fs.existsSync(settingsPath)) {
      // Create default settings if file doesn't exist
      const defaultSettings = {
        siteName: "Arsa Nexus LLC",
        siteDescription: "Professional AI Education & Training Platform",
        contactEmail: "info@arsanexus.com",
        phone: "+1 (555) 123-4567",
        address: "123 Tech Street, Innovation City, IC 12345",
        socialMedia: {
          facebook: "https://facebook.com/arsanexus",
          twitter: "https://twitter.com/arsanexus",
          linkedin: "https://linkedin.com/company/arsanexus",
          instagram: "https://instagram.com/arsanexus",
          youtube: "https://youtube.com/arsanexus"
        },
        seo: {
          metaTitle: "Arsa Nexus - AI Education & Professional Training",
          metaDescription: "Transform your career with cutting-edge AI education and professional training programs. Join thousands who have advanced their careers with Arsa Nexus.",
          metaKeywords: "AI education, machine learning, professional training, career development, technology courses",
          ogImage: "/images/og-image.jpg"
        },
        features: {
          userRegistration: true,
          emailNotifications: true,
          maintenance: false,
          analytics: true,
          chatSupport: true
        },
        updatedAt: new Date().toISOString(),
        updatedBy: null
      };

      // Create data directory if it doesn't exist
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2));

      return res.status(200).json({
        success: true,
        data: defaultSettings
      });
    }

    // Read existing settings
    const settingsData = fs.readFileSync(settingsPath, 'utf8');
    const settings = JSON.parse(settingsData);

    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error reading settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to read settings'
    });
  }
};

/**
 * @desc    Update website settings
 */
const updateSettings = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated and has admin privileges
    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update settings'
      });
    }

    const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

    // Get current settings
    let currentSettings = {};
    if (fs.existsSync(settingsPath)) {
      const settingsData = fs.readFileSync(settingsPath, 'utf8');
      currentSettings = JSON.parse(settingsData);
    }

    // Merge with new settings
    const updatedSettings = {
      ...currentSettings,
      ...req.body,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.id
    };

    // Validate required fields
    const requiredFields = ['siteName', 'siteDescription', 'contactEmail'];
    for (const field of requiredFields) {
      if (!updatedSettings[field] || updatedSettings[field].trim() === '') {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedSettings.contactEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write updated settings to file
    fs.writeFileSync(settingsPath, JSON.stringify(updatedSettings, null, 2));

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error updating settings:', error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON data'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
}; 