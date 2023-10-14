import HabitLog from "../../../models/habit-log.js";
import { Habit } from "../../../models/index.js";
import { logger, errorHelper, getText } from "../../../utils/index.js";
import { validateUpdates } from "../../validators/habit.validator.js";

export const updateHabit = async (req, res) => {
  try {
    // validate the request body
    const { error } = validateUpdates(req.body);
    if (error) {
      logger("00126", req.user._id, error.message, "Error", req);
      return res.status(401).json(errorHelper("00126", req, error.message));
    }

    const { habitId } = req.params;

    if (!habitId) {
      const message = "Habit Id required";
      logger("00167", req.user._id, message, "Error", req);
      return res.status(401).json(errorHelper("00167", req, message));
    }

    const { name, goal, repetition, color } = req.body;

    // verify the habit already exists
    const habit = await Habit.findById(habitId);
    if (!habit) {
      const message = "No habit found for the provided Id";
      logger("00167", req.user._id, message, "Error", req);
      return res.status(401).json(errorHelper("00167", req, message));
    }

    // verify the user is authroized to update the habit fields
    const isUserHabit = habit.isUserHabit(req.user._id);
    if (isUserHabit) {
      const message = "User not authorized to perform the action";
      logger("00250", req.user._id, message, "Error", req);
      return res.status(401).json(errorHelper("00250", req, message));
    }

    // update the habit
    if (req.body?.name) habit.name = name;
    if (req.body?.goal) {
      habit.goal = goal;
      HabitLog.updateMany(
        {
          habitId: habitId,
          progress: {
            $gte: goal,
          },
        },
        { isDone: true }
      )
        .exec()
        .then(() => {
          console.log("habit logs updated successfully");
        });
      HabitLog.updateMany(
        {
          habitId: habitId,
          progress: {
            $lt: goal,
          },
        },
        { isDone: false }
      )
        .exec()
        .then(() => {
          console.log("habit logs updated successfully");
        });
    }
    if (req.body?.repetition) habit.repetition = repetition;
    if (req.body?.color) habit.color = color;
    const result = await habit.save().catch((error) => {
      logger("00127", req.user._id, error.message, "Error", req);
      res.status(401).json(errorHelper("00127", req, error.message));
      return null;
    });
    if (!result) return;

    // send the response
    logger("00120", req.user._id, getText("en", "00120"), "Info", req);
    return res.status(200).json({
      resultMessage: {
        en: getText("en", "00120"),
      },
      resultCode: "00120",
    });
  } catch (error) {
    logger("00125", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00125", req, error.message));
  }
};
