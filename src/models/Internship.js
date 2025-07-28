import mongoose from 'mongoose';

const InternshipSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Internship title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  locationType: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
    required: [true, 'Location type is required']
  },

  // Internship Details
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  responsibilities: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  qualifications: [{
    type: String,
    trim: true
  }],

  // Categories and Classification
  category: {
    type: String,
    enum: [
      'Web Development',
      'Mobile Development',
      'AI & Machine Learning',
      'Data Science',
      'Digital Marketing',
      'UI/UX Design',
      'Cloud Computing',
      'Cybersecurity',
      'Business Development',
      'Content Creation',
      'Project Management',
      'Sales & Marketing',
      'Human Resources',
      'Finance & Accounting',
      'Operations',
      'Other'
    ],
    required: [true, 'Category is required']
  },
  level: {
    type: String,
    enum: ['Entry Level', 'Intermediate', 'Advanced'],
    default: 'Entry Level'
  },

  // Duration and Timing
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  startDate: {
    type: Date,
    required: false
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },

  // Compensation
  stipend: {
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['Monthly', 'Weekly', 'Total', 'Unpaid'],
      default: 'Monthly'
    }
  },

  // Skills and Experience
  skillsRequired: [{
    type: String,
    trim: true
  }],
  experienceRequired: {
    type: String,
    enum: ['No Experience', '0-1 years', '1-2 years', '2+ years'],
    default: 'No Experience'
  },

  // Company Information
  companyInfo: {
    logo: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    industry: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Company description cannot exceed 500 characters']
    }
  },

  // Application Information
  applicationCount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxApplications: {
    type: Number,
    min: 1
  },

  // Status and Visibility
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Paused', 'Closed', 'Filled'],
    default: 'Active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  },

  // Contact Information
  contactInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    contactPerson: {
      type: String,
      trim: true
    }
  },

  // Benefits and Perks
  benefits: [{
    type: String,
    trim: true
  }],

  // SEO and Search
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  // Tracking and Analytics
  views: {
    type: Number,
    default: 0,
    min: 0
  },

  // Creation and Updates
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
InternshipSchema.index({ title: 'text', description: 'text', company: 'text' });
InternshipSchema.index({ category: 1, status: 1 });
InternshipSchema.index({ applicationDeadline: 1 });
InternshipSchema.index({ startDate: 1 });
InternshipSchema.index({ featured: -1, createdAt: -1 });
InternshipSchema.index({ location: 1, locationType: 1 });

// Virtual for days remaining to apply
InternshipSchema.virtual('daysToApply').get(function () {
  if (!this.applicationDeadline) return null;
  const today = new Date();
  const deadline = new Date(this.applicationDeadline);
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for application status
InternshipSchema.virtual('canApply').get(function () {
  const now = new Date();
  const deadlinePassed = this.applicationDeadline && new Date(this.applicationDeadline) < now;
  const maxReached = this.maxApplications && this.applicationCount >= this.maxApplications;
  return this.status === 'Active' && !deadlinePassed && !maxReached;
});

// Pre-save middleware
InternshipSchema.pre('save', function (next) {
  // Auto-close if deadline passed
  if (this.applicationDeadline && new Date(this.applicationDeadline) < new Date()) {
    if (this.status === 'Active') {
      this.status = 'Closed';
    }
  }

  // Auto-close if max applications reached
  if (this.maxApplications && this.applicationCount >= this.maxApplications) {
    if (this.status === 'Active') {
      this.status = 'Filled';
    }
  }

  next();
});

// Static method to get active internships
InternshipSchema.statics.getActive = function () {
  return this.find({
    status: 'Active',
    applicationDeadline: { $gt: new Date() }
  }).sort({ featured: -1, createdAt: -1 });
};

// Static method to search internships
InternshipSchema.statics.search = function (query, filters = {}) {
  const searchQuery = {
    status: 'Active',
    applicationDeadline: { $gt: new Date() },
    ...filters
  };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  return this.find(searchQuery).sort({ featured: -1, score: { $meta: 'textScore' }, createdAt: -1 });
};

export default mongoose.models.Internship || mongoose.model('Internship', InternshipSchema); 