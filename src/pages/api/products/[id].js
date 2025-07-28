import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/dbConnect';
import Product from '../../../models/Product';

/**
 * @desc    Handle single product - Get, update, or delete product by ID
 * @route   GET /api/products/:id
 * @route   PUT /api/products/:id
 * @route   PATCH /api/products/:id
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export default async function handler(req, res) {
  const session = await getSession({ req });

  // Check if user is authenticated and has appropriate role
  if (!session || !['admin', 'manager', 'editor'].includes(session.user.role)) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  // Get product ID from the URL
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Product ID is required' });
  }

  // Connect to database
  await dbConnect();

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getProduct(req, res, id);
    case 'PUT':
    case 'PATCH':
      return updateProduct(req, res, id);
    case 'DELETE':
      return deleteProduct(req, res, id);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get a single product by ID
 */
const getProduct = async (req, res, id) => {
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, product: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(400).json({ success: false, message: 'Failed to fetch product' });
  }
};

/**
 * @desc    Update a product
 */
const updateProduct = async (req, res, id) => {
  try {
    const {
      name,
      description,
      category,
      type,
      pricing,
      features,
      specifications,
      media,
      availability,
      tags,
      metadata,
      seo,
      featured,
      bestseller,
      status
    } = req.body;

    const updateData = {
      updatedAt: new Date(),
      updatedBy: req.session?.user?.id
    };

    // Update fields if provided
    if (name) updateData.name = name.trim();
    if (description) updateData.description = description.trim();
    if (category) updateData.category = category;
    if (type) updateData.type = type;
    if (pricing) updateData.pricing = pricing;
    if (features) updateData.features = features;
    if (specifications) updateData.specifications = specifications;
    if (media) updateData.media = media;
    if (availability) updateData.availability = availability;
    if (tags) updateData.tags = tags;
    if (metadata) updateData.metadata = metadata;
    if (seo) updateData.seo = seo;
    if (typeof featured === 'boolean') updateData.featured = featured;
    if (typeof bestseller === 'boolean') updateData.bestseller = bestseller;
    if (status) updateData.status = status;

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product'
    });
  }
};

/**
 * @desc    Delete a product
 */
const deleteProduct = async (req, res, id) => {
  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(400).json({ success: false, message: 'Failed to delete product' });
  }
}; 