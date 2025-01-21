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

router.use(verifyJWT);

router.route("/create")
.post(
    upload.single("image"),
    createProduct
);
router.route("/all-products").get(getAllProducts);
router.route("/:productId").
    patch(
        upload.single("image"),
        updateProduct)
    .delete(deleteProduct)
    .get(getProductById);
// router.route("/delete/:productId").delete(deleteProduct);
// router.route("/product/:productId").get(getProductById);
router.route("/category/:category").get(getProductsByCategory);

export default router;