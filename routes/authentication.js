import express from "express";

import { login, sendOTP, signup } from "../controllers/authentication.js";

const router = express.Router();

router.post("/sendOTP", sendOTP);
router.post("/signup", signup);
router.post("/login", login);

export default router;
