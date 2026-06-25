import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

const SEED_USER = {
  email: "admin@gmail.com",
  password: "Admin@123",
};

export async function seedUser() {
  const hashedPassword = await bcrypt.hash(SEED_USER.password, 10);

  await prisma.user.upsert({
    where: { email: SEED_USER.email },
    update: { password: hashedPassword },
    create: {
      email: SEED_USER.email,
      password: hashedPassword,
    },
  });

  console.log("Seed user ready:", SEED_USER.email);
}
