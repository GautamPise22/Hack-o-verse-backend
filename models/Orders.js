const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shopId: {
    type: String, 
    required: true,
    index: true // Optimization: Makes fetching analytics for a specific shop faster
  },
  customerName: {
    type: String,
    required: true
  },
  customerMobile: {
    type: String,
    required: true
  },
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medicine", // Connects this order to the Medicine model
    required: true
  },
  medicineName: {
    type: String,
    required: true
  },
  // Stores how many units (pills or strips) were sold in this transaction
  soldItemsCount: {
    type: Number,
    required: true,
    default: 1
  },
  // If selling specific pills from a strip, we store their codes here (e.g., ["A1", "A2"])
  soldSubCodes: {
    type: [String],
    default: []
  },
  date: {
    type: Date,
    default: Date.now,
    index: true // Optimization: Makes date-range filtering (Daily/Monthly) faster
  }
});

module.exports = mongoose.model("Order", orderSchema);