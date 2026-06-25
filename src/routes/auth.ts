import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { getUserId, requireAuth } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

authRouter.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues[0]?.message ?? "Invalid input",
    });
  }

  const email = result.data.email.trim().toLowerCase();
  const { password } = result.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({ token, email: user.email });
  } catch {
    return res.status(500).json({ error: "Database connection failed" });
  }
});

authRouter.post("/logout", requireAuth, (_req, res) => {
  return res.json({ message: "Logged out successfully" });
});

authRouter.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: getUserId(req) },
      select: { email: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.json({ email: user.email });
  } catch {
    return res.status(500).json({ error: "Database connection failed" });
  }
});
