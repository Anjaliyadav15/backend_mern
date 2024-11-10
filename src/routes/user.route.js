import { Router } from "express";
const router = Router();
import { logIn, signUp } from "../controllers/user.controller.js";


router.route("/signup").post(signUp)
router.route("/login").post(logIn)
export default router