import dayjs from "dayjs";

import { errorHelper, getText, logger } from "../../../utils/index.js";
import { Habit, HabitLog } from "../../../models/index.js";
import { validateUpsertHabitLog } from "../../validators/habit.validator.js";
import { getMappedRepetition } from "../../../utils/helpers/map-helper.js";

export const upsertHabitLog = async (req, res) => {
  // requires date and habit id
  // query the habit using habitId and userId - verifies the habit belongs to the user
  try {
    // destructure the request body
    const { habitId, date, progress, notes } = req.body;

    // validate the update request body
    const { error } = validateUpsertHabitLog(req.body);
    if (error) {
      logger("00206", req.user._id, error.message, "Error", req);
      return res.status(401).json(errorHelper("00206", req, error.message));
    }

    // query the habit using habitId and userId
    const habit = await Habit.findOne({ _id: habitId, userId: req.user._id });
    if (!habit) {
      const message =
        "Habit queried either does not exist or does not belong to the user";
      logger("00209", req.user._id, message, "Error", req);
      return res.status(401).json(errorHelper("00209", req, message));
    }

    const repetition = getMappedRepetition(habit.repetition);
    const relativeDate = dayjs(date);
    const start = relativeDate.startOf(repetition);
    const end = relativeDate.endOf(repetition);

    // check if a habitLog already exists for the given date range
    // query for habit habitLog using the date range and habitId
    let habitLog = await HabitLog.findOne({
      date: {
        $lt: end,
        $gte: start,
      },
      habitId: habitId,
    }).exec();

    if (!habitLog) {
      // create a new habit habitLog if a habit habitLog is not found with the provided query params
      habitLog = new HabitLog({
        habitId,
        notes,
        progress,
        date: start, // start is being set as the date
        isDone: progress >= habit.goal,
      });
    } else {
      // update the existing habitLog
      if (progress) {
        habitLog.progress = progress;
        // set isDone property
        habitLog.isDone = habitLog.progress >= habit.goal;
      }
      if (req.body.notes) habitLog.notes = req.body.notes;
    }

    const result = await habitLog.save().catch((error) => {
      logger("00208", req.user._id, error.message, "Error", req);
      res.status(401).json(errorHelper("00208", req, error.message));
      return null;
    });
    if (!result) return; // prematurely return if there was an error saving the data

    // send back the response
    logger("00200", req.user._id, getText("en", "00200"), "Info", req);
    return res.status(200).json({
      resultMessage: {
        en: getText("en", "00200"),
        habitLog: habitLog.toJSON(),
      },
      resultCode: "00200",
    });
  } catch (error) {
    logger("00210", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00210", req, error.message));
  }
};
