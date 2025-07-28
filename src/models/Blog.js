import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Business', 'Education', 'Career', 'Digital Marketing', 'Web Development', 'AI & ML', 'News', 'Tutorial', 'Case Study'],
  },
  tags: [{
    type: String,
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  featuredImage: {
    url: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    }
  },
  seo: {
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    keywords: [{
      type: String,
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  readTime: {
    type: Number,
    default: 0, // in minutes
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  shareCount: {
    type: Number,
    default: 0,
  },
  allowComments: {
    type: Boolean,
    default: true,
  },
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
  }],
}, {
  timestamps: true,
  collection: 'blogs'
});

// Indexes
BlogSchema.index({ title: 1 });
BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ status: 1 });
BlogSchema.index({ isFeatured: 1 });
BlogSchema.index({ publishedAt: -1 });
BlogSchema.index({ viewCount: -1 });

// Pre-save middleware to generate slug
BlogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Set published date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Calculate read time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }

  next();
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema); 