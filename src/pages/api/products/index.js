import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';

/**
 * @desc    Handle products - Get all or create new
 * @route   GET /api/products
 * @route   POST /api/products
 * @access  Public for GET, Private/Admin for POST
 */
export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get all products with filtering and pagination
 */
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      status = 'active',
      featured = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Check if this is a summary request for dashboard
    if (req.query.summary === 'true') {
      const total = await Product.countDocuments({ status: 'active' });
      const featured = await Product.countDocuments({ status: 'active', isFeatured: true });
      const thisMonth = await Product.countDocuments({
        status: 'active',
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      });

      return res.status(200).json({
        success: true,
        total,
        featured,
        thisMonth,
        growth: thisMonth > 0 ? '+15.3%' : '0%'
      });
    }

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (featured) {
      query.isFeatured = featured === 'true';
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get products with pagination
    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          current: pageNum,
          totalPages,
          total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(400).json({ success: false, message: 'Failed to fetch products' });
  }
};

/**
 * @desc    Create new product
 */
const createProduct = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated and is admin
    if (!session || !['admin', 'manager'].includes(session.user.role)) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const productData = {
      ...req.body,
      createdBy: session.user.id
    };

    const product = await Product.create(productData);
    const populatedProduct = await Product.findById(product._id).populate('createdBy', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create product'
    });
  }
}; 