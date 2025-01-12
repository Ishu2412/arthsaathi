import { Meeting } from "../models/meeting.js";
import { groqSummary } from "../utils/llm.js";

export const createMeeting = async (req, res) => {
  try {
    const {
      email,
      participants = [],
      description,
      content = null,
      date = Date.now(),
      notes = null,
    } = req.body;

    const meeting = new Meeting({
      email,
      description,
      participants,
      date,
      content,
    });

    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    console.error(`Error creating meeting: ${error}`);
    res.status(500).send(`Internal server error: ${error}`);
  }
};

export const getSummary = async (req, res) => {
  try {
    const { email, content, language } = req.body;

    const meeting = await Meeting.findOne({ email: email });
    if (!meeting) {
      return res.status(404).send("Meeting not found");
    }
    meeting.content = content;
    await meeting.save();

    const summary = await groqSummary(content, language);
    console.log(summary);
    meeting.summary = summary;
    await meeting.save();
    res.status(200).json(meeting);
  } catch (error) {
    console.error(`Error getting summary: ${error}`);
    res.status(500).send(`Internal server error: ${error}`);
  }
};

export const getMeetings = async (req, res) => {
  try {
    const email = req.body.email;
    const meetings = await Meeting.find({ email: email });
    return res.status(200).json(meetings);
  } catch (error) {
    console.error(`Error getting meetings: ${error}`);
    res.status(500).send(`Internal server error: ${error}`);
  }
};
