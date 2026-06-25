import type { Request, Response } from "express";
import {
  getTransactionSummary,
  getTransactions,
} from "../services/transactionService.js";
import { formatValidationError } from "../utils/validation.js";
import {
  listQuerySchema,
  summaryQuerySchema,
} from "../validators/transaction.js";

export async function listTransactions(req: Request, res: Response) {
  const result = listQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json(formatValidationError(result.error));
  }

  try {
    const data = await getTransactions(result.data);
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }
}

export async function getSummary(req: Request, res: Response) {
  const result = summaryQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json(formatValidationError(result.error));
  }

  try {
    const data = await getTransactionSummary(result.data);
    return res.json(data);
  } catch {
    return res.status(500).json({ error: "Failed to fetch summary" });
  }
}
