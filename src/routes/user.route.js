import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
const router = Router();
router.route("/register").post(registerUser) // post request and which controller to be called

// router.route("/login").post(logIn)
export default router