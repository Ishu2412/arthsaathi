import express from "express";

import { getUser } from "../controllers/profile.js";

const router = express.Router();

router.post("/user", getUser);

export default router;
