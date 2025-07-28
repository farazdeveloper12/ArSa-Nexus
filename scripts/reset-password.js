const mongoose = require('mongoose');
const { hash } = require('bcryptjs');

const connectDB = async () => {
  await mongoose.connect('mongodb://localhost:27017/arsa-nexus');
  console.log('✅ Connected to MongoDB');
};

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  provider: String,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date,
}, {
  timestamps: false,
  collection: 'users'
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const fixLogin = async () => {
  await connectDB();

  // Delete ALL users to clean up duplicates
  const deleteResult = await User.deleteMany({});
  console.log(`🗑️ Deleted ${deleteResult.deletedCount} old users`);

  // Create ONE clean admin user
  const hashedPassword = await hash('admin123', 12);
  const newAdmin = await User.create({
    name: 'Admin User',
    email: 'admin@arsanexus.com',
    password: hashedPassword,
    role: 'admin',
    provider: 'credentials',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log('✅ FIXED! Clean admin user created:');
  console.log('📧 Email: admin@arsanexus.com');
  console.log('🔐 Password: admin123');
  console.log(`📋 ID: ${newAdmin._id}`);
  console.log(`📋 Active: ${newAdmin.active}`);

  await mongoose.disconnect();
};

fixLogin(); 