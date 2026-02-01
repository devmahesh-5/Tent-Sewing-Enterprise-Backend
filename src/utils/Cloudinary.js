import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

// Upload file
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        console.log("Cloudinary config:", {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "NOT SET",
            api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET"
        });

        console.log("Attempting to upload file:", localFilePath);

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader
            .upload(localFilePath, {
                resource_type: 'auto',
            })
        //file uploaded successfully

        console.log("Upload successful:", uploadResult.secure_url);
        fs.unlinkSync(localFilePath)//remove the locally saved temporary file
        return uploadResult;

    } catch (error) {
        console.log("Cloudinary upload error details:", error.message);
        console.log("Full error:", error);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload got failed
        }
        return null;
    }
}

export const deleteImageFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;
        // Upload to Cloudinary
        const deleteResult = await cloudinary.uploader
            .destroy(publicId, {
                resource_type: 'image',
            })
        return deleteResult;

    } catch (error) {

        console.log("Cloudinary file deletion error::", error);
        return null;
    }
}

export default uploadOnCloudinary;