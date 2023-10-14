import mongoose from "mongoose";
import { Habit } from "./index.js";
const { Schema, model } = mongoose;

const habitLogSchema = new Schema(
  {
    habitId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    notes: {
      type: String,
    },
    progress: {
      type: Number,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    date: {
      type: mongoose.SchemaTypes.Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

habitLogSchema.virtual("habit", {
  ref: "Habit",
  localField: "habitId",
  foreignField: "_id",
  justOne: true,
});

habitLogSchema.method("isUserHabit", async function (userId) {
  const habit = Habit.find(this.habitId);
  return habit.isUserHabit(userId);
});

const HabitLog = model("HabitLog", habitLogSchema);
export default HabitLog;

/**
 * @swagger
 * components:
 *   schemas:
 *     HabitLog:
 *       type: object
 *       properties:
 *         habitId:
 *           type: string
 *         note:
 *           type: string
 *         progress:
 *           type: number
 *         date:
 *           type: string
 */
