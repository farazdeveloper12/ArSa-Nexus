/**
 * MongoDB Cleanup Script - Remove Invalid Training Records
 * Run this to clean up test/invalid data from your database
 */

const { MongoClient } = require('mongodb');

// Your MongoDB connection string
const MONGODB_URI = "mongodb+srv://annovationarsa:1dluPFyN5sme7E6p@cluster0.1cbcr.mongodb.net/arsanexus?retryWrites=true&w=majority";

async function cleanupInvalidTrainings() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');

    const db = client.db('arsanexus');
    const trainingsCollection = db.collection('trainings');

    // Find invalid records first
    const invalidRecords = await trainingsCollection.find({
      $or: [
        { title: { $exists: false } },
        { title: "" },
        { title: /^[a-z]{8,}$/ }, // Matches rwqerew, asdasdasd etc.
        { description: { $exists: false } },
        { description: "" },
        { price: { $exists: false } },
        { category: { $exists: false } },
        { category: "" }
      ]
    }).toArray();

    console.log(`🔍 Found ${invalidRecords.length} invalid training records:`);
    invalidRecords.forEach(record => {
      console.log(`  - ID: ${record._id}, Title: "${record.title || 'NO TITLE'}", Category: "${record.category || 'NO CATEGORY'}"`);
    });

    if (invalidRecords.length === 0) {
      console.log('✅ No invalid records found. Database is clean!');
      return;
    }

    // Delete invalid records
    const deleteResult = await trainingsCollection.deleteMany({
      $or: [
        { title: { $exists: false } },
        { title: "" },
        { title: /^[a-z]{8,}$/ },
        { description: { $exists: false } },
        { description: "" },
        { price: { $exists: false } },
        { category: { $exists: false } },
        { category: "" }
      ]
    });

    console.log(`🧹 Deleted ${deleteResult.deletedCount} invalid training records`);

    // Show remaining valid records
    const validRecords = await trainingsCollection.find({
      title: { $exists: true, $ne: "", $not: /^[a-z]{8,}$/ },
      description: { $exists: true, $ne: "" },
      price: { $exists: true },
      category: { $exists: true, $ne: "" }
    }).toArray();

    console.log(`✅ ${validRecords.length} valid training records remaining:`);
    validRecords.forEach(record => {
      console.log(`  - "${record.title}" (${record.category}) - $${record.price}`);
    });

  } catch (error) {
    console.error('❌ Error cleaning up database:', error);
  } finally {
    await client.close();
    console.log('🔐 Database connection closed');
  }
}

// Run the cleanup
cleanupInvalidTrainings()
  .then(() => {
    console.log('🎉 Cleanup completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Cleanup failed:', error);
    process.exit(1);
  }); 