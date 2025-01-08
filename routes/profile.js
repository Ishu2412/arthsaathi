import express from "express";

import { getUser, updateUser } from "../controllers/profile.js";

const router = express.Router();

router.get("/user", getUser);
router.put("/updateUser", updateUser);

export default router;
