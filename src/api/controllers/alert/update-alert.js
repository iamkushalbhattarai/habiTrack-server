import { errorHelper, getText, logger } from "../../../utils/index.js";

export const updateAlert = async (req, res) => {
  try {
    return res
      .status(410)
      .json({ resultMessage: "Endpoint no longer available" });
    // // validate the update request body
    // const { error } = validateUpdateHabitLog(req.body);
    // if (error) {
    //   logger("00206", req.user._id, error.message, "Error", req);
    //   return res.status(401).json(errorHelper("00206", req, error.message));
    // }

    // // verify the log already exists
    // const log = await HabitLog.findById(req.body._id);
    // if (!log) {
    //   logger("00207", req.user._id, error.message, "Error", req);
    //   return res.status(401).json(errorHelper("00207", req, error.message));
    // }

    // // TODO : verify the habit belongs to the user

    // // update the log
    // if (req.body.progress) log.progress = req.body.progress;
    // if (req.body.notes) log.notes = req.body.notes;

    // const result = await log.save().catch((error) => {
    //   logger("00208", req.user._id, error.message, "Error", req);
    //   res.status(401).json(errorHelper("00208", req, error.message));
    //   return null;
    // });
    // if (!result) return; // prematurely return if there was an error saving the data

    // // send back the response
    // logger("00200", req.user._id, getText("en", "00200"), "Info", req);
    // return res.status(200).json({
    //   resultMessage: {
    //     en: getText("en", "00200"),
    //   },
    //   resultCode: "00200",
    // });
  } catch (error) {
    logger("00171", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00171", req, error.message));
  }
};
