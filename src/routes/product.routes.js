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

const router = Router();

router.use(verifyJWT);

router.route("/create").post(createProduct);
router.route("/all").get(getAllProducts);
router.route("/:productId").post(updateProduct).delete(deleteProduct).get(getProductById);
// router.route("/delete/:productId").delete(deleteProduct);
// router.route("/product/:productId").get(getProductById);
router.route("/category/:category").get(getProductsByCategory);

export default router;