// models/MedicalShop.js
const mongoose = require("mongoose");

const medicalShopSchema = new mongoose.Schema({
    // Fields matching your friend's existing structure
    shopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    
    // Using 'shopId' (camelCase) to match your screenshot
    shopId: { type: String, required: true, unique: true }, 
    
    status: { type: String, default: "pending" },

    // NEW FIELDS we are adding for Login
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { 
    collection: 'medicalshops', // Forces Mongoose to use your friend's collection
    timestamps: true 
});

module.exports = mongoose.model("MedicalShop", medicalShopSchema);