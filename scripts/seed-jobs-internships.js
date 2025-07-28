import dbConnect from '../src/lib/dbConnect.js';
import mongoose from 'mongoose';

// Job Schema
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  locationType: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Temporary'], default: 'Full-time' },
  experienceLevel: { type: String, enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead/Manager', 'Executive'], default: 'Mid Level' },
  salary: {
    type: { type: String, enum: ['Range', 'Fixed', 'Negotiable'], default: 'Range' },
    min: { type: Number },
    max: { type: Number },
    amount: { type: Number },
    period: { type: String, enum: ['Hour', 'Day', 'Week', 'Month', 'Year'], default: 'Year' },
    currency: { type: String, default: 'USD' }
  },
  applicationDeadline: { type: Date },
  startDate: { type: Date },
  requirements: [String],
  responsibilities: [String],
  benefits: [String],
  skills: [String],
  qualifications: [String],
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String },
    website: { type: String }
  },
  companyInfo: {
    name: { type: String },
    size: { type: String },
    industry: { type: String },
    description: { type: String },
    logo: { type: String },
    website: { type: String }
  },
  applicationProcess: { type: String },
  featured: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Active' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Internship Schema
const InternshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  locationType: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
  requirements: [String],
  responsibilities: [String],
  skills: [String],
  qualifications: [String],
  benefits: [String],
  stipend: {
    amount: { type: Number, default: 0 },
    period: { type: String, enum: ['Month', 'Week', 'Total'], default: 'Month' },
    currency: { type: String, default: 'USD' }
  },
  applicationDeadline: { type: Date },
  startDate: { type: Date },
  endDate: { type: Date },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String },
    website: { type: String }
  },
  companyInfo: {
    name: { type: String },
    size: { type: String },
    industry: { type: String },
    description: { type: String },
    logo: { type: String },
    website: { type: String }
  },
  status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Active' },
  featured: { type: Boolean, default: false },
  urgent: { type: Boolean, default: false },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  selectedInterns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
const Internship = mongoose.models.Internship || mongoose.model('Internship', InternshipSchema);

// User schema for finding admin
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const sampleJobs = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    description: "We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for developing user-facing features and ensuring optimal performance across various web-capable devices and browsers.",
    category: "Web Development",
    location: "San Francisco, CA",
    locationType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior Level",
    salary: {
      type: "Range",
      min: 120000,
      max: 160000,
      period: "Year",
      currency: "USD"
    },
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    requirements: [
      "5+ years of experience with React.js and TypeScript",
      "Strong understanding of modern CSS frameworks",
      "Experience with state management (Redux, Zustand)",
      "Knowledge of testing frameworks (Jest, React Testing Library)"
    ],
    responsibilities: [
      "Develop new user-facing features using React.js",
      "Build reusable components and front-end libraries",
      "Translate designs and wireframes into high-quality code",
      "Optimize applications for maximum speed and scalability"
    ],
    skills: ["React.js", "TypeScript", "JavaScript", "CSS", "HTML", "Redux", "Git"],
    benefits: ["Health Insurance", "401k Matching", "Flexible PTO", "Remote Work Options"],
    contactInfo: {
      email: "careers@techcorp.com",
      phone: "+1-555-0123",
      website: "https://techcorp.com"
    },
    companyInfo: {
      name: "TechCorp Solutions",
      size: "201-500",
      industry: "Technology",
      description: "Leading technology solutions provider",
      website: "https://techcorp.com"
    },
    featured: true,
    urgent: false,
    status: "Active"
  },
  {
    title: "Data Scientist",
    company: "DataViz Analytics",
    description: "Join our data science team to help businesses make data-driven decisions. You'll work with large datasets, build predictive models, and create actionable insights.",
    category: "Data Science",
    location: "New York, NY",
    locationType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salary: {
      type: "Range",
      min: 95000,
      max: 130000,
      period: "Year",
      currency: "USD"
    },
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    requirements: [
      "3+ years of experience in data science",
      "Proficiency in Python and R",
      "Experience with machine learning frameworks",
      "Strong statistical analysis skills"
    ],
    responsibilities: [
      "Analyze complex datasets to identify trends and patterns",
      "Build and deploy machine learning models",
      "Create data visualizations and reports",
      "Collaborate with cross-functional teams"
    ],
    skills: ["Python", "R", "SQL", "Machine Learning", "Statistics", "Pandas", "Scikit-learn"],
    benefits: ["Health Insurance", "Stock Options", "Learning Budget", "Flexible Hours"],
    contactInfo: {
      email: "jobs@dataviz.com",
      phone: "+1-555-0456"
    },
    companyInfo: {
      name: "DataViz Analytics",
      size: "51-200",
      industry: "Analytics",
      description: "Data analytics and visualization experts"
    },
    featured: false,
    urgent: true,
    status: "Active"
  },
  {
    title: "Mobile App Developer",
    company: "AppInnovate",
    description: "We're seeking a talented Mobile App Developer to create exceptional mobile experiences for iOS and Android platforms.",
    category: "Mobile Development",
    location: "Austin, TX",
    locationType: "On-site",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salary: {
      type: "Range",
      min: 85000,
      max: 115000,
      period: "Year",
      currency: "USD"
    },
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    requirements: [
      "2+ years of mobile development experience",
      "Proficiency in React Native or Flutter",
      "Experience with native iOS/Android development",
      "Knowledge of mobile UI/UX best practices"
    ],
    responsibilities: [
      "Develop mobile applications for iOS and Android",
      "Collaborate with designers and backend developers",
      "Optimize app performance and user experience",
      "Maintain and update existing applications"
    ],
    skills: ["React Native", "Flutter", "iOS", "Android", "JavaScript", "Mobile UI/UX"],
    contactInfo: {
      email: "hr@appinnovate.com"
    },
    companyInfo: {
      name: "AppInnovate",
      size: "11-50",
      industry: "Mobile Technology"
    },
    status: "Active"
  }
];

const sampleInternships = [
  {
    title: "Frontend Development Intern",
    company: "WebCraft Studios",
    description: "Join our team as a Frontend Development Intern and gain hands-on experience building modern web applications. You'll work closely with senior developers and contribute to real projects.",
    category: "Web Development",
    duration: "3 months",
    location: "Remote",
    locationType: "Remote",
    requirements: [
      "Basic knowledge of HTML, CSS, and JavaScript",
      "Familiarity with React.js or Vue.js",
      "Currently enrolled in Computer Science or related field",
      "Strong problem-solving skills"
    ],
    responsibilities: [
      "Assist in developing user interfaces",
      "Write clean, maintainable code",
      "Participate in code reviews",
      "Learn from senior developers"
    ],
    skills: ["HTML", "CSS", "JavaScript", "React.js", "Git"],
    stipend: {
      amount: 1500,
      period: "Month",
      currency: "USD"
    },
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    contactInfo: {
      email: "internships@webcraft.com",
      phone: "+1-555-0789"
    },
    companyInfo: {
      name: "WebCraft Studios",
      size: "11-50",
      industry: "Web Development",
      description: "Creative web development agency"
    },
    featured: true,
    status: "Active"
  },
  {
    title: "Data Analysis Intern",
    company: "Analytics Pro",
    description: "Gain valuable experience in data analysis and visualization. Work with real datasets and learn industry-standard tools and techniques.",
    category: "Data Science",
    duration: "4 months",
    location: "Chicago, IL",
    locationType: "Hybrid",
    requirements: [
      "Basic knowledge of Python or R",
      "Understanding of statistics",
      "Currently pursuing degree in Data Science, Statistics, or related field",
      "Curiosity about data and analytics"
    ],
    responsibilities: [
      "Clean and prepare datasets for analysis",
      "Create data visualizations",
      "Assist with research projects",
      "Learn data analysis tools and techniques"
    ],
    skills: ["Python", "Excel", "Statistics", "Data Visualization"],
    stipend: {
      amount: 1200,
      period: "Month",
      currency: "USD"
    },
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    contactInfo: {
      email: "interns@analyticspro.com"
    },
    companyInfo: {
      name: "Analytics Pro",
      size: "51-200",
      industry: "Data Analytics"
    },
    featured: false,
    urgent: true,
    status: "Active"
  },
  {
    title: "UI/UX Design Intern",
    company: "DesignFlow Agency",
    description: "Learn from experienced designers while working on exciting projects. Develop your skills in user research, wireframing, and prototyping.",
    category: "UI/UX Design",
    duration: "3 months",
    location: "Los Angeles, CA",
    locationType: "On-site",
    requirements: [
      "Basic knowledge of design principles",
      "Familiarity with Figma or Adobe Creative Suite",
      "Portfolio showcasing design work",
      "Strong communication skills"
    ],
    responsibilities: [
      "Assist in creating wireframes and prototypes",
      "Conduct user research",
      "Design user interfaces",
      "Collaborate with development teams"
    ],
    skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Design Systems"],
    stipend: {
      amount: 1000,
      period: "Month",
      currency: "USD"
    },
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    contactInfo: {
      email: "design-team@designflow.com"
    },
    companyInfo: {
      name: "DesignFlow Agency",
      size: "11-50",
      industry: "Design"
    },
    status: "Active"
  }
];

async function seedData() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Find an admin user to use as creator
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log(`Using admin user: ${adminUser.email}`);

    // Clear existing data
    await Job.deleteMany({});
    await Internship.deleteMany({});
    console.log('Cleared existing jobs and internships');

    // Add createdBy field to sample data
    const jobsWithCreator = sampleJobs.map(job => ({
      ...job,
      createdBy: adminUser._id
    }));

    const internshipsWithCreator = sampleInternships.map(internship => ({
      ...internship,
      createdBy: adminUser._id
    }));

    // Insert jobs
    const insertedJobs = await Job.insertMany(jobsWithCreator);
    console.log(`Inserted ${insertedJobs.length} jobs`);

    // Insert internships
    const insertedInternships = await Internship.insertMany(internshipsWithCreator);
    console.log(`Inserted ${insertedInternships.length} internships`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData(); 