import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/dbConnect';
import BlogPost from '../../../models/BlogPost';
import slugify from '../../../lib/slugify';

/**
 * @desc    Handle single blog post - Get, update, or delete post by ID
 * @route   GET /api/blog/:id
 * @route   PUT /api/blog/:id
 * @route   PATCH /api/blog/:id
 * @route   DELETE /api/blog/:id
 * @access  Public for GET published posts, Private/Admin or Manager for the rest
 */
export default async function handler(req, res) {
  // Get post ID from the URL
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ success: false, message: 'Post ID is required' });
  }
  
  // Connect to database
  await dbConnect();
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getBlogPost(req, res, id);
    case 'PUT':
    case 'PATCH':
      const updateSession = await getSession({ req });
      
      // Check if user is authenticated and has appropriate role
      if (!updateSession || !['admin', 'manager'].includes(updateSession.user.role)) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }
      
      return updateBlogPost(req, res, id, updateSession.user.id);
    case 'DELETE':
      const deleteSession = await getSession({ req });
      
      // Check if user is authenticated and has appropriate role
      if (!deleteSession || !['admin', 'manager'].includes(deleteSession.user.role)) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }
      
      return deleteBlogPost(req, res, id);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get a single blog post by ID
 */
const getBlogPost = async (req, res, id) => {
  try {
    const post = await BlogPost.findById(id)
      .populate('author', 'name email')
      .populate('category', 'name slug');
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    // Check if the post is published or the user has admin/manager role
    const session = await getSession({ req });
    
    if (post.status !== 'published' && (!session || !['admin', 'manager'].includes(session.user.role))) {
      return res.status(403).json({ success: false, message: 'This post is not published yet' });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    return res.status(200).json({ success: true, post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update a blog post
 */
const updateBlogPost = async (req, res, id, userId) => {
  try {
    // Get the update data from request body
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      status,
      isFeatured,
      seo,
    } = req.body;
    
    // Find the post
    const post = await BlogPost.findById(id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    // Update fields if provided
    if (title && title !== post.title) {
      post.title = title;
      post.slug = slugify(title); // Update slug if title changes
    }
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (category !== undefined) post.category = category;
    if (tags) post.tags = tags;
    if (featuredImage) post.featuredImage = featuredImage;
    if (isFeatured !== undefined) post.isFeatured = isFeatured;
    if (seo) post.seo = seo;
    
    // Update status and publishedAt if status changes to published
    if (status && status !== post.status) {
      post.status = status;
      if (status === 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }
    
    // Update timestamps
    post.updatedAt = new Date();
    
    // Save the updated post
    await post.save();
    
    // Return the updated post with populated fields
    const updatedPost = await BlogPost.findById(id)
      .populate('author', 'name email')
      .populate('category', 'name slug');
    
    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete a blog post
 */
const deleteBlogPost = async (req, res, id) => {
  try {
    const post = await BlogPost.findByIdAndDelete(id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};