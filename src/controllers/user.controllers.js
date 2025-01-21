import mongoose from "mongoose";
import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import options from '../constants.js';
const generateAccessAndRefreshToken = async function (userId) {
    if (!userId) {
        throw new ApiError(400, "User id is required");
    }
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    if (!accessToken || !refreshToken) {
        throw new ApiError(500, "Access and refresh token could not be generated");
    }
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, role } = req.body;
    if ([fullName, email, password, role].some((field) => {
        field.trim() == ""
    })) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne(
        {
            email
        }
    )

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create(
        {
            email,
            fullName,
            password,
            role
        }
    )

    const createdUser = await User.findById(user._id);

    if (!createdUser) {
        throw new ApiError(500, "User could not be created");
    }

    res
        .status(201)
        .json(
            new Apiresponse(201, createdUser, "User created successfully")
        )
})

const loginUser = asyncHandler(async (req, res) => {
    //Algorithm
    //get email and password from req.body
    //validate input
    //check if user exists
    //check if password is correct
    //generate tokens
    //send cookies

    const { email, password } = req.body;

    if ([email, password].some((field) => {
        field.trim() == ""
    })) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne(
        {
            email
        }
    )

    if (!user) {
        throw new ApiError(400, "User does not exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Password is incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new Apiresponse(200, { accessToken }, "User logged in successfully")
        )
})


const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(400, "User not loged in");
    }

    await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                refreshToken: null
            }
        },
        {
            new: true
        }
    )

    res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new Apiresponse(200, {}, "User logged out successfully")
        )
})


const getCurrentUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(400, "User not loged in");
    }
    res
        .status(200)
        .json(
            new Apiresponse(200, user, "User fetched in successfully")
        )
 })

const deleteUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(400, "User not loged in");
    }
    await User.findByIdAndDelete(user._id);
    res
        .status(200)
        .json(
            new Apiresponse(200, {}, "User deleted successfully")
        )
 })

const refreshAccessToken = asyncHandler(async (req, res) => {
    const receivedRefreshToken = req.cookies?.refreshToken;

    if (!receivedRefreshToken) {
        throw new ApiError(400, "Refresh token not found");
    }
    
    try {
        const decodedRefreshToken = jwt.verify(receivedRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        if(!decodedRefreshToken){
            throw new ApiError(500,"Error while decoding refresh token");
        }

        const user = await User.findById(decodedRefreshToken._id).select("-password");

        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

        if(!accessToken || !refreshToken){
            throw new ApiError(500, "refreshToken or accessToken failed to create");
        }
        
    } catch (error) {
        throw new ApiError(500, "something went wrong while refreshing access token");
    }

    res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new Apiresponse(201,{accessToken, refreshToken},"Access token refreshed successfully")
    )
})

const updatePassword = asyncHandler(async (req,res)=>{
    const user = req.user;
    if(!user){
        throw new ApiError(400, "User not loged in");
    }

    const {password, newPassword} = req.body;

    if(!password || !newPassword){
        throw new ApiError(400, "All fields are required");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(400, "Password is incorrect");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    res.status(200)
    .json(
        new Apiresponse(200,{user},"Password updated successfully")
    )
})

export { registerUser, loginUser, logoutUser, getCurrentUser, deleteUser, refreshAccessToken, updatePassword };