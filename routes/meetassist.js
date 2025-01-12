import express from "express";

import {
  createMeeting,
  getMeeting,
  getMeetings,
  getSummary,
} from "../controllers/meetassist.js";

const router = express.Router();

router.post("/createMeeting", createMeeting);
router.post("/getMeeting", getMeeting);
router.post("/getMeetings", getMeetings);
router.post("/getSummary", getSummary);

export default router;
