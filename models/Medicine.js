const mongoose = require("mongoose");

const subTextSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "sold", "damaged", "expired"],
            default: "active",
        },
    },
    { _id: false }
);

const medicineSchema = new mongoose.Schema(
    {
        medicine_name: { type: String, required: true },
        brand_name: { type: String, required: true },
        batch_number: { type: String, required: true },
        expiry_date: { type: Date, required: true },

        type: {
            type: String,
            enum: ["single", "strip"],
            required: true,
        },

        textCode: {
            type: String,
            unique: true,
            required: true,
        },

        subTextCodes: {
            type: [subTextSchema],
            default: [],
        },

        medical_shop_name: { type: String, default: "none" },
        medical_shop_id: { type: String, default: "none" },
        is_selled: { type: Boolean, default: false },
        selling_date_time: { type: Date, default: null },
        customer_name: { type: String, default: "none" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("medicine", medicineSchema);    