import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Debug: Log that we're attempting to connect
    console.log("🔄 Attempting to connect to MongoDB...");
    console.log("📍 MongoDB URI:", process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 30) + "..." : "NOT FOUND");
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Error:', err);
    });
    
    return true;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
