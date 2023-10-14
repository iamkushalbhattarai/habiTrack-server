import { errorHelper, getText, logger } from "../../../utils/index.js";
import * as habitValidator from "../../validators/habit.validator.js";
import { Habit } from "../../../models/index.js";

export const createHabit = async (req, res) => {
  try {
    // validate the request body
    const { error } = habitValidator.validateCreate(req.body);
    if (error) {
      logger("00100", req.user._id, error.message, "Error", req);
      // TODO : Limit the amount of data being disclosed to the outside
      return res.status(400).json(errorHelper("00400", req, error));
    }

    const {
      name,
      goal,
      goalUnits,
      repetition,
      repetitionOccurrence,
      isGood,
      color,
    } = req.body;

    // just create the habit
    const habit = new Habit({
      userId: req.user._id,
      name: name,
      goal: goal,
      goalUnits: goalUnits,
      repetition: repetition,
      repetitionOccurrence: repetitionOccurrence,
      isGood: isGood,
      color: color,
    });

    await habit.save();
    return res.status(200).json({
      resultMessage: { en: getText("en", "00100") },
      resultCode: "00100",
      habit,
    });
  } catch (error) {
    logger("00105", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00105", req, error.message));
  }
};
