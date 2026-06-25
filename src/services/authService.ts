import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { success: false as const, status: 401, message: "Invalid email or password" };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return { success: false as const, status: 401, message: "Invalid email or password" };
  }

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    success: true as const,
    data: { token, email: user.email },
  };
}

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) {
    return { success: false as const, status: 401, message: "Unauthorized" };
  }

  return { success: true as const, data: { email: user.email } };
}
