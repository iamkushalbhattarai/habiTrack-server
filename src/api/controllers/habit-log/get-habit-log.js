import HabitLog from "../../../models/habit-log.js";
import Habit from "../../../models/habit.js";
import { errorHelper, logger } from "../../../utils/index.js";
import dayjs from "dayjs";

// /habit-log/habit/:period/:habitId
export const getHabitLog = async (req, res) => {
  const allowedHandlers = ["day", "week", "month", "year", "habit"];

  try {
    // TODO : validate the handler keys

    // verify the habit log being retrieved belongs to the user
    // Habit.isUserHabit()

    const { habitId, period } = req.params;

    const logs = periodHandlers?.[period]?.(habitId);

    logger("00240", req.user._id, getText("en", "00240"), "Info", req);
    return res.status(200).json({
      resultMessage: {
        en: getText("en", "0000123"),
      },
      resultCode: "00240",
      data: logs,
    });
  } catch (error) {
    logger("00245", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00245", req, error.message));
  }
};

const habitHandler = async (habitId) => {
  // verify the habit exists
  const habit = Habit.exists(habitId);

  if (!habit) {
    throw new Error("Habit does not exist with the provided Id");
  }
  // get all the habit logs that are relevant to the habit
  return await HabitLog.find({ habitId: habitId }).exec();
};

const dayHandler = async (reverseIndex) => {
  const date = dayjs().subtract(reverseIndex);
  const dayStart = date.startOf("day");
  const dayEnd = date.endOf("day");

  // query for the logs within the provided time range
  const habitLogs = await HabitLog.where({
    date: { $lt: dayEnd, $gte: dayStart },
  }).exec();

  return habitLogs;
};

const weekHandler = async (reverseIndex) => {
  // get the week relative to the current date
  const relativeDate = dayjs().subtract(7 * reverseIndex, "days");
  const weekStartDate = relativeDate.startOf("week");
  const weekEndDate = relativeDate.endOf("week");

  // query for the logs within the provided time range
  const habitLogs = await HabitLog.where({
    date: { $lt: weekEndDate, $gte: weekStartDate },
  }).exec();

  return habitLogs;
};

const monthHandler = async () => {
  // get the week relative to the current date
  const relativeDate = dayjs().subtract(reverseIndex, "months");
  const monthStartDate = relativeDate.startOf("months");
  const monthEndDate = relativeDate.endOf("months");

  // query for the logs within the provided time range
  const habitLogs = await HabitLog.where({
    date: { $lt: monthEndDate, $gte: monthStartDate },
  }).exec();

  return habitLogs;
};

const yearHandler = async () => {
  // get the week relative to the current date
  const relativeDate = dayjs().subtract(reverseIndex, "years");
  const yearStartDate = relativeDate.startOf("year");
  const yearEndDate = relativeDate.endOf("year");

  // query for the logs within the provided time range
  const habitLogs = await HabitLog.where({
    date: { $lt: yearEndDate, $gte: yearStartDate },
  }).exec();

  return habitLogs;
};

const periodHandlers = {
  habit: habitHandler,
  day: dayHandler,
  week: weekHandler,
  month: monthHandler,
  year: yearHandler,
};
