const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");

// GET /api/analytics/sales/:shop_id
router.get("/sales/:shop_id", async (req, res) => {
    try {
        const { shop_id } = req.params;
        const { range, startDate, endDate } = req.query;

        if (!shop_id) return res.status(400).json({ message: "Shop ID is required" });

        let matchStage = { shopId: shop_id };
        let groupBy = {};
        let sortStage = { "_id": 1 }; // Sort by date ascending

        const now = new Date();

        // 1. Determine Date Filter & Grouping Logic
        if (range === 'daily') {
            // Last 30 days
            const start = new Date();
            start.setDate(now.getDate() - 30);
            matchStage.date = { $gte: start };
            
            groupBy = {
                $dateToString: { format: "%Y-%m-%d", date: "$date" }
            };
        } 
        else if (range === 'monthly') {
            // Last 12 months
            const start = new Date();
            start.setMonth(now.getMonth() - 11);
            matchStage.date = { $gte: start };

            groupBy = {
                $dateToString: { format: "%Y-%m", date: "$date" }
            };
        } 
        else if (range === 'yearly') {
            // Last 5 years
            const start = new Date();
            start.setFullYear(now.getFullYear() - 5);
            matchStage.date = { $gte: start };

            groupBy = {
                $dateToString: { format: "%Y", date: "$date" }
            };
        }
        else if (range === 'custom' && startDate && endDate) {
            matchStage.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
            groupBy = {
                $dateToString: { format: "%Y-%m-%d", date: "$date" }
            };
        }

        // 2. Aggregation Pipeline
        const salesData = await Order.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: groupBy,
                    totalSales: { $sum: "$soldItemsCount" }, 
                    totalOrders: { $sum: 1 } 
                }
            },
            { $sort: sortStage }
        ]);

        // 3. Format data for Frontend
        const formattedData = salesData.map(item => ({
            date: item._id,
            sales: item.totalSales,
            orders: item.totalOrders
        }));

        res.json(formattedData);

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
});

module.exports = router;