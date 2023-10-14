import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import { specs, swaggerConfig } from "../../config/index.js";
import user from "./user.js";
import habit from "./habit.js";
import habitLog from "./habit-log.js";
import alert from "./alert.js";

const router = Router();

const specDoc = swaggerJsdoc(swaggerConfig);

router.use(specs, serve);
router.get(specs, setup(specDoc, { explorer: true }));

router.use("/user", user);
router.use("/habit", habit);
router.use("/habit-log", habitLog);
router.use("/alert", alert);

export default router;
