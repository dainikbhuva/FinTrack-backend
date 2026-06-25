import "dotenv/config";
import { prisma } from "./lib/prisma.js";
import { seedTransactions } from "./seeds/transactions.js";
import { seedUser } from "./seeds/user.js";

async function main() {
  await seedUser();
  await seedTransactions();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
