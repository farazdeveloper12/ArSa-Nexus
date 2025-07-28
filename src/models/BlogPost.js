import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a post title'],
    maxlength: [200, 'Title cannot be more than 200 characters'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide post content'],
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot be more than 500 characters'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify an author'],
  },
  featuredImage: {
    url: String,
    alt: String,
  },
  category: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  publishedAt: {
    type: Date,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Set up pre-save hooks
BlogPostSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // If status is published and publishedAt is not set, set it
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }

  // Generate excerpt from content if not provided
  if (!this.excerpt && this.content) {
    // Remove HTML tags and limit to 200 characters
    const plainText = this.content.replace(/<[^>]*>?/gm, '');
    this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
  }

  next();
});

// Instance method to check if post is published
BlogPostSchema.methods.isPublished = function () {
  return this.status === 'published' && this.publishedAt <= new Date();
};

// Instance method to increment view count
BlogPostSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Instance method to add comment
BlogPostSchema.methods.addComment = function (userId, content) {
  this.comments.push({
    user: userId,
    content,
    createdAt: new Date(),
  });
  return this.save();
};

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);