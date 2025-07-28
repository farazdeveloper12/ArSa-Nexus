import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['AI', 'Programming', 'Data Science', 'Design', 'Business', 'Marketing'],
    default: 'Programming'
  },
  icon: {
    type: String,
    default: '🔧'
  },
  features: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  duration: {
    type: String,
    default: '1 month'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for better search performance
ServiceSchema.index({ title: 'text', description: 'text' });
ServiceSchema.index({ category: 1, isActive: 1 });
ServiceSchema.index({ order: 1, createdAt: -1 });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema); 