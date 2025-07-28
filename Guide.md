# Arsa Nexus Website - Complete Setup Guide

This guide will walk you through setting up the Arsa Nexus website from scratch, including all the necessary API integrations.

## Project Structure

The project is built with:
- **Frontend**: Next.js, React, Three.js, Framer Motion, TailwindCSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js

## 1. Initial Setup

### Create a New Next.js Project

```bash
npx create-next-app arsa-nexus
cd arsa-nexus
```

### Install Dependencies

Copy the dependencies from the provided `package.json` or run:

```bash
npm install @react-three/drei @react-three/fiber axios bcryptjs chart.js formik framer-motion gsap jsonwebtoken mongoose next next-auth react react-chartjs-2 react-dom react-icons react-quill three yup
npm install --save-dev autoprefixer eslint eslint-config-next postcss tailwindcss
```

### Initialize TailwindCSS

```bash
npx tailwindcss init -p
```

## 2. Project Configuration

### Set Up Environment Variables

Create a `.env.local` file in the root directory with the following content:

```
# MongoDB connection string
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/arsa-nexus?retryWrites=true&w=majority

# NextAuth.js secret
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Google OAuth credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=arsa-nexus-uploads
```

### Setting Up Google OAuth

1. Go to the [Google Developer Console](https://console.developers.google.com/)
2. Create a new project
3. Navigate to "Credentials" and create OAuth 2.0 Client ID
4. Set authorized JavaScript origins to: `http://localhost:3000`
5. Set authorized redirect URIs to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

### Setting Up MongoDB

1. Create a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
2. Create a new cluster
3. Set up database access with a username and password
4. Add your IP address to the network access list (or `0.0.0.0/0` for all IPs - less secure)
5. Get your connection string and add it to the `MONGODB_URI` environment variable

## 3. API Endpoints Reference

The API endpoints you'll need to use in your application:

### Authentication

- `POST /api/auth/register` - Register a new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Users

- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create a new user (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT/PATCH /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Training Programs

- `GET /api/training` - Get all training programs
- `POST /api/training` - Create a new training program (admin/manager only)
- `GET /api/training/:id` - Get training program by ID
- `PUT/PATCH /api/training/:id` - Update training program (admin/manager only)
- `DELETE /api/training/:id` - Delete training program (admin/manager only)

### Enrollments

- `GET /api/training/enrollment` - Get all enrollments (admin/manager only)
- `POST /api/training/enrollment` - Create a new enrollment (user enrollment)
- `GET /api/training/enrollment/:id` - Get enrollment by ID
- `PUT/PATCH /api/training/enrollment/:id` - Update enrollment (admin/manager only)
- `DELETE /api/training/enrollment/:id` - Delete enrollment (admin/manager only)

### Blog Posts

- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create a new blog post (admin/manager only)
- `GET /api/blog/:id` - Get blog post by ID
- `PUT/PATCH /api/blog/:id` - Update blog post (admin/manager only)
- `DELETE /api/blog/:id` - Delete blog post (admin/manager only)

## 4. Database Models Reference

### User Model

```javascript
{
  name: String,           // Required
  email: String,          // Required, unique
  password: String,       // Required, hashed
  image: String,          // Optional
  role: String,           // 'user', 'admin', 'manager', 'employee'
  permissions: [String],  // Array of permissions
  isVerified: Boolean,    // Email verification status
  createdAt: Date,        // Timestamp
  updatedAt: Date         // Timestamp
}
```

### Training Model

```javascript
{
  title: String,          // Required
  slug: String,           // Required, unique, generated from title
  description: String,    // Required
  shortDescription: String, // Optional
  level: String,          // 'Beginner', 'Intermediate', 'Advanced', 'All Levels'
  duration: {             // Required
    value: Number,        // e.g., 8
    unit: String          // 'hours', 'days', 'weeks', 'months'
  },
  startDate: Date,        // Optional
  endDate: Date,          // Optional
  schedule: String,       // Optional
  category: ObjectId,     // Reference to Category model
  tags: [String],         // Optional
  prerequisites: [String], // Optional
  learningOutcomes: [String], // Optional
  image: {                // Optional
    url: String,
    alt: String
  },
  instructor: ObjectId,   // Reference to User model
  syllabus: [{            // Optional
    title: String,
    description: String,
    modules: [{
      title: String,
      description: String,
      duration: String
    }]
  }],
  maxCapacity: Number,    // Optional
  enrolledCount: Number,  // Default: 0
  price: Number,          // Default: 0
  isFree: Boolean,        // Default: true if price is 0
  isActive: Boolean,      // Default: true
  isOnline: Boolean,      // Default: true
  createdBy: ObjectId,    // Reference to User model
  createdAt: Date,        // Timestamp
  updatedAt: Date         // Timestamp
}
```

### Enrollment Model

```