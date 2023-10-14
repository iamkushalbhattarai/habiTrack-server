import { Alert } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";

export const getAllAlerts = async (req, res) => {
  try {
    // since query is done with the user id authorization is already checked
    const alerts = await Alert.find({ userId: req.user._id });

    logger("00161", req.user._id, getText("en", "00161"), "Info", req);
    return res.status(200).json({
      resultMessage: { en: getText("en", "00161") },
      resultCode: "00161",
      data: alerts,
    });
  } catch (error) {
    logger("00168", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00168", req, error.message));
  }
};
