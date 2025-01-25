import { Router } from "express";

import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory
} from "../controllers/product.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();


router.route("/create")
.post(
    verifyJWT,
    upload.single("image"),
    createProduct
);
router.route("/all-products").get(getAllProducts);
router.route("/:productId")
    .delete(verifyJWT,deleteProduct)
    .get(getProductById);
// router.route("/delete/:productId").delete(deleteProduct);
// router.route("/product/:productId").get(getProductById);
router.route("/category/:category").get(getProductsByCategory);
router.route('/update-product/:productId').patch(
    verifyJWT,
    upload.single("image"),
    updateProduct)
export default router;