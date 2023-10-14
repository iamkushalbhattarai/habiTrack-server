import HabitLog from "../../../models/habit-log.js";
import { Habit } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import * as habitValidator from "../../validators/habit.validator.js";

export const createHabitLog = async (req, res) => {
  try {
    // validate the request body
    const { error } = habitValidator.validateCreateHabitLog(req.body);
    if (error) {
      logger("00100", req.user._id, error.message, "Error", req);
      // TODO : Limit the amount of data being disclosed to the outside
      return res.status(400).json(errorHelper("00100", req, error));
    }

    const { habitId, notes, progress, date } = req.body;

    // verify the habit log that is being created is for a user's habit
    const habit = await Habit.find({ _id: habitId, userId: req.user._id });

    if (!habit) {
      logger("00250", req.user._id, getText("en", "00250"), "Error", req);
      // TODO : Limit the amount of data being disclosed to the outside
      return res.status(403).json(errorHelper("00250", req, error));
    }

    // just create the habit
    const habitLog = new HabitLog({
      habitId,
      notes,
      progress,
      date,
    });

    await habitLog.save();
    return res.status(200).json({
      resultMessage: { en: getText("en", "00180") },
      resultCode: "00180",
      data: habitLog,
    });
  } catch (error) {
    logger("00185", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00185", req, error.message));
  }
};
