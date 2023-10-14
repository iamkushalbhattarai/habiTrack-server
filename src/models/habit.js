import mongoose from "mongoose";
import HabitLog from "./habit-log.js";
import dayjs from "dayjs";
import { getMappedRepetition } from "../utils/helpers/map-helper.js";
const { Schema, model } = mongoose;

const habitSchema = new Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    goal: {
      type: Number,
      required: true,
    },
    goalUnits: {
      type: String,
      required: true,
      enum: ["times", "calories", "boolean", "hours", "minutes", "seconds"],
    },
    repetition: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "monthly", "custom"],
    },
    repetitionOccurrence: {
      type: Number,
    },
    isGood: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: "gray",
    },
  },
  {
    timestamps: true,
  }
);

habitSchema.method("findHabitLogs", function () {
  return HabitLog.find({ habitId: this._id });
});

habitSchema.method("findHabitLogByDate", function (date) {
  const dateString = date;
  const dateSplit = dateString.split("-");
  const parsedDate = dayjs()
    .year(+dateSplit[0])
    .month(+dateSplit[1] - 1)
    .date(+dateSplit[2]);
  const repetition = getMappedRepetition(this.repetition);
  const start = dayjs(parsedDate).utcOffset(0).startOf(repetition);
  const end = dayjs(parsedDate).utcOffset(0).endOf(repetition);
  return HabitLog.find({ habitId: this._id, date: { $lt: end, $gte: start } });
});

habitSchema.method("isUserHabit", function (userId) {
  return this.userId == userId;
});

const Habit = model("Habit", habitSchema);

export default Habit;

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
