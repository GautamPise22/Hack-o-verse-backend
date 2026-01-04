// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const MedicalShop = require("../models/MedicalShop"); 

const router = express.Router();

// REGISTER A NEW SHOP (Using Email)
router.post("/register", async (req, res) => {
    try {
        const { 
            email, password, // Login via Email
            shopName, shopId, ownerName, mobile, address, openingTime, closingTime 
        } = req.body;
        
        // Check if EMAIL or shopId already exists
        const existingUser = await MedicalShop.findOne({ $or: [{ email }, { shopId }] });
        if (existingUser) return res.status(400).json({ message: "Email or Shop ID already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newShop = new MedicalShop({
            email, // Saving email
            password: hashedPassword,
            shopName,
            shopId,
            ownerName,
            mobile,
            address,
            openingTime,
            closingTime,
            status: "active"
        });

        await newShop.save();
        res.status(201).json({ message: "Shop registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// LOGIN (Using Email)
router.post("/login", async (req, res) => {
    try {
        // Expect 'email' instead of 'username'
        const { email, password } = req.body;
        
        // Find user by EMAIL
        const user = await MedicalShop.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        // Send back shop details
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