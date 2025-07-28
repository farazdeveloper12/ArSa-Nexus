const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from .env.local
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  const envLines = envConfig.split('\n');
  envLines.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

// Use the MongoDB URI directly since we know it
const MONGODB_URI = 'mongodb+srv://annovationarsa:Arsalan79866213@cluster0.1cbcr.mongodb.net/arsanexus?retryWrites=true&w=majority';

// Service model
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

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

const initialServices = [
  {
    title: 'AI Fundamentals Training',
    shortDescription: 'Learn the basics of artificial intelligence and machine learning',
    description: 'Comprehensive training program covering artificial intelligence concepts, machine learning algorithms, and practical applications in modern business environments.',
    category: 'AI',
    icon: '🤖',
    features: [
      'Introduction to AI and ML concepts',
      'Hands-on Python programming',
      'Neural networks basics',
      'Real-world project implementation'
    ],
    price: 299,
    duration: '8 weeks',
    level: 'Beginner',
    order: 1,
    isActive: true
  },
  {
    title: 'Full Stack Web Development',
    shortDescription: 'Master modern web development with React, Node.js, and databases',
    description: 'Complete web development bootcamp covering frontend and backend technologies including React, Node.js, Express, MongoDB, and deployment strategies.',
    category: 'Programming',
    icon: '💻',
    features: [
      'React.js frontend development',
      'Node.js and Express backend',
      'Database design and MongoDB',
      'Authentication and security',
      'Deployment and DevOps'
    ],
    price: 599,
    duration: '12 weeks',
    level: 'Intermediate',
    order: 2,
    isActive: true
  },
  {
    title: 'Data Science with Python',
    shortDescription: 'Analyze data and build predictive models using Python',
    description: 'Learn data analysis, visualization, and machine learning using Python libraries like Pandas, NumPy, Matplotlib, and Scikit-learn.',
    category: 'Data Science',
    icon: '📊',
    features: [
      'Python for data analysis',
      'Data visualization with Matplotlib',
      'Machine learning with Scikit-learn',
      'Statistical analysis techniques',
      'Real dataset projects'
    ],
    price: 399,
    duration: '10 weeks',
    level: 'Intermediate',
    order: 3,
    isActive: true
  },
  {
    title: 'UI/UX Design Masterclass',
    shortDescription: 'Create beautiful and user-friendly digital experiences',
    description: 'Comprehensive design course covering user experience research, interface design principles, prototyping, and design systems.',
    category: 'Design',
    icon: '🎨',
    features: [
      'User research and personas',
      'Wireframing and prototyping',
      'Visual design principles',
      'Figma and design tools',
      'Usability testing'
    ],
    price: 349,
    duration: '6 weeks',
    level: 'Beginner',
    order: 4,
    isActive: true
  },
  {
    title: 'Digital Marketing Strategy',
    shortDescription: 'Master online marketing and grow your business digitally',
    description: 'Learn comprehensive digital marketing strategies including SEO, social media marketing, content marketing, and analytics.',
    category: 'Marketing',
    icon: '📈',
    features: [
      'SEO and content marketing',
      'Social media strategy',
      'Google Ads and PPC',
      'Email marketing campaigns',
      'Analytics and measurement'
    ],
    price: 249,
    duration: '4 weeks',
    level: 'Beginner',
    order: 5,
    isActive: true
  },
  {
    title: 'Business Analytics',
    shortDescription: 'Make data-driven business decisions with advanced analytics',
    description: 'Learn business intelligence, data visualization, and analytical thinking to drive strategic business decisions.',
    category: 'Business',
    icon: '📋',
    features: [
      'Business intelligence tools',
      'Data visualization with Tableau',
      'Excel advanced techniques',
      'KPI and metrics design',
      'Strategic decision making'
    ],
    price: 199,
    duration: '6 weeks',
    level: 'Beginner',
    order: 6,
    isActive: true
  }
];

async function createInitialServices() {
  try {
    console.log('🚀 CREATING INITIAL SERVICES');
    console.log('==============================');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing services
    const deletedCount = await Service.deleteMany({});
    console.log(`🗑️  Deleted ${deletedCount.deletedCount} existing services`);

    // Create initial services
    const createdServices = await Service.insertMany(initialServices);
    console.log(`✅ Created ${createdServices.length} initial services:`);

    createdServices.forEach((service, index) => {
      console.log(`  ${index + 1}. ${service.title} (${service.category}) - $${service.price}`);
    });

    console.log('\n🎉 Initial services created successfully!');
    console.log('   You can now view them in the admin panel and on the website.');

  } catch (error) {
    console.error('❌ Error creating services:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
  }
}

createInitialServices(); 