
import mongoose from "mongoose";

const DB_USER = "admin";   // Change if you used a different username
const DB_PASS = "secret";  // Change if you used a different password
const DB_NAME = "test";    // Default database (change if needed)

// Connection URI (for Docker container)
const MONGO_URI = `mongodb://${DB_USER}:${DB_PASS}@localhost:27017/${DB_NAME}?authSource=admin`;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log("🚀 MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}

export default connectDB;
