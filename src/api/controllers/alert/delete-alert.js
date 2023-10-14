import { Alert } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";

export const deleteAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user._id;

    // since queried with both the id and userId the user is authorized
    const alert = await Alert.findOne({ _id: alertId, userId: userId });

    if (!alert) {
      // send the error response
      logger(
        "00635",
        req.user._id,
        "Couldn't find a alert with the provided ID",
        "Error",
        req
      );
      return res
        .status(401)
        .json(
          errorHelper(
            "00635",
            req,
            "Couldn't find a alert with the provided ID"
          )
        );
    }

    const result = await alert.delete();
    console.log("Successfully deleted the habit alert", result);

    return res.status(200).json({
      resultMessage: { en: getText("en", "00630") },
      resultCode: "00630",
      data: result,
    });
  } catch (error) {
    logger("00636", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00636", req, error.message));
  }
};
