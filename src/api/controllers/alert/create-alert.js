import { Alert, Habit } from "../../../models/index.js";
import { capitalizeFirstLetter } from "../../../utils/helpers/capitalizeFirstLetter.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import * as habitValidator from "../../validators/habit.validator.js";

export const createAlert = async (req, res) => {
  try {
    // validate the request body
    const { error } = habitValidator.validateCreateHabitAlert(req.body);
    if (error) {
      logger("00605", req.user._id, error.message, "Error", req);
      // TODO : Limit the amount of data being disclosed to the outside
      return res.status(400).json(errorHelper("00605", req, error));
    }

    const { habitId } = req.params;
    const { repetition, notificationId, time } = req.body;
    const userId = req.user._id;

    // verify the habit log that is being created is for a user's habit
    const habit = await Habit.findOne({ _id: habitId, userId: userId });

    if (!habit) {
      logger("00635", req.user._id, getText("en", "00635"), "Error", req);
      // TODO : Limit the amount of data being disclosed to the outside
      return res.status(403).json(errorHelper("00635", req, error));
    }
    // generate title
    const title = capitalizeFirstLetter(habit.name);

    // generate text
    const texts = [
      "Time to Crush Your Goals! 🚀",
      "Stay on Track with Your Habits! 📅",
      "It's Habit O'Clock! 🌟",
      "Don't Break the Streak! 📈",
      "One Step Closer to Success! 🏆",
    ];
    const randomIndex = Math.round(Math.random() * (texts.length - 1));
    const text = texts[randomIndex];

    // just create the alert
    const alert = new Alert({
      userId,
      habitId,
      repetition,
      notificationId,
      text,
      title,
      time,
    });

    await alert.save();
    return res.status(200).json({
      resultMessage: { en: getText("en", "00180") },
      resultCode: "00180",
      data: alert,
    });
  } catch (error) {
    logger("00605", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00605", req, error.message));
  }
};
