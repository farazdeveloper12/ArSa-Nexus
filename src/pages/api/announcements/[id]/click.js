import dbConnect from '../../../../lib/dbConnect';
import Announcement from '../../../../models/Announcement';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Announcement ID is required' });
  }

  await dbConnect();

  try {
    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    // Increment click count
    announcement.analytics.clicks += 1;
    await announcement.save();

    return res.status(200).json({
      success: true,
      message: 'Click tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 