import dayjs from "dayjs";

import { Habit, HabitLog } from "../../../models/index.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

export const getHabitSummary = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { reverseIndex = 0, date } = req.query;

    const habit = await Habit.findOne({ _id: habitId, userId: req.user._id });

    const repetition = habit.repetition;
    const handler = periodHandlers[repetition];

    const results = await handler(habitId, reverseIndex, date);
    logger("00450", req.user._id, getText("en", "00450"), "Info", req);

    return res.status(200).json({
      resultMessage: {
        en: getText("en", "00450"),
      },
      resultCode: "00450",
      summary: results,
    });
  } catch (error) {
    logger("00460", req.user._id, error.message, "Error", req);
    return res.status(500).json(errorHelper("00460", req, error.message));
  }
};

const weekHandler = async (habitId, reverseIndex, date) => {
  if (date) {
    reverseIndex = dayjs().diff(date, "week");
  }
  // get the week relative to the current date
  const relativeDate = dayjs().subtract(7 * reverseIndex, "days");
  const weekStartDate = relativeDate.startOf("week");
  const weekEndDate = relativeDate.endOf("week");

  // query for the logs within the provided time range
  const habitLogs = await HabitLog.where({
    date: { $lt: weekEndDate, $gte: weekStartDate },
    habitId: habitId,
  }).exec();

  return habitLogs.map((log) => {
    return {
      progress: log.progress,
      note: log.notes,
      date: dayjs(log.date).day(),
    };
  });
};

const monthHandler = async (habitId, reverseIndex, date) => {
  if (date) {
    reverseIndex = dayjs().diff(date, "month");
  }
  // get the week relative to the current date
  const relativeDate = dayjs().subtract(reverseIndex, "months");
  const monthStartDate = relativeDate.startOf("months");
  const monthEndDate = relativeDate.endOf("months");

  // query for the logs within the provided time range
  const habitLogs = await HabitLog.where({
    date: { $lt: monthEndDate, $gte: monthStartDate },
    habitId: habitId,
  }).exec();

  return habitLogs.map((log) => {
    return {
      progress: log.progress,
      note: log.notes,
      date: dayjs(log.date).week(),
    };
  });
};

const yearHandler = async (habitId, reverseIndex, date) => {
  if (date) {
    reverseIndex = dayjs().diff(date, "year");
  }
  // get the week relative to the current date
  const relativeDate = dayjs().subtract(reverseIndex, "years");
  const yearStartDate = relativeDate.startOf("year");
  const yearEndDate = relativeDate.endOf("year");

  // query for the logs within the provided time range
  const habitLogs = await HabitLog.where({
    date: { $lt: yearEndDate, $gte: yearStartDate },
    habitId: habitId,
  }).exec();

  return habitLogs.map((log) => {
    return {
      progress: log.progress,
      note: log.notes,
      date: dayjs(log.date).month(),
    };
  });
};

const periodHandlers = {
  daily: weekHandler,
  weekly: monthHandler,
  monthly: yearHandler,
};
