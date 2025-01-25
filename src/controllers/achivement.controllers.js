
import mongoose,{isValidObjectId} from "mongoose";
import {Achivement} from "../models/achivement.models.js";
import {ApiError} from "../utils/ApiError.js";
import {Apiresponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import uploadOnCloudinary, {deleteImageFromCloudinary} from "../utils/Cloudinary.js";

const createAchivement = asyncHandler(async (req, res) => { 
    try {
        const { title} = req.body;
        
        if(!title){
            throw new ApiError(400, "Title is required");
        }

        const achivementLocalFilePath = req.file?.path;
        if(!achivementLocalFilePath){
            throw new ApiError(400, "Achivement image is required");
        }

        const achivementCloudinaryPath = await uploadOnCloudinary(achivementLocalFilePath);

        if(!achivementCloudinaryPath){
            throw new ApiError(500, "Achivement image could not be uploaded");
        }

        const achivement = await Achivement.create(
            {
                title,
                image : achivementCloudinaryPath.url,
                owner : req.user?._id
            }
        )

        if(!achivement){
            throw new ApiError(500, "Achivement could not be created");
        }

        res
        .status(200)
        .json(
            new Apiresponse(200, achivement, "Achivement created successfully")
        )
        
    }catch (error) {
        throw new ApiError(500, "Achivement could not be created");
    }
})

const getAllAchivements = asyncHandler(async (req, res) => {
    try {
        const achivements = await Achivement.find();

        if(!achivements){
            throw new ApiError(500, "Achivements could not be fetched");
        }

        res
        .status(200)
        .json(
            new Apiresponse(200, achivements, "Achivements fetched successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Achivements could not be fetched");
    }
})

const getAchivementById = asyncHandler(async (req, res) => {
    try {
        const achivementId = req.params.achivementId;
        if(!isValidObjectId(achivementId)){
            throw new ApiError(400, "Invalid achivement id");
        }

        const achivement = await Achivement.findById(achivementId);

        if(!achivement){
            throw new ApiError(404, "Achivement not found");
        }

        res
        .status(200)
        .json(
            new Apiresponse(200, achivement, "Achivement fetched successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Achivement could not be fetched");
    }
})

const updateAchivement = asyncHandler(async (req, res) => {
    try {
        const achivementId = req.params.achivementId;
        const { title} = req.body;

        if(!title){
            throw new ApiError(400, "Title is required");
        }
        const achivementLocalFilePath = req.file?.path;
        const achivementCloudinaryPath = await uploadOnCloudinary(achivementLocalFilePath);

        if(!achivementCloudinaryPath){
            throw new ApiError(500, "Achivement image could not be uploaded");
        }

        if(!isValidObjectId(achivementId)){
            throw new ApiError(400, "Invalid achivement id");
        }

        const updatedAchivement = await Achivement.findByIdAndUpdate(achivementId,
             {
                $set : {
                    title,
                    image : achivementCloudinaryPath.url
                }
             },
             {
                new : true
             }
    )

        if(!updatedAchivement){
            throw new ApiError(500, "Achivement could not be updated");
        }

        res
        .status(200)
        .json(
            new Apiresponse(200, updatedAchivement, "Achivement updated successfully")
        )

    } catch (error) {
        throw new ApiError(500, "Achivement could not be updated");
    }
})

const deleteAchivement = asyncHandler(async (req, res) => {
    try {
        const achivementId = req.params.achivementId;
        if(!isValidObjectId(achivementId)){
            throw new ApiError(400, "Invalid achivement id");
        }

        const deletedAchivement = await Achivement.findByIdAndDelete(achivementId);

        if(!deletedAchivement){
            throw new ApiError(500, "Achivement could not be deleted");
        }

        res
        .status(200)
        .json(
            new Apiresponse(200, deletedAchivement, "Achivement deleted successfully")
        )
    } catch (error) {
        throw new ApiError(500, "Achivement could not be deleted");
    }
})

export {
    createAchivement,
    getAllAchivements,
    getAchivementById,
    updateAchivement,
    deleteAchivement
}