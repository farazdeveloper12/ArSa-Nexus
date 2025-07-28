import dbConnect from '../../lib/dbConnect';

const mongoose = require('mongoose');

// Website content schema (matching admin API)
const WebsiteContentSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  lastUpdated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const WebsiteContent = mongoose.models.WebsiteContent || mongoose.model('WebsiteContent', WebsiteContentSchema);

export default async function handler(req, res) {
  await dbConnect();

  try {
    if (req.method === 'GET') {
      // First check global cache for instant response
      if (global.websiteContentCache) {
        return res.status(200).json({
          success: true,
          content: global.websiteContentCache,
          source: 'cache',
          timestamp: new Date().toISOString()
        });
      }

      // Fallback to database if cache is not available
      const content = await WebsiteContent.find({}).lean();
      const structuredContent = {};
      content.forEach(item => {
        structuredContent[item.section] = item.content;
      });

      // Update cache for next requests
      global.websiteContentCache = structuredContent;

      res.status(200).json({
        success: true,
        content: structuredContent,
        source: 'database',
        timestamp: new Date().toISOString()
      });

    } else if (req.method === 'POST') {
      // This endpoint is for admin updates only - cache refresh
      const { content } = req.body;

      if (content) {
        global.websiteContentCache = content;
        console.log('✅ Public content cache refreshed from admin update');

        return res.status(200).json({
          success: true,
          message: 'Public content cache updated successfully',
          timestamp: new Date().toISOString()
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Content data required'
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      });
    }

  } catch (error) {
    console.error('Public content API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
} 