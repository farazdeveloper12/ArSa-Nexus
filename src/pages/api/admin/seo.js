import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import mongoose from 'mongoose';

// SEO Settings Schema
const SEOSettingsSchema = new mongoose.Schema({
  meta: {
    title: { type: String, default: 'Arsa Nexus LLC - Professional Training and Development' },
    description: { type: String, default: 'Professional training and development services to enhance your skills and advance your career.' },
    keywords: { type: String, default: 'training, development, AI, programming, skills, education, career' },
    author: { type: String, default: 'Arsa Nexus LLC' },
    ogImage: { type: String, default: '' },
    twitterCard: { type: String, default: 'summary_large_image' }
  },
  analytics: {
    googleAnalyticsId: { type: String, default: '' },
    googleTagManagerId: { type: String, default: '' },
    facebookPixelId: { type: String, default: '' },
    linkedInInsightTag: { type: String, default: '' },
    hotjarId: { type: String, default: '' }
  },
  sitemap: {
    enabled: { type: Boolean, default: true },
    lastGenerated: { type: Date, default: Date.now }
  },
  robots: {
    allowAll: { type: Boolean, default: true },
    customRules: { type: String, default: '' }
  },
  schema: {
    organizationName: { type: String, default: 'Arsa Nexus LLC' },
    organizationType: { type: String, default: 'EducationalOrganization' },
    website: { type: String, default: 'https://arsanexus.com' },
    logo: { type: String, default: '' },
    socialProfiles: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' }
    }
  },
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const SEOSettings = mongoose.models.SEOSettings || mongoose.model('SEOSettings', SEOSettingsSchema);

export default async function handler(req, res) {
  await dbConnect();

  try {
    const session = await getServerSession(req, res, authOptions);

    // Check authorization
    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Only admin or manager can manage SEO settings.'
      });
    }

    if (req.method === 'GET') {
      // Get SEO settings
      let settings = await SEOSettings.findOne().populate('updatedBy', 'name email');

      if (!settings) {
        // Create default settings if none exist
        settings = new SEOSettings({ updatedBy: session.user.id });
        await settings.save();
      }

      res.status(200).json({
        success: true,
        settings
      });

    } else if (req.method === 'POST') {
      const seoData = req.body;

      // Update or create SEO settings
      const settings = await SEOSettings.findOneAndUpdate(
        {},
        {
          ...seoData,
          lastUpdated: new Date(),
          updatedBy: session.user.id
        },
        { upsert: true, new: true, runValidators: true }
      ).populate('updatedBy', 'name email');

      res.status(200).json({
        success: true,
        message: 'SEO settings saved successfully',
        settings
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
    }

  } catch (error) {
    console.error('SEO settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
} 