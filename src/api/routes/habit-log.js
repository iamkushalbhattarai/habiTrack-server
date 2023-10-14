import { Router } from "express";
import { auth } from "../middlewares/index.js";
import {
  getHabitLog,
  createHabitLog,
  updateHabitLog,
  upsertHabitLog,
} from "../controllers/habit-log/index.js";

const router = Router();

// CREATE
router.post("/", auth, createHabitLog);

// UPDATE
router.patch("/update", auth, updateHabitLog);
router.patch("/upsert", auth, upsertHabitLog);

// GET
router.get("/:period/:habitId", auth, getHabitLog);

export default router;
