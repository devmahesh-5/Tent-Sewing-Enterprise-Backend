import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
    {
        fullName : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true
        },
        role : {
            type : String,
            default : "user"
        }
    },
    {
        timestamps : true
    }
);

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){ 
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn : process.env.REFRESH_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id : this._id,
            role : this.role,
            email : this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
    )
}
export const User=mongoose.model("User",userSchema);