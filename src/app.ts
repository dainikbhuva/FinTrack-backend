import cors from "cors";
import express from "express";
import { authRouter } from "./routes/auth.js";
import { transactionRouter } from "./routes/transactions.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionRouter);
