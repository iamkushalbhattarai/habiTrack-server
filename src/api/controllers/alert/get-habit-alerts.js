import { Alert } from "../../../models/index.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

// /habit-log/habit/:period/:habitId
export const getHabitAlerts = async (req, res) => {
  try {
    const { habitId } = req.params;
    // since queried with the user id, authorization is also taken care of
    const alerts = await Alert.find({ habitId: habitId, userId: req.user._id });
    if (!alerts) {
      const errorMessage = "No alert found with the provided id for the user";
      logger("00246", req.user._id, errorMessage, "Error", req);
      return res.status(404).json(errorHelper("00246", req, errorMessage));
    }

    logger("00240", req.user._id, getText("en", "00240"), "Info", req);
    return res.status(200).json({
      resultMessage: {
        en: getText("en", "0000123"),
      },
      resultCode: "00240",
      data: alerts,
    });
  } catch (error) {
    logger("00245", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00245", req, error.message));
  }
};
