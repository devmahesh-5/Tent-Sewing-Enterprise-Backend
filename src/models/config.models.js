import mongoose from "mongoose";

const configSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true
        },
        value: {
            type: String, // Can be a URL (like for QR code) or any other config value
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Config = mongoose.model("Config", configSchema);
