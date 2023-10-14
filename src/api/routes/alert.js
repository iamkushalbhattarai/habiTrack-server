import { Router } from "express";
import { auth } from "../middlewares/index.js";
import {
  getHabitAlerts,
  getAllAlerts,
  updateAlert,
  deleteAlert,
  createAlert,
} from "../controllers/alert/index.js";

const router = Router();

// CREATE
router.post("/:habitId", auth, createAlert);

// UPDATE
router.patch("/update", auth, updateAlert);

// GET
router.get("/all", auth, getAllAlerts);
router.get("/:habitId", auth, getHabitAlerts);

// DELETE
router.delete("/:alertId", auth, deleteAlert);

export default router;
