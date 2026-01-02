const express = require("express");
const Medicine = require("../models/Medicine");
const router = express.Router();

// 1. GET DASHBOARD STATS
// Usage: GET /api/inventory/stats/SHOP_123
router.get("/stats/:shop_id", async (req, res) => {
    try {
        const shopId = req.params.shop_id;

        // Fetch all medicines assigned to this specific shop
        const allMedicines = await Medicine.find({ medical_shop_id: shopId });

        let totalMedicinesReceived = allMedicines.length;
        let totalPillsSold = 0;
        let totalPillsRemaining = 0;

        allMedicines.forEach((med) => {
            if (med.type === "strip") {
                // For strips, check individual pills in subTextCodes
                med.subTextCodes.forEach(pill => {
                    if (pill.status === "sold") totalPillsSold++;
                    if (pill.status === "active") totalPillsRemaining++;
                });
            } else {
                // For singles, check the main selling status
                if (med.is_selled) totalPillsSold++;
                else totalPillsRemaining++;
            }
        });

        res.json({
            totalMedicinesReceived,
            totalPillsSold,
            totalPillsRemaining
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. GET ALL MEDICINES (Inventory Table)
// Usage: GET /api/inventory/view/SHOP_123
router.get("/view/:shop_id", async (req, res) => {
    try {
        const shopId = req.params.shop_id;
        
        // Only return medicines that belong to this shop
        const medicines = await Medicine.find({ medical_shop_id: shopId });
        
        if (medicines.length === 0) {
            return res.json({ message: "No medicines found for this shop." });
        }

        res.json(medicines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. SELL A MEDICINE
// Usage: POST /api/inventory/sell
router.post("/sell", async (req, res) => {
    try {
        const { shop_id, textCode, subCode, customer_name } = req.body; 

        if(!shop_id) return res.status(400).json({ message: "Shop ID is required" });

        // Find medicine that matches the textCode AND the shop_id
        const medicine = await Medicine.findOne({ textCode, medical_shop_id: shop_id });
        
        if (!medicine) return res.status(404).json({ message: "Medicine not found in this shop" });

        if (subCode) {
            // Logic: Sell a specific pill from a strip
            const subItem = medicine.subTextCodes.find(s => s.code === subCode);
            if (subItem) {
                if(subItem.status === "sold") {
                     return res.status(400).json({ message: "This pill is already sold" });
                }
                subItem.status = "sold";
                medicine.selling_date_time = new Date();
                medicine.customer_name = customer_name || "Unknown";
                await medicine.save();
                return res.json({ message: `Pill ${subCode} sold successfully` });
            } else {
                return res.status(404).json({ message: "Sub-code not found on this strip" });
            }
        } else {
            // Logic: Sell the whole unit (single type)
            if(medicine.is_selled) {
                return res.status(400).json({ message: "This medicine is already sold" });
            }
            medicine.is_selled = true;
            medicine.selling_date_time = new Date();
            medicine.customer_name = customer_name || "Unknown";
            await medicine.save();
            return res.json({ message: "Medicine marked as sold" });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;