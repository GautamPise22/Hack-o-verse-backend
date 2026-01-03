require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("../config/db"); // Ensure this path is correct!

const app = express();

// Middleware 1: CORS & JSON
app.use(express.json());
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Middleware 2: Database Connection (The Fix)
// This ensures DB is connected BEFORE any route is hit
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
// Ensure these files exist at these specific paths
app.use("/api/analytics", require("../routes/analyticsRoutes"));
app.use("/api/auth", require("../routes/authRoutes"));
app.use("/api/inventory", require("../routes/inventoryRoutes"));

// Default Testing Route
app.get("/", (req, res) => {
    res.send("API is running on Vercel!");
});

module.exports = app;