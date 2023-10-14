import Habit from "../../../models/habit.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

// /habit/all?date="date"
export const getAllHabits = async (req, res) => {
  try {
    // :date query param is optional
    const { date } = req.query;
    console.log("query value received by the habit/all route", req.query);

    // since query is done with the user id authorization is already checked
    const habits = await Habit.find({ userId: req.user._id });
    let returnValue = habits;

    if (date) {
      const tempLogs = habits.map((habit) => {
        return habit.findHabitLogByDate(date).then((habitLogs) => {
          console.log("habit log found", habitLogs, habit);
          return {
            ...habit?.toJSON?.(),
            log: habitLogs,
          };
        });
      });

      returnValue = await Promise.all(tempLogs);
    }

    logger("00161", req.user._id, getText("en", "00161"), "Info", req);
    return res.status(200).json({
      resultMessage: { en: getText("en", "00161") },
      resultCode: "00161",
      habits: returnValue,
    });
  } catch (error) {
    logger("00168", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00168", req, error.message));
  }
};
