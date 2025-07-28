import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import BlogPost from '../../../models/BlogPost';
import slugify from '../../../lib/slugify';

/**
 * @desc    Handle blog posts - Get all posts or create a new post
 * @route   GET /api/blog
 * @route   POST /api/blog
 * @access  Public for GET, Private/Admin or Manager for POST
 */
export default async function handler(req, res) {
  // Connect to database
  await dbConnect();

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getBlogPosts(req, res);
    case 'POST':
      const session = await getServerSession(req, res, authOptions);

      // Check if user is authenticated and has appropriate role
      if (!session || !['admin', 'manager', 'editor'].includes(session.user.role)) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized. Only admin, manager, or editor can create blog posts.'
        });
      }

      return createBlogPost(req, res, session.user.id);
    default:
      return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}

/**
 * @desc    Get all blog posts with pagination, filtering, and sorting
 */
const getBlogPosts = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const tag = req.query.tag || '';
    const status = req.query.status || 'published';
    const sortField = req.query.sortField || 'publishedAt';
    const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // By default, only show published posts for public access
    // Admin can see all posts with specific status filter
    if (req.query.status) {
      filter.status = status;
    } else {
      filter.status = 'published';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    // Build sort object
    const sort = {};
    sort[sortField] = sortDirection;

    // Execute query with pagination and populate related fields
    const posts = await BlogPost.find(filter)
      .populate('author', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await BlogPost.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      posts,
      page,
      limit,
      totalPages,
      total,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Create a new blog post
 */
const createBlogPost = async (req, res, userId) => {
  try {
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      status,
      seo,
    } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    // Generate slug from title
    const slug = slugify(title);

    // Check if post with the same slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return res.status(409).json({ success: false, message: 'A post with this title already exists' });
    }

    // Create post
    const post = await BlogPost.create({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + (content.length > 200 ? '...' : ''),
      author: userId,
      category: category || null,
      tags: tags || [],
      featuredImage: featuredImage || null,
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : null,
      seo: seo || {
        metaTitle: title,
        metaDescription: excerpt || content.substring(0, 160),
        keywords: tags || [],
      },
      createdAt: new Date(),
    });

    // Return the created post with populated fields
    const createdPost = await BlogPost.findById(post._id)
      .populate('author', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      post: createdPost,
    });
  } catch (error) {
    console.error('Error creating blog post:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    return res.status(500).json({ success: false, message: 'Server error' });
  }
};