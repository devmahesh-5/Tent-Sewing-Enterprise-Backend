import { Router } from "express";
import { createBooking, getUserBookings, getAllBookings, updateBookingStatus } from "../controllers/booking.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

// User routes
router.route("/create").post(
    verifyJWT,
    upload.single("paymentProof"),
    createBooking
);

router.route("/my-bookings").get(verifyJWT, getUserBookings);

// Admin routes
router.route("/all").get(verifyJWT, getAllBookings); // TODO: Add admin middleware
router.route("/:id/status").patch(verifyJWT, updateBookingStatus); // TODO: Add admin middleware

export default router;
