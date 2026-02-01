import { Booking } from "../models/booking.models.js";
import { ApiError } from "../utils/ApiError.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";

const createBooking = asyncHandler(async (req, res) => {
    const { product, startDate, endDate, totalPrice } = req.body;
    const userId = req.user._id;

    console.log("Create booking request:", { product, startDate, endDate, totalPrice, userId });

    if (!product || !startDate || !endDate || !totalPrice) {
        throw new ApiError(400, "All fields are required");
    }

    const paymentProofLocalPath = req.file?.path;
    if (!paymentProofLocalPath) {
        throw new ApiError(400, "Payment proof is required");
    }

    const paymentProof = await uploadOnCloudinary(paymentProofLocalPath);
    if (!paymentProof) {
        throw new ApiError(400, "Payment proof upload failed");
    }

    const booking = await Booking.create({
        user: userId,
        product,
        startDate,
        endDate,
        totalPrice,
        paymentProof: paymentProof.url,
        status: "pending"
    });

    return res.status(201).json(
        new Apiresponse(201, booking, "Booking created successfully")
    );
});

const getUserBookings = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const bookings = await Booking.find({ user: userId })
        .populate("product")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new Apiresponse(200, bookings, "User bookings fetched successfully")
    );
});

// Admin: Get all bookings
const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find()
        .populate("product", "title price image")
        .populate("user", "fullName email phoneNumber")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new Apiresponse(200, bookings, "All bookings fetched successfully")
    );
});

// Admin: Update booking status
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const booking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    ).populate("product").populate("user", "fullName email phoneNumber");

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    return res.status(200).json(
        new Apiresponse(200, booking, "Booking status updated successfully")
    );
});

export { createBooking, getUserBookings, getAllBookings, updateBookingStatus };
