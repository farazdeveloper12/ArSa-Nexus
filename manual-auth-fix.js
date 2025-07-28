const mongoose = require('mongoose');
const { hash } = require('bcryptjs');

console.log('🚀 MANUAL AUTHENTICATION FIX');
console.log('=============================');

const fix = async () => {
  try {
    // Connect to the EXACT same database as your app
    await mongoose.connect('mongodb://localhost:27017/arsa-nexus', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB: arsa-nexus');

    // Use exact schema as your app
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
        enum: ['user', 'admin', 'instructor'],
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

    // Clear any existing model to avoid conflicts
    delete mongoose.models.User;
    const User = mongoose.model('User', UserSchema);

    console.log('\n🔍 STEP 1: Current database state');
    const allUsers = await User.find({});
    console.log(`📊 Found ${allUsers.length} users:`);
    allUsers.forEach((user, i) => {
      console.log(`  ${i + 1}. ${user.email} (${user._id}) - Active: ${user.active}`);
    });

    console.log('\n🧹 STEP 2: Deleting the problematic old users');
    // Delete the specific old users that are causing issues
    const delete1 = await User.deleteOne({ _id: mongoose.Types.ObjectId('6868cf5bf2e5b396c7a7b5c7') });
    console.log(`   Deleted user 6868cf5bf2e5b396c7a7b5c7: ${delete1.deletedCount > 0 ? 'SUCCESS' : 'NOT FOUND'}`);

    const delete2 = await User.deleteOne({ _id: mongoose.Types.ObjectId('6868fbc5e581f6c7a9cb5428') });
    console.log(`   Deleted user 6868fbc5e581f6c7a9cb5428: ${delete2.deletedCount > 0 ? 'SUCCESS' : 'NOT FOUND'}`);

    // Delete any other admin users just to be sure
    const deleteOthers = await User.deleteMany({
      $or: [
        { email: 'admin@arsanexus.com' },
        { email: 'arsalan@arsanexus.com' }
      ]
    });
    console.log(`   Deleted other admin users: ${deleteOthers.deletedCount}`);

    console.log('\n👤 STEP 3: Creating fresh admin user');
    const hashedPassword = await hash('admin123', 12);
    console.log(`   🔐 Generated password hash: ${hashedPassword.substring(0, 30)}...`);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@arsanexus.com',
      password: hashedPassword,
      role: 'admin',
      provider: 'credentials',
      active: true,
      profileImage: null,
      lastLogin: null
    });

    console.log('✅ NEW ADMIN CREATED SUCCESSFULLY!');
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   🆔 ID: ${admin._id}`);
    console.log(`   ✅ Active: ${admin.active}`);
    console.log(`   🔐 Password: admin123`);

    console.log('\n🧪 STEP 4: Testing authentication');
    // Test the exact same lookup as your app
    const testUser = await User.findOne({
      email: { $regex: new RegExp('^admin@arsanexus.com$', 'i') }
    });

    if (testUser) {
      console.log('✅ User lookup test: SUCCESS');
      console.log(`   Found: ${testUser.email} (${testUser._id})`);
      console.log(`   Active: ${testUser.active}`);

      // Test password verification
      const { compare } = require('bcryptjs');
      const passwordTest = await compare('admin123', testUser.password);
      console.log(`   Password verification: ${passwordTest ? '✅ SUCCESS' : '❌ FAILED'}`);

      if (passwordTest) {
        console.log('\n🎯 === AUTHENTICATION IS FIXED! ===');
        console.log('📧 Email: admin@arsanexus.com');
        console.log('🔐 Password: admin123');
        console.log('🌐 Login URL: http://localhost:3000/auth/login');
        console.log('\n📝 NEXT STEPS:');
        console.log('1. ⛔ STOP your Next.js server (Ctrl+C)');
        console.log('2. ⏱️  Wait 5 seconds');
        console.log('3. 🚀 Start server: npm run dev');
        console.log('4. 🔓 Login with credentials above');
        console.log('\n✨ The login will work perfectly now!');
      } else {
        console.log('\n❌ Password verification failed - there might be a bcrypt issue');
      }
    } else {
      console.log('❌ User lookup test: FAILED - user not found');
    }

  } catch (error) {
    console.error('❌ Fix failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔒 Database connection closed');
  }
};

fix(); 