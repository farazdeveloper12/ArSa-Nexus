import mongoose from 'mongoose';

const InternshipApplicationSchema = new mongoose.Schema({
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: [true, 'Internship ID is required']
  },

  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },

  // Professional Information
  currentPosition: {
    type: String,
    trim: true,
    maxlength: [100, 'Current position cannot exceed 100 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  experience: {
    type: String,
    enum: ['No Experience', '0-1 years', '1-2 years', '2-3 years', '3+ years'],
    default: 'No Experience'
  },

  // Education
  education: {
    degree: {
      type: String,
      trim: true,
      maxlength: [100, 'Degree cannot exceed 100 characters']
    },
    institution: {
      type: String,
      trim: true,
      maxlength: [100, 'Institution name cannot exceed 100 characters']
    },
    graduationYear: {
      type: Number,
      min: [1950, 'Invalid graduation year'],
      max: [new Date().getFullYear() + 10, 'Invalid graduation year']
    },
    gpa: {
      type: Number,
      min: [0, 'GPA cannot be negative'],
      max: [4, 'GPA cannot exceed 4.0']
    }
  },

  // Skills and Qualifications
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Each skill cannot exceed 50 characters']
  }],

  // Application Details
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  motivation: {
    type: String,
    maxlength: [1000, 'Motivation cannot exceed 1000 characters']
  },
  availability: {
    startDate: {
      type: Date
    },
    duration: {
      type: String,
      trim: true
    },
    hoursPerWeek: {
      type: Number,
      min: [1, 'Hours per week must be positive'],
      max: [40, 'Hours per week cannot exceed 40']
    }
  },

  // Documents
  resume: {
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  portfolio: {
    url: String,
    description: String
  },
  linkedinProfile: {
    type: String,
    trim: true
  },
  githubProfile: {
    type: String,
    trim: true
  },

  // Application Status
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Interview Scheduled', 'Accepted', 'Rejected', 'Withdrawn'],
    default: 'Pending'
  },

  // Admin Notes
  adminNotes: [{
    note: {
      type: String,
      maxlength: [500, 'Note cannot exceed 500 characters']
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

  // Interview Information
  interview: {
    scheduled: {
      type: Boolean,
      default: false
    },
    date: Date,
    time: String,
    type: {
      type: String,
      enum: ['Phone', 'Video', 'In-Person', 'Online'],
      default: 'Video'
    },
    meetingLink: String,
    notes: String
  },

  // Assessment Results
  assessment: {
    completed: {
      type: Boolean,
      default: false
    },
    score: {
      type: Number,
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100']
    },
    feedback: String,
    completedAt: Date
  },

  // References
  references: [{
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Reference name cannot exceed 100 characters']
    },
    position: {
      type: String,
      trim: true,
      maxlength: [100, 'Reference position cannot exceed 100 characters']
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Reference company cannot exceed 100 characters']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    relationship: {
      type: String,
      trim: true,
      maxlength: [100, 'Relationship description cannot exceed 100 characters']
    }
  }],

  // Metadata
  source: {
    type: String,
    enum: ['Website', 'LinkedIn', 'Indeed', 'University', 'Referral', 'Other'],
    default: 'Website'
  },
  ipAddress: String,
  userAgent: String,

  // Communication Log
  communications: [{
    type: {
      type: String,
      enum: ['Email', 'Phone', 'SMS', 'In-Person', 'Video Call']
    },
    subject: String,
    content: String,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    isFromApplicant: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
InternshipApplicationSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for application age
InternshipApplicationSchema.virtual('applicationAge').get(function () {
  if (!this.createdAt) return null;
  const now = new Date();
  const diffTime = now - this.createdAt;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
});

// Indexes for better performance
InternshipApplicationSchema.index({ internshipId: 1, status: 1 });
InternshipApplicationSchema.index({ email: 1 });
InternshipApplicationSchema.index({ status: 1, createdAt: -1 });
InternshipApplicationSchema.index({ 'interview.date': 1 });

// Pre-save middleware
InternshipApplicationSchema.pre('save', function (next) {
  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Static method to get applications for an internship
InternshipApplicationSchema.statics.getByInternship = function (internshipId, status = null) {
  const query = { internshipId };
  if (status) query.status = status;

  return this.find(query)
    .populate('internshipId', 'title company location')
    .sort({ createdAt: -1 });
};

// Static method to get applications by status
InternshipApplicationSchema.statics.getByStatus = function (status) {
  return this.find({ status })
    .populate('internshipId', 'title company location applicationDeadline')
    .sort({ createdAt: -1 });
};

// Instance method to add admin note
InternshipApplicationSchema.methods.addAdminNote = function (note, userId) {
  this.adminNotes.push({
    note,
    addedBy: userId,
    addedAt: new Date()
  });
  return this.save();
};

// Instance method to schedule interview
InternshipApplicationSchema.methods.scheduleInterview = function (date, time, type, meetingLink) {
  this.interview = {
    scheduled: true,
    date,
    time,
    type,
    meetingLink
  };
  this.status = 'Interview Scheduled';
  return this.save();
};

export default mongoose.models.InternshipApplication || mongoose.model('InternshipApplication', InternshipApplicationSchema); 