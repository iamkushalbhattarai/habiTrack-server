import { HabitLog } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import { validateUpdateHabitLog } from "../../validators/habit.validator.js";

export const updateHabitLog = async (req, res) => {
  try {
    // validate the update request body
    const { error } = validateUpdateHabitLog(req.body);
    if (error) {
      logger("00206", req.user._id, error.message, "Error", req);
      return res.status(401).json(errorHelper("00206", req, error.message));
    }

    let log;

    if (req.body._id) {
      // verify the log already exists
      log = await HabitLog.findById(req.body._id).populate("habit");
      const isUserLogNotFound = !log || log.habit.userId !== req.user._id;
      if (isUserLogNotFound) {
        logger("00209", req.user._id, error.message, "Error", req);
        return res.status(401).json(errorHelper("00209", req, error.message));
      }

      // update the log
      if (req.body.progress) {
        log.progress = req.body.progress;
        // set isDone property (habit is a virtual property)
        log.isDone = log.progress >= log.habit.goal;
      }

      if (req.body.notes) log.notes = req.body.notes;
    } else {
      // verify no habit exists for the given date and habitId

      // creates a new log if a habit id is not provided in the request body
      const { habitId, notes, progress, date } = req.body;
      log = new HabitLog({
        habitId,
        notes,
        progress,
        date,
        isDone: false,
      });
    }

    const result = await log.save().catch((error) => {
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
        warning:
          "Deprecated and will be removed in the future. Please use the upsert endpoint instead.",
        log: log.toJSON(),
      },
      resultCode: "00200",
    });
  } catch (error) {
    logger("00171", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00171", req, error.message));
  }
};
