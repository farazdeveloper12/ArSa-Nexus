const mongoose = require('mongoose');
const { hash } = require('bcryptjs');
const fs = require('fs');
const path = require('path');

console.log('🧹 USER DATABASE CLEANUP SCRIPT');
console.log('================================');

const cleanup = async () => {
  try {
    // Load .env.local
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf8');
      const lines = envFile.split('\n');
      lines.forEach(line => {
        if (line.includes('=')) {
          const [key, ...valueParts] = line.split('=');
          const value = valueParts.join('=').trim().replace(/"/g, '');
          process.env[key.trim()] = value;
        }
      });
      console.log('✅ Loaded environment variables');
    }

    const MONGODB_URI = process.env.MONGODB_URI;
    console.log('🔗 Connecting to database...');

    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('✅ Connected to MongoDB');

    // Updated User schema with all roles
    const UserSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['user', 'admin', 'instructor', 'manager', 'employee'],
        default: 'user',
      },
      provider: {
        type: String,
        default: 'credentials',
      },
      active: {
        type: Boolean,
        default: true,
      },
      profileImage: {
        type: String,
        default: null,
      },
      lastLogin: {
        type: Date,
        default: null,
      },
    }, {
      timestamps: true,
      collection: 'users'
    });

    delete mongoose.models.User;
    const User = mongoose.model('User', UserSchema);

    console.log('\n🔍 CURRENT DATABASE STATE:');
    const allUsers = await User.find({});
    console.log(`📊 Found ${allUsers.length} users:`);
    allUsers.forEach((user, i) => {
      console.log(`  ${i + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.active}`);
    });

    console.log('\n🗑️  CLEANING DATABASE...');
    const deleteResult = await User.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} users`);

    console.log('\n👤 CREATING CLEAN ADMIN USER...');
    const hashedPassword = await hash('admin123', 12);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@arsanexus.com',
      password: hashedPassword,
      role: 'admin',
      provider: 'credentials',
      active: true,
    });

    console.log('✅ ADMIN USER CREATED:');
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   👤 Name: ${admin.name}`);
    console.log(`   🛡️  Role: ${admin.role}`);
    console.log(`   ✅ Active: ${admin.active}`);
    console.log(`   🆔 ID: ${admin._id}`);

    console.log('\n🎯 === DATABASE CLEANUP COMPLETED! ===');
    console.log('📧 Email: admin@arsanexus.com');
    console.log('🔐 Password: admin123');
    console.log('🌐 Login URL: http://localhost:3000/auth/login');
    console.log('\n✨ Database now contains only the admin user!');
    console.log('🚀 Ready for professional user management!');

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔒 Database connection closed');
  }
};

cleanup(); 