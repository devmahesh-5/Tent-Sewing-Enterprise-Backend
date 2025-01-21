import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    deleteUser,
    refreshAccessToken,
    updatePassword
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyJWT, logoutUser);
router.get('/myprofile', verifyJWT, getCurrentUser);
router.delete('/delete', verifyJWT, deleteUser);
router.post('/refresh-token', refreshAccessToken);
router.patch('/update-password', verifyJWT, updatePassword);
export default router;
