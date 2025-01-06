import express from "express";

import {
  createMeeting,
  getMeetings,
  getSummary,
} from "../controllers/meetassist.js";

const router = express.Router();

router.post("/createMeeting", createMeeting);
router.post("/getSummary", getSummary);
router.post("/getMeetings", getMeetings);

export default router;
