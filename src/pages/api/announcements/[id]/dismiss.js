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

    // Increment dismissal count
    announcement.analytics.dismissals += 1;
    await announcement.save();

    return res.status(200).json({
      success: true,
      message: 'Dismissal tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking dismissal:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
} 