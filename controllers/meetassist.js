import { llmGenerator } from "../utils/llm.js";
import { Meeting } from "../models/meeting.js";

export const createMeeting = async (req, res) => {
  try {
    const {
      email,
      participants = [],
      description,
      content = null,
      notes = null,
    } = req.body;

    const meeting = new Meeting({
      email,
      description,
      participants,
      content,
    });

    await meeting.save();
    res.status(201).json(meeting);
  } catch (error) {
    console.error(`Error creating meeting: ${error}`);
    res.status(500).send("Internal server error");
  }
};

export const getSummary = async (req, res) => {
  try {
    const { email, content } = req.body;

    const meeting = await Meeting.findOne({ email: email });
    if (!meeting) {
      return res.status(404).send("Meeting not found");
    }
    meeting.content = content;
    await meeting.save();
    const summary = await llmGenerator(
      `A two line summary of the meeting in plain text without using spacial characters. Here is the content: ${content}.`
    );
    meeting.summary = summary;
    await meeting.save();
    res.status(200).json(meeting);
  } catch (error) {
    console.error(`Error getting summary: ${error}`);
    res.status(500).send("Internal server error");
  }
};

export const getMeetings = async (req, res) => {
  try {
    const email = req.body.email;
    return res.status(200).json(await Meeting.findAll({ email: email }));
  } catch (error) {
    console.error(`Error getting meetings: ${error}`);
    res.status(500).send("Internal server error");
  }
};
