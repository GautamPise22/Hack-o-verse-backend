const mongoose = require("mongoose");

// ✅ FIX 1: Define 'conn' variable globally here so it saves between requests
let conn = null;

const connectDB = async () => {
  // Check if we already have a connection
  if (conn && mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection");
    return conn;
  }

  try {
    // ✅ FIX 2: Connect and SAVE the result into 'conn'
    conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
    return conn;

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    // Do NOT exit process in Vercel/Serverless
  }
};

module.exports = connectDB;