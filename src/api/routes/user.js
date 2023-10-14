import { Router } from "express";
import { auth, imageUpload } from "../middlewares/index.js";
import {
  changePassword,
  deleteUser,
  editUser,
  forgotPassword,
  getUser,
  login,
  logout,
  refreshToken,
  register,
  sendVerificationCode,
  verifyEmail,
} from "../controllers/user/index.js";

const router = Router();

// AUTH
router.post("/", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/verify-email", verifyEmail);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", auth, forgotPassword); // does this need auth???
router.post("/send-verification-code", sendVerificationCode); // I think this needs auth

// EDIT
router.post("/change-password", auth, changePassword);
router.put("/", auth, editUser);

// GET
router.get("/", auth, getUser);

// DELETE
router.delete("/", auth, deleteUser);

export default router;
