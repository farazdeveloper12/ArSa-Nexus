import mongoose from 'mongoose';

const TrainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile Development', 'AI & Machine Learning', 'Data Science', 'Digital Marketing', 'UI/UX Design', 'Cloud Computing', 'Cybersecurity'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  duration: {
    type: String,
    required: true,
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
  instructor: {
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: null,
    },
  },
  curriculum: [{
    module: {
      type: String,
      required: true,
    },
    topics: [{
      type: String,
      required: true,
    }],
    duration: {
      type: String,
      required: true,
    }
  }],
  prerequisites: [{
    type: String,
  }],
  whatYouWillLearn: [{
    type: String,
    required: true,
  }],
  features: [{
    type: String,
  }],
  image: {
    type: String,
    default: '/images/training/default.jpg',
  },
  thumbnail: {
    type: String,
    default: '/images/training/default-thumb.jpg',
  },
  tags: [{
    type: String,
  }],
  enrollmentCount: {
    type: Number,
    default: 0,
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
  isPopular: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  schedule: {
    type: String,
    default: 'Self-paced',
  },
  certificate: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  collection: 'trainings'
});

TrainingSchema.index({ title: 1 });
TrainingSchema.index({ category: 1 });
TrainingSchema.index({ level: 1 });
TrainingSchema.index({ active: 1 });
TrainingSchema.index({ isPopular: 1 });
TrainingSchema.index({ isFeatured: 1 });

export default mongoose.models.Training || mongoose.model('Training', TrainingSchema);