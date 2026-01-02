// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const MedicalShop = require("../models/MedicalShop"); // Import the new model

const router = express.Router();

// REGISTER A NEW SHOP (Updated with all fields)
router.post("/register", async (req, res) => {
    try {
        const { 
            username, password, // Login fields
            shopName, shopId, ownerName, mobile, address, openingTime, closingTime // Shop Details
        } = req.body;
        
        // Check if username or shopId already exists
        const existingUser = await MedicalShop.findOne({ $or: [{ username }, { shopId }] });
        if (existingUser) return res.status(400).json({ message: "Username or Shop ID already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newShop = new MedicalShop({
            username,
            password: hashedPassword,
            shopName,
            shopId, // Saving as shopId (camelCase)
            ownerName,
            mobile,
            address,
            openingTime,
            closingTime,
            status: "active" // Auto-activate for now
        });

        await newShop.save();
        res.status(201).json({ message: "Shop registered successfully in 'medicalshops' collection" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await MedicalShop.findOne({ username });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        // IMPORTANT: We send back 'shop_id' (snake_case) to match what your Frontend expects
        // even though database has 'shopId' (camelCase).
        res.json({ 
            success: true,
            message: "Login Successful", 
            shop_id: user.shopId, 
            shop_name: user.shopName 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;