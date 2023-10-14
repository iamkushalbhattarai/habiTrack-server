import Habit from "../../../models/habit.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

export const getHabit = async (req, res) => {
  try {
    const { date } = req.query;
    const { habitId } = req.params;

    if (!habitId) {
      logger("00166", req.user._id, getText("en", "00166"), "Error", req);
      return res
        .status(400)
        .json(
          errorHelper(
            "00166",
            req,
            "Malformed url. HabitId is required in the url"
          )
        );
    }

    // verify whether the habit exists
    let habit = await Habit.findById(habitId);
    if (!habit) {
      logger("00167", req.user._id, getText("en", "00167"), "Error", req);
      // TODO : Limit the amount of data being disclosed to the outside
      return res
        .status(404)
        .json(
          errorHelper("00167", req, "Habit not found with the provided id")
        );
    }

    if (date) {
      const logs = await habit.findHabitLogByDate(date);

      habit = { ...habit.toJSON(), logs };
    }

    return res.status(200).json({
      resultMessage: { en: getText("en", "00160") },
      resultCode: "00160",
      habit,
    });
  } catch (error) {
    logger("00165", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00165", req, error.message));
  }
};
