import mongoose from "mongoose";

const achivementSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true
        },
        image : {
            type : String,
            required : true
        },
        owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
    }
);

export const Achivement=mongoose.model("Achivement",achivementSchema);