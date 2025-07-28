import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user'],
  },
  training: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Training',
    required: [true, 'Please provide a training program'],
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  progressPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  completedModules: [{
    moduleId: String,
    completedAt: Date,
  }],
  certificate: {
    isIssued: {
      type: Boolean,
      default: false,
    },
    issuedAt: Date,
    certificateId: String,
    certificateUrl: String,
  },
  notes: {
    type: String,
  },
  paymentInfo: {
    amount: Number,
    paymentMethod: String,
    paymentId: String,
    paymentDate: Date,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
    },
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    submittedAt: Date,
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
EnrollmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if enrollment is complete
EnrollmentSchema.methods.isComplete = function() {
  return this.progressPercentage === 100 && this.status === 'completed';
};

// Update progress
EnrollmentSchema.methods.updateProgress = function(completedModulesCount, totalModulesCount) {
  if (totalModulesCount > 0) {
    this.progressPercentage = Math.round((completedModulesCount / totalModulesCount) * 100);
    
    if (this.progressPercentage === 100 && this.status === 'in-progress') {
      this.status = 'completed';
    }
  }
};

// Compound index to ensure a user can only enroll once in a training program
EnrollmentSchema.index({ user: 1, training: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);