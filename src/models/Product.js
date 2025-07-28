import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: ['Software', 'Course', 'Service', 'Consultation', 'Template', 'Tool', 'eBook', 'Other'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    default: null,
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
    isPrimary: {
      type: Boolean,
      default: false,
    }
  }],
  features: [{
    type: String,
  }],
  specifications: [{
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    }
  }],
  tags: [{
    type: String,
  }],
  inventory: {
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    trackInventory: {
      type: Boolean,
      default: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
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
    enum: ['draft', 'active', 'inactive', 'discontinued'],
    default: 'draft',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isDigital: {
    type: Boolean,
    default: true,
  },
  downloadUrl: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  salesCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  collection: 'products'
});

ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ salesCount: -1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);