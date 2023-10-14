import { Router } from "express";
import { auth } from "../middlewares/index.js";
import {
  createHabit,
  deleteHabit,
  updateHabit,
  getHabit,
  getAllHabits,
  getHabitSummary,
} from "../controllers/habit/index.js";

const router = Router();

// CREATE
router.post("/", auth, createHabit);

// DELETE
router.delete("/delete", auth, deleteHabit);

// UPDATE
router.patch("/:habitId", auth, updateHabit);

// GET
router.get("/all", auth, getAllHabits);
router.get("/:habitId", auth, getHabit);
router.get("/summary/:habitId", auth, getHabitSummary);

export default router;
