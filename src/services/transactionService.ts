import { prisma } from "../lib/prisma.js";
import type { ListQuery, SummaryQuery } from "../validators/transaction.js";
import type { Prisma } from "@prisma/client";

function parseEndDate(dateTo: string) {
  const end = new Date(dateTo);
  end.setUTCHours(23, 59, 59, 999);
  return end;
}

function buildDateFilter(dateFrom?: string, dateTo?: string) {
  if (!dateFrom && !dateTo) {
    return undefined;
  }

  const date: Prisma.DateTimeFilter = {};

  if (dateFrom) {
    date.gte = new Date(dateFrom);
  }

  if (dateTo) {
    date.lte = parseEndDate(dateTo);
  }

  return date;
}

export function buildListWhere(query: ListQuery): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = {};

  if (query.q) {
    where.merchant = { contains: query.q, mode: "insensitive" };
  }

  if (query.category) {
    where.category = query.category;
  }

  if (query.type) {
    where.type = query.type;
  }

  const dateFilter = buildDateFilter(query.dateFrom, query.dateTo);

  if (dateFilter) {
    where.date = dateFilter;
  }

  return where;
}

function buildSummaryWhere(query: SummaryQuery): Prisma.TransactionWhereInput {
  const dateFilter = buildDateFilter(query.dateFrom, query.dateTo);
  return dateFilter ? { date: dateFilter } : {};
}

function toRow(transaction: {
  id: string;
  date: Date;
  amount: Prisma.Decimal;
  type: string;
  category: string;
  merchant: string;
}) {
  return {
    id: transaction.id,
    date: transaction.date.toISOString(),
    amount: Number(transaction.amount),
    type: transaction.type,
    category: transaction.category,
    merchant: transaction.merchant,
  };
}

export async function getTransactions(query: ListQuery) {
  const where = buildListWhere(query);
  const skip = (query.page - 1) * query.pageSize;

  const [rows, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { [query.sortBy]: query.sortOrder },
      skip,
      take: query.pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    rows: rows.map(toRow),
    page: query.page,
    pageSize: query.pageSize,
    total,
  };
}

export async function getTransactionSummary(query: SummaryQuery) {
  const where = buildSummaryWhere(query);

  const [income, expense, categories] = await Promise.all([
    prisma.transaction.aggregate({
      where: { ...where, type: "income" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { ...where, type: "expense" },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ["category"],
      where: { ...where, type: "expense" },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
    }),
  ]);

  const totalIncome = Number(income._sum.amount ?? 0);
  const totalExpense = Number(expense._sum.amount ?? 0);

  return {
    totalIncome,
    totalExpense,
    net: totalIncome - totalExpense,
    byCategory: categories.map((item) => ({
      category: item.category,
      total: Number(item._sum.amount ?? 0),
    })),
  };
}
