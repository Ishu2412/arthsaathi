import express from "express";

import { getUser, updateUser } from "../controllers/profile.js";

const router = express.Router();

router.post("/user", getUser);
router.put("/updateUser", updateUser);

export default router;
