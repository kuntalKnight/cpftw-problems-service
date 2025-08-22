import mongoose from 'mongoose';

const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/leetcode-backend';

async function connectToDatabase() {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Successfully");
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
  } catch (error) {
    console.error("❌ Error Connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

export default connectToDatabase;