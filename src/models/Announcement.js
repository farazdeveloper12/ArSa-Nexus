import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error', 'promotion', 'maintenance', 'update'],
    default: 'info',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'instructors', 'admins', 'premium'],
    default: 'all',
  },
  displayLocation: {
    type: [String],
    enum: ['homepage', 'dashboard', 'courses', 'global', 'popup'],
    default: ['global'],
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isPermanent: {
    type: Boolean,
    default: false,
  },
  dismissible: {
    type: Boolean,
    default: true,
  },
  autoHide: {
    type: Boolean,
    default: false,
  },
  autoHideDelay: {
    type: Number,
    default: 5000, // milliseconds
  },
  icon: {
    type: String,
    default: '',
  },
  backgroundColor: {
    type: String,
    default: '#3B82F6', // blue
  },
  textColor: {
    type: String,
    default: '#FFFFFF',
  },
  borderColor: {
    type: String,
    default: '#3B82F6',
  },
  actionButton: {
    text: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#FFFFFF',
    }
  },
  media: {
    image: {
      type: String,
      default: '',
    },
    video: {
      type: String,
      default: '',
    }
  },
  analytics: {
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    dismissals: {
      type: Number,
      default: 0,
    },
    uniqueViews: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      viewedAt: {
        type: Date,
        default: Date.now,
      },
      dismissed: {
        type: Boolean,
        default: false,
      },
      dismissedAt: {
        type: Date,
      }
    }]
  },
  tags: [{
    type: String,
  }],
  metadata: {
    campaignId: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: 'admin',
    },
    version: {
      type: String,
      default: '1.0',
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  collection: 'announcements'
});

// Indexes for performance
AnnouncementSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
AnnouncementSchema.index({ targetAudience: 1 });
AnnouncementSchema.index({ displayLocation: 1 });
AnnouncementSchema.index({ priority: 1 });
AnnouncementSchema.index({ type: 1 });
AnnouncementSchema.index({ createdAt: -1 });

// Virtual for checking if announcement is currently active
AnnouncementSchema.virtual('isCurrentlyActive').get(function () {
  const now = new Date();
  return this.isActive &&
    this.startDate <= now &&
    (!this.endDate || this.endDate >= now);
});

// Method to mark as viewed by a user
AnnouncementSchema.methods.markAsViewed = function (userId) {
  const existingView = this.analytics.uniqueViews.find(
    view => view.userId.toString() === userId.toString()
  );

  if (!existingView) {
    this.analytics.uniqueViews.push({ userId });
    this.analytics.views += 1;
  }

  return this.save();
};

// Method to mark as dismissed by a user
AnnouncementSchema.methods.markAsDismissed = function (userId) {
  const view = this.analytics.uniqueViews.find(
    view => view.userId.toString() === userId.toString()
  );

  if (view && !view.dismissed) {
    view.dismissed = true;
    view.dismissedAt = new Date();
    this.analytics.dismissals += 1;
  }

  return this.save();
};

// Method to track click
AnnouncementSchema.methods.trackClick = function () {
  this.analytics.clicks += 1;
  return this.save();
};

// Static method to get active announcements for user
AnnouncementSchema.statics.getActiveForUser = function (targetAudience = 'all', location = 'global') {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    $or: [
      { endDate: { $exists: false } },
      { endDate: null },
      { endDate: { $gte: now } }
    ],
    $or: [
      { targetAudience: 'all' },
      { targetAudience: targetAudience }
    ],
    displayLocation: { $in: [location, 'global'] }
  }).sort({ priority: -1, createdAt: -1 });
};

export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema); 