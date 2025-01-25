import mongoose,{isValidObjectId} from "mongoose";
import {Product} from "../models/product.models.js";
import {ApiError} from "../utils/ApiError.js";
import {Apiresponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import uploadOnCloudinary, {deleteImageFromCloudinary} from "../utils/Cloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
    const { title, description, price, category,status } = req.body;
    
    if ([title, description, price, category,status].some((field) => {
        field.trim() == ""
    })) {
        throw new ApiError(400, "All fields are required")
    }
   
    
    const productLocalFilePath = req.file.path;
    // console.log(productLocalFilePath);
    
    if(!productLocalFilePath){
        throw new ApiError(400, "Product image is required");
    }

    const productCloudinaryPath = await uploadOnCloudinary(productLocalFilePath);

    if(!productCloudinaryPath){
        throw new ApiError(500, "Product image upload failed");
    }

    

    const product = await Product.create(
        {
            title,
            description,
            price,
            category,
            owner: req.user?._id,
            image: productCloudinaryPath.url,
            status
        }
    )

    const createdProduct = await Product.findById(product._id);

    if(!createdProduct){
        throw new ApiError(500, "Product could not be created");
    }

    res
    .status(200)
    .json(
        new Apiresponse(200, createdProduct, "Product created successfully")
    )
})

const getAllProducts = asyncHandler(async (req, res) => {
    const allProducts = await Product.find();

    if(!allProducts){
        throw new ApiError(500, "Products could not be fetched");
    }

    res
    .status(200)
    .json(
        new Apiresponse(200, allProducts, "Products fetched successfully")
    )
})

const updateProduct = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const { title, description, price, category, status } = req.body;
    const productLocalFilePath = req.file?.path;
   // console.log(productLocalFilePath, title, description, price, category);
    
    if ([title, description, price, category,status, productLocalFilePath].some((field) => {
        field && field?.trim() == ""
    })) {
        throw new ApiError(400, "All fields are required")
    }
    

    if(!isValidObjectId(productId)){
        throw new ApiError(400, "Invalid product id");
    }
   
    const product = await Product.findById(productId);

    if(!product){
        throw new ApiError(400, "Product does not exist");
    }
    if(product.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400, "You are not authorized to update this product");
    }
    const productCloudinaryPath = uploadOnCloudinary(productLocalFilePath);
    const oldproductCloudinarypath = product.image;
    const oldproductCloudinarypathPublicId = oldproductCloudinarypath.split('/').pop().split('.')[0];
    if(!productCloudinaryPath){
        throw new ApiError(500, "Product image upload failed");
    }

   
    await deleteImageFromCloudinary(oldproductCloudinarypathPublicId);

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                title,
                description,
                price,
                category,
                image: productCloudinaryPath.url
            }
        },
        {
            new: true
        }
    )

    if(!updatedProduct){
        throw new ApiError(500, "Product could not be updated");
    }

    res
    .status(200)
    .json(
        new Apiresponse(200, updatedProduct, "Product updated successfully")
    )

})

const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    if(!isValidObjectId(productId)){
        throw new ApiError(400, "Invalid product id");
    }

    const product = await Product.findById(productId);

    if(!product){
        throw new ApiError(400, "Product does not exist");
    }

    if(product.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400, "You are not authorized to delete this product");
    }

    const oldproductCloudinarypath = product.image;
    const oldproductCloudinarypathPublicId = oldproductCloudinarypath.split('/').pop().split('.')[0];

    await deleteImageFromCloudinary(oldproductCloudinarypathPublicId);

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if(!deletedProduct){
        throw new ApiError(500, "Product could not be deleted");
    }

    res
    .status(200)
    .json(
        new Apiresponse(200, deletedProduct, "Product deleted successfully")
    )
})

const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    if(!isValidObjectId(productId)){
        throw new ApiError(400, "Invalid product id");
    }
    
    
    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(400, "Product does not exist");
    }
    
    res
    .status(200)
    .json(
        new Apiresponse(200, product, "Product fetched successfully")
    )
})

const getProductsByCategory = asyncHandler(async (req, res) => {
    const category = req.params.category;
    const product = await Product.find({category});
    console.log(product, category);
    
    if(!product || product.length === 0){
        throw new ApiError(400, "Product does not exist");
    }
    res
    .status(200)
    .json(
        new Apiresponse(200, product, "Product fetched successfully")
    )
})

export { createProduct, getAllProducts, updateProduct, deleteProduct, getProductById, getProductsByCategory }