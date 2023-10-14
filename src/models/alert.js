import mongoose from "mongoose";
const { Schema, model } = mongoose;

const alertSchema = new Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    habitId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    notificationId: {
      type: Number,
      required: true,
    },
    time: {
      hour: { type: Number, required: true },
      minute: { type: Number, required: true },
    },
    text: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Alert = model("Alert", alertSchema);

alertSchema.method("findAlertsByHabit", function () {
  return Alert.find({ habitId: this._id });
});

export default Alert;

/**
 * @swagger
 * components:
 *   schemas:
 *     Habit:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         goal:
 *           type: number
 *         goalUnits:
 *           type: string
 *           enum: ["times", "calories", "boolean", "hours", "minutes", "seconds"]
 *         repetition:
 *           type: string
 *           enum: ['daily','weekly', 'monthly', 'custom']
 *         repetitionOccurrence:
 *           type: Number
 *         isGood:
 *           type: boolean
 */
