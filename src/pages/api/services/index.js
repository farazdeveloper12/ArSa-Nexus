import dbConnect from '../../../lib/dbConnect';
import Service from '../../../models/Service';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const { page = 1, limit = 10, search = '', category = '', active } = req.query;

        // Build query
        let query = {};
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ];
        }
        if (category) {
          query.category = category;
        }
        if (active !== undefined) {
          query.isActive = active === 'true';
        }

        // Get services with pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const services = await Service.find(query)
          .sort({ order: 1, createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));

        const total = await Service.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        res.status(200).json({
          success: true,
          data: {
            services,
            pagination: {
              currentPage: parseInt(page),
              totalPages,
              totalServices: total,
              hasNext: parseInt(page) < totalPages,
              hasPrev: parseInt(page) > 1
            }
          }
        });
      } catch (error) {
        console.error('Error fetching services:', error);
        res.status(400).json({ success: false, message: 'Failed to fetch services' });
      }
      break;

    case 'POST':
      try {
        const serviceData = req.body;

        // Validation
        if (!serviceData.title || !serviceData.description) {
          return res.status(400).json({
            success: false,
            message: 'Title and description are required'
          });
        }

        // Set updatedAt
        serviceData.updatedAt = new Date();

        const service = await Service.create(serviceData);

        res.status(201).json({
          success: true,
          message: 'Service created successfully',
          data: service
        });
      } catch (error) {
        console.error('Error creating service:', error);
        res.status(400).json({
          success: false,
          message: error.message || 'Failed to create service'
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
} 