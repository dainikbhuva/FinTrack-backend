import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SEED_USER = {
  email: "admin@gmail.com",
  password: "Admin@123",
};

async function main() {
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

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
