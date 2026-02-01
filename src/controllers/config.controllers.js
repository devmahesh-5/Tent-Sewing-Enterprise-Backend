import { Config } from "../models/config.models.js";
import { ApiError } from "../utils/ApiError.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";

const getQrCode = asyncHandler(async (req, res) => {
    const config = await Config.findOne({ key: "QR_CODE" });

    if (!config) {
        return res.status(200).json(
            new Apiresponse(200, { qrCode: null }, "QR Code not found")
        );
    }

    return res.status(200).json(
        new Apiresponse(200, { qrCode: config.value }, "QR Code fetched successfully")
    );
});

const updateQrCode = asyncHandler(async (req, res) => {
    console.log("updateQrCode called");
    console.log("req.file:", req.file);

    const qrCodeLocalPath = req.file?.path;

    if (!qrCodeLocalPath) {
        throw new ApiError(400, "QR Code image is required");
    }

    console.log("Uploading file from:", qrCodeLocalPath);
    const qrCode = await uploadOnCloudinary(qrCodeLocalPath);
    console.log("Cloudinary upload result:", qrCode);

    if (!qrCode) {
        throw new ApiError(400, "QR Code upload failed");
    }

    const config = await Config.findOneAndUpdate(
        { key: "QR_CODE" },
        { value: qrCode.url },
        { upsert: true, new: true }
    );

    return res.status(200).json(
        new Apiresponse(200, { qrCode: config.value }, "QR Code updated successfully")
    );
});

export { getQrCode, updateQrCode };
