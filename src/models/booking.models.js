import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending"
        },
        totalPrice: {
            type: Number,
            required: true
        },
        paymentProof: {
            type: String, // Cloudinary URL
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Booking = mongoose.model("Booking", bookingSchema);
