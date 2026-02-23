const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const testConnection = async () => {
  try {
    console.log('🔍 Current directory:', __dirname);
    console.log('📁 Loading .env from:', path.join(__dirname, '..', '..', '.env'));
    
    console.log('🔄 Connecting to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected successfully!');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📊 Collections in database:');
    if (collections.length === 0) {
      console.log('   No collections yet');
    } else {
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    // Count documents in each collection
    console.log('\n📈 Document counts:');
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`   - ${col.name}: ${count} documents`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();