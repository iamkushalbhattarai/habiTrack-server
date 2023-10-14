import Joi from "joi";

export function validateCreate(body) {
  const schema = Joi.object({
    name: Joi.string().required(),
    goal: Joi.number().required(),
    goalUnits: Joi.string()
      .required()
      .valid("times", "calories", "boolean", "hours", "minutes", "seconds"),
    repetition: Joi.string()
      .required()
      .valid("daily", "weekly", "monthly", "custom"),
    repetitionOccurrence: Joi.number(),
    isGood: Joi.boolean().default(true),
    color: Joi.string().default("gray"),
  });
  return schema.validate(body);
}

export function validateUpdates(body) {
  const schema = Joi.object({
    name: Joi.string().required(),
    goal: Joi.number().required(),
    repetition: Joi.string()
      .required()
      .valid("daily", "weekly", "monthly", "custom"),
    color: Joi.string().default("gray"),
  });
  return schema.validate(body);
}

export function validateCreateHabitAlert(body) {
  console.log(body);
  const schema = Joi.object({
    notificationId: Joi.number().required(),
    time: Joi.object({
      hour: Joi.number().max(24).min(0),
      minute: Joi.number().max(60).min(0),
    }),
  });

  return schema.validate(body);
}

export function validateCreateHabitLog(body) {
  const schema = Joi.object({
    habitId: Joi.string().hex().length(24),
    progress: Joi.number().required(),
    notes: Joi.string(),
    date: Joi.date().required(),
  });
  return schema.validate(body);
}

export function validateUpdateHabitLog(body) {
  const schema = Joi.object({
    _id: Joi.string().hex().length(24),
    habitId: Joi.string().hex().length(24),
    date: Joi.date(),
    progress: Joi.number(),
    notes: Joi.string(),
  });
  return schema.validate(body);
}

export function validateUpsertHabitLog(body) {
  const schema = Joi.object({
    habitId: Joi.string().hex().length(24).required(),
    date: Joi.date().required(),
    progress: Joi.number(),
    notes: Joi.string(),
  });
  return schema.validate(body);
}
