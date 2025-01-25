import { Router } from "express";

import {
    createAchivement,
    getAllAchivements,
    getAchivementById,
    updateAchivement,
    deleteAchivement
} from "../controllers/achivement.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

router.route("/create")
.post(
    verifyJWT,
    upload.single("image"),
    createAchivement
);
router.route("/all-achivements").get(getAllAchivements);
router.route("/:achivementId")
    .delete(verifyJWT,deleteAchivement)
    .get(getAchivementById);
// router.route("/delete/:achivementId").delete(deleteAchivement);
// router.route("/achivement/:achivementId").get(getAchivementById);
router.route('/update-achivement/:achivementId').patch(
    verifyJWT,
    upload.single("image"),
    updateAchivement
)

export default router;