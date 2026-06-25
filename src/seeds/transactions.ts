import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { TRANSACTION_CATEGORIES } from "../constants/transaction.js";

const MERCHANTS = [
  "Blue Tokai",
  "Amazon",
  "Swiggy",
  "Uber",
  "BigBasket",
  "Netflix",
  "Apollo Pharmacy",
  "HDFC Bank",
  "Zomato",
  "DMart",
  "Spotify",
  "Flipkart",
  "Ola",
  "BookMyShow",
  "Metro Cash & Carry",
];

const EXPENSE_CATEGORIES = TRANSACTION_CATEGORIES.filter((c) => c !== "salary");

const TOTAL = 15000;
const BATCH_SIZE = 1000;

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function randomDate() {
  const end = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function buildBatch(startIndex: number, count: number) {
  const batch: Prisma.TransactionCreateManyInput[] = [];

  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    const isIncome = index % 8 === 0;

    batch.push({
      date: randomDate(),
      amount: isIncome
        ? (45000 + Math.random() * 25000).toFixed(2)
        : (50 + Math.random() * 4500).toFixed(2),
      type: isIncome ? "income" : "expense",
      category: isIncome ? "salary" : randomItem(EXPENSE_CATEGORIES),
      merchant: isIncome ? "Employer Pvt Ltd" : randomItem(MERCHANTS),
    });
  }

  return batch;
}

export async function seedTransactions() {
  const existing = await prisma.transaction.count();

  if (existing >= TOTAL) {
    console.log("Transactions already seeded:", existing);
    return;
  }

  await prisma.transaction.deleteMany();

  for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
    const batch = buildBatch(i, Math.min(BATCH_SIZE, TOTAL - i));
    await prisma.transaction.createMany({ data: batch });
    console.log(`Seeded ${Math.min(i + BATCH_SIZE, TOTAL)} / ${TOTAL}`);
  }
}
