import type { Request, Response } from "express";
import { getUserId } from "../middleware/auth.js";
import { getUserProfile, loginUser } from "../services/authService.js";
import { formatBodyError } from "../utils/validation.js";
import { loginSchema } from "../validators/auth.js";

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(formatBodyError(result.error));
  }

  const email = result.data.email.trim().toLowerCase();
  const { password } = result.data;

  try {
    const response = await loginUser(email, password);

    if (!response.success) {
      return res.status(response.status).json({ error: response.message });
    }

    return res.json(response.data);
  } catch {
    return res.status(500).json({ error: "Database connection failed" });
  }
}

export function logout(_req: Request, res: Response) {
  return res.json({ message: "Logged out successfully" });
}

export async function getProfile(req: Request, res: Response) {
  try {
    const response = await getUserProfile(getUserId(req));

    if (!response.success) {
      return res.status(response.status).json({ error: response.message });
    }

    return res.json(response.data);
  } catch {
    return res.status(500).json({ error: "Database connection failed" });
  }
}
