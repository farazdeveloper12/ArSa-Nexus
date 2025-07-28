import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job ID is required']
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  applicantInfo: {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot be more than 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      maxlength: [2000, 'Experience cannot be more than 2000 characters']
    },
    education: {
      type: String,
      maxlength: [1000, 'Education cannot be more than 1000 characters']
    },
    portfolio: {
      type: String,
      trim: true
    },
    expectedSalary: {
      type: String,
      trim: true
    },
    availableStartDate: {
      type: String,
      trim: true
    },
    resume: {
      type: String, // URL or file path
      trim: true
    },
    linkedinProfile: {
      type: String,
      trim: true
    },
    githubProfile: {
      type: String,
      trim: true
    }
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    maxlength: [3000, 'Cover letter cannot be more than 3000 characters']
  },
  contactMethod: {
    type: String,
    enum: ['email', 'whatsapp', 'phone'],
    default: 'email'
  },
  status: {
    type: String,
    enum: [
      'Submitted',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Interview Completed',
      'Offer Extended',
      'Hired',
      'Rejected',
      'Withdrawn'
    ],
    default: 'Submitted'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    content: {
      type: String,
      maxlength: [1000, 'Note cannot be more than 1000 characters']
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  interviewDetails: {
    scheduledDate: {
      type: Date
    },
    scheduledTime: {
      type: String
    },
    interviewType: {
      type: String,
      enum: ['Phone', 'Video', 'In-Person', 'Panel', 'Technical'],
      default: 'Video'
    },
    interviewLink: {
      type: String
    },
    interviewerName: {
      type: String
    },
    interviewerEmail: {
      type: String
    },
    feedback: {
      type: String,
      maxlength: [2000, 'Interview feedback cannot be more than 2000 characters']
    },
    rating: {
      type: Number,
      min: 1,
      max: 10
    }
  },
  offerDetails: {
    salary: {
      type: Number
    },
    startDate: {
      type: Date
    },
    benefits: {
      type: String,
      maxlength: [1000, 'Benefits description cannot be more than 1000 characters']
    },
    offerLetter: {
      type: String // URL or file path
    },
    response: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Negotiating']
    },
    responseDate: {
      type: Date
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Each tag cannot be more than 50 characters']
  }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  source: {
    type: String,
    enum: ['Website', 'LinkedIn', 'Indeed', 'Referral', 'Direct Application', 'Other'],
    default: 'Website'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full applicant name with email
JobApplicationSchema.virtual('applicantDisplay').get(function () {
  return `${this.applicantInfo.fullName} (${this.applicantInfo.email})`;
});

// Virtual for application age in days
JobApplicationSchema.virtual('daysOld').get(function () {
  const today = new Date();
  const submitted = new Date(this.submittedAt);
  const diffTime = today - submitted;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for status display with color
JobApplicationSchema.virtual('statusDisplay').get(function () {
  const statusColors = {
    'Submitted': { text: 'Submitted', color: 'blue' },
    'Under Review': { text: 'Under Review', color: 'yellow' },
    'Shortlisted': { text: 'Shortlisted', color: 'green' },
    'Interview Scheduled': { text: 'Interview Scheduled', color: 'purple' },
    'Interview Completed': { text: 'Interview Done', color: 'indigo' },
    'Offer Extended': { text: 'Offer Extended', color: 'emerald' },
    'Hired': { text: 'Hired', color: 'green' },
    'Rejected': { text: 'Rejected', color: 'red' },
    'Withdrawn': { text: 'Withdrawn', color: 'gray' }
  };

  return statusColors[this.status] || { text: this.status, color: 'gray' };
});

// Indexes for better query performance
JobApplicationSchema.index({ jobId: 1, 'applicantInfo.email': 1 }, { unique: true }); // Prevent duplicate applications
JobApplicationSchema.index({ jobId: 1, status: 1 });
JobApplicationSchema.index({ 'applicantInfo.email': 1 });
JobApplicationSchema.index({ submittedAt: -1 });
JobApplicationSchema.index({ status: 1, submittedAt: -1 });
JobApplicationSchema.index({ company: 1, jobTitle: 1 });

// Text index for search functionality
JobApplicationSchema.index({
  'applicantInfo.fullName': 'text',
  'applicantInfo.email': 'text',
  jobTitle: 'text',
  company: 'text'
});

// Middleware to set reviewedAt when status changes from 'Submitted'
JobApplicationSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status !== 'Submitted' && !this.reviewedAt) {
    this.reviewedAt = new Date();
  }
  next();
});

// Static method to get applications by job
JobApplicationSchema.statics.getByJob = function (jobId, status = null) {
  const query = { jobId };
  if (status) query.status = status;
  return this.find(query).sort({ submittedAt: -1 });
};

// Static method to get applications by status
JobApplicationSchema.statics.getByStatus = function (status) {
  return this.find({ status }).sort({ submittedAt: -1 });
};

// Static method to get recent applications
JobApplicationSchema.statics.getRecent = function (limit = 10) {
  return this.find({})
    .populate('jobId', 'title company')
    .sort({ submittedAt: -1 })
    .limit(limit);
};

// Static method to get application statistics
JobApplicationSchema.statics.getStatistics = function () {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

// Instance method to add a note
JobApplicationSchema.methods.addNote = function (content, userId) {
  this.notes.push({
    content,
    addedBy: userId,
    addedAt: new Date()
  });
  return this.save();
};

// Instance method to update status
JobApplicationSchema.methods.updateStatus = function (newStatus, userId) {
  this.status = newStatus;
  if (newStatus !== 'Submitted' && !this.reviewedAt) {
    this.reviewedAt = new Date();
    this.reviewedBy = userId;
  }
  return this.save();
};

// Instance method to schedule interview
JobApplicationSchema.methods.scheduleInterview = function (interviewData) {
  this.status = 'Interview Scheduled';
  this.interviewDetails = {
    ...this.interviewDetails,
    ...interviewData
  };
  return this.save();
};

export default mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema); 