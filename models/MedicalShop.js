// models/MedicalShop.js
const mongoose = require("mongoose");

const medicalShopSchema = new mongoose.Schema({
    // Shop Details
    shopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    
    // Identifiers
    shopId: { type: String, required: true, unique: true }, 
    status: { type: String, default: "pending" },

    // LOGIN FIELDS (Changed from Username to Email)
    email: { type: String, required: true, unique: true }, // Login ID
    password: { type: String, required: true }
}, { 
    collection: 'medicalshops', 
    timestamps: true 
});

module.exports = mongoose.model("MedicalShop", medicalShopSchema);