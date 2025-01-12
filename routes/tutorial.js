import express from "express";

import { createTutorial, generateTutorial } from "../controllers/tutorial.js";

const router = express.Router();

router.post("/createTutorial", createTutorial);
router.post("/generateTutorial", generateTutorial);

export default router;
