import { Router } from "express";
import { getProfile, login, logout } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", requireAuth, logout);
authRouter.get("/profile", requireAuth, getProfile);
