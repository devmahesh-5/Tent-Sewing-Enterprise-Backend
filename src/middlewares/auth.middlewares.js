   
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
const verifyJWT = asyncHandler(async (req, res, next) => {
   try {
    const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")//we send only a token in authorization header and that stores as Authorization: Bearer <token>
     if (!token) {
         return next(new ApiError(401, "Access token not found!"));
     }

     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

     if (!decodedToken) {
         throw new ApiError(401, "user authentication failed");
     }

     const user = await User.findById(decodedToken._id);
     req.user = user;
     next();
   } catch (error) {
        throw new ApiError(401, "user authentication failed");
   }
   
});

export {verifyJWT};