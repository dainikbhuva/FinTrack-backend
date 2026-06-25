import { Router } from "express";
import {
  getSummary,
  listTransactions,
} from "../controllers/transactionController.js";
import { requireAuth } from "../middleware/auth.js";

export const transactionRouter = Router();

transactionRouter.use(requireAuth);

transactionRouter.get("/summary", getSummary);
transactionRouter.get("/", listTransactions);
