import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
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
      'Quality Assurance',
      'DevOps',
      'Product Management'
    ]
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  locationType: {
    type: String,
    required: [true, 'Location type is required'],
    enum: ['Remote', 'On-site', 'Hybrid'],
    default: 'Remote'
  },
  employmentType: {
    type: String,
    required: [true, 'Employment type is required'],
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Temporary'],
    default: 'Full-time'
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead/Manager', 'Executive'],
    default: 'Mid Level'
  },
  salary: {
    type: {
      type: String,
      enum: ['Range', 'Fixed', 'Negotiable'],
      default: 'Negotiable'
    },
    min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative']
    },
    amount: {
      type: Number,
      min: [0, 'Salary amount cannot be negative']
    },
    period: {
      type: String,
      enum: ['Hour', 'Day', 'Week', 'Month', 'Year'],
      default: 'Year'
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
    validate: {
      validator: function (value) {
        return value > new Date();
      },
      message: 'Application deadline must be in the future'
    }
  },
  startDate: {
    type: Date
  },
  requirements: [{
    type: String,
    maxlength: [500, 'Each requirement cannot be more than 500 characters']
  }],
  responsibilities: [{
    type: String,
    maxlength: [500, 'Each responsibility cannot be more than 500 characters']
  }],
  qualifications: [{
    type: String,
    maxlength: [500, 'Each qualification cannot be more than 500 characters']
  }],
  skills: [{
    type: String,
    maxlength: [100, 'Each skill cannot be more than 100 characters']
  }],
  benefits: [{
    type: String,
    maxlength: [200, 'Each benefit cannot be more than 200 characters']
  }],
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  companyInfo: {
    name: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      trim: true
    },
    industry: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      maxlength: [1000, 'Company description cannot be more than 1000 characters']
    },
    logo: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  applicationProcess: {
    type: String,
    maxlength: [2000, 'Application process cannot be more than 2000 characters']
  },
  featured: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Draft', 'Active', 'Paused', 'Closed', 'Filled'],
    default: 'Active'
  },
  applicationCount: {
    type: Number,
    default: 0,
    min: [0, 'Application count cannot be negative']
  },
  viewCount: {
    type: Number,
    default: 0,
    min: [0, 'View count cannot be negative']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Each tag cannot be more than 50 characters']
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Virtual for application deadline status
JobSchema.virtual('isExpired').get(function () {
  return this.applicationDeadline < new Date();
});

// Virtual for days remaining
JobSchema.virtual('daysRemaining').get(function () {
  const today = new Date();
  const deadline = new Date(this.applicationDeadline);
  const diffTime = deadline - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for formatted salary
JobSchema.virtual('formattedSalary').get(function () {
  if (!this.salary || this.salary.type === 'Negotiable') {
    return 'Negotiable';
  }

  if (this.salary.type === 'Range') {
    return `$${this.salary.min || 0} - $${this.salary.max || 0}/${this.salary.period || 'Year'}`;
  }

  if (this.salary.type === 'Fixed') {
    return `$${this.salary.amount || 0}/${this.salary.period || 'Year'}`;
  }

  return 'Negotiable';
});

// Indexes for better query performance
JobSchema.index({ title: 'text', description: 'text', company: 'text' });
JobSchema.index({ category: 1, status: 1 });
JobSchema.index({ location: 1, locationType: 1 });
JobSchema.index({ employmentType: 1, experienceLevel: 1 });
JobSchema.index({ featured: -1, urgent: -1, createdAt: -1 });
JobSchema.index({ applicationDeadline: 1, status: 1 });
JobSchema.index({ 'salary.min': 1, 'salary.max': 1 });

// Middleware to update applicationCount when needed
JobSchema.pre('save', function (next) {
  if (this.isNew) {
    this.applicationCount = 0;
    this.viewCount = 0;
  }
  next();
});

// Static method to get active jobs
JobSchema.statics.getActiveJobs = function () {
  return this.find({
    status: 'Active',
    applicationDeadline: { $gt: new Date() }
  }).sort({ featured: -1, urgent: -1, createdAt: -1 });
};

// Static method to get featured jobs
JobSchema.statics.getFeaturedJobs = function (limit = 5) {
  return this.find({
    status: 'Active',
    featured: true,
    applicationDeadline: { $gt: new Date() }
  }).sort({ createdAt: -1 }).limit(limit);
};

// Instance method to increment application count
JobSchema.methods.incrementApplicationCount = function () {
  this.applicationCount += 1;
  return this.save();
};

// Instance method to increment view count
JobSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

export default mongoose.models.Job || mongoose.model('Job', JobSchema); 