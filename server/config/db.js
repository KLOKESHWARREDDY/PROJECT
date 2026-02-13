const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('Attempting MongoDB Atlas connection...');
  
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
  
  if (!mongoUri) {
    console.error('❌ MONGO_URI/MONGO_URL not found in environment variables');
    return null;
  }

  console.log('🔗 Connecting to MongoDB Atlas...');

  try {
    // Connection options for Mongoose v7+
    // family: 4 - Force IPv4 to avoid IPv6 DNS issues
    // serverSelectionTimeoutMS: 5000 - 5 second timeout for server selection
    const options = {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    };

    // Connect to MongoDB Atlas
    const conn = await mongoose.connect(mongoUri, options);
    
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log('   Host:', conn.connection.host);
    console.log('   Database:', conn.connection.name);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Atlas Connection Failed:');
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('🔧 Possible causes:');
      console.error('   1. Check Atlas Network Access settings (allow IP 0.0.0.0/0)');
      console.error('   2. Verify Atlas database user credentials');
      console.error('   3. IPv4 forced with family: 4 option');
    }
    
    if (error.message.includes('querySrv')) {
      console.error('🔧 SRV record resolution issue - IPv4 forced');
    }
    
    // Return null to allow server to start without DB
    return null;
  }
};

module.exports = connectDB;
