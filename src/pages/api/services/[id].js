import dbConnect from '../../../lib/dbConnect';
import Service from '../../../models/Service';

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const service = await Service.findById(id);
        if (!service) {
          return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.status(200).json({ success: true, data: service });
      } catch (error) {
        console.error('Error fetching service:', error);
        res.status(400).json({ success: false, message: 'Failed to fetch service' });
      }
      break;

    case 'PUT':
      try {
        const updateData = { ...req.body, updatedAt: new Date() };
        
        const service = await Service.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true
        });

        if (!service) {
          return res.status(404).json({ success: false, message: 'Service not found' });
        }

        res.status(200).json({ 
          success: true, 
          message: 'Service updated successfully',
          data: service 
        });
      } catch (error) {
        console.error('Error updating service:', error);
        res.status(400).json({ 
          success: false, 
          message: error.message || 'Failed to update service' 
        });
      }
      break;

    case 'DELETE':
      try {
        const service = await Service.findByIdAndDelete(id);
        if (!service) {
          return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.status(200).json({ 
          success: true, 
          message: 'Service deleted successfully' 
        });
      } catch (error) {
        console.error('Error deleting service:', error);
        res.status(400).json({ success: false, message: 'Failed to delete service' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
} 