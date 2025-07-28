import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req, res) {
  try {
    await dbConnect();
    const userCount = await User.countDocuments();
    res.status(200).json({ success: true, message: `Connected! Users in DB: ${userCount}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
