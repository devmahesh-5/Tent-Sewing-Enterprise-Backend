import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        image : {
            type : String,
            required : true
        },
        category : {
            type : String,
            required : true
        },
        owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
        status : {
            type : String,
            default : "available"
        }
    },
    {
    }
);

export const Product = mongoose.model("Product",productSchema);