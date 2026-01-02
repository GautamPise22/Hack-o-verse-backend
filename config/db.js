const mongoose = require("mongoose");

let isConnected = false; // Track connection status

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options are default in newer Mongoose versions but good to be safe
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        isConnected = conn.connections[0].readyState;
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        // Do not process.exit(1) in serverless, or it crashes the function
    }
};

module.exports = connectDB;