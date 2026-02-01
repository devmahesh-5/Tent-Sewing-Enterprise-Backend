import { Router } from "express";
import { getQrCode, updateQrCode } from "../controllers/config.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js"; // You might want admin middleware here too
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/qr-code").get(getQrCode);

router.route("/qr-code").post(
    verifyJWT,
    upload.single("qrCode"),
    updateQrCode
);

export default router;
