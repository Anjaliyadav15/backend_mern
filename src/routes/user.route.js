import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { uploadMiddleWare } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(uploadMiddleWare, registerUser);

router.route("/login").post(loginUser);
//secured routes
// router.route("/logout").post(verifyJWT, logoutUser);
export default router;
