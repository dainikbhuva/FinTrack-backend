import { z } from "zod";
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  SORT_FIELDS,
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
} from "../constants/transaction.js";

function emptyToUndefined(value: unknown) {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }
  return value;
}

const optionalString = z.preprocess(emptyToUndefined, z.string().optional());

const optionalCategory = z.preprocess(
  emptyToUndefined,
  z.enum(TRANSACTION_CATEGORIES).optional(),
);

const optionalType = z.preprocess(
  emptyToUndefined,
  z.enum(TRANSACTION_TYPES).optional(),
);

export const listQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce
      .number()
      .int()
      .min(1)
      .max(MAX_PAGE_SIZE)
      .default(DEFAULT_PAGE_SIZE),
    q: optionalString,
    category: optionalCategory,
    type: optionalType,
    dateFrom: optionalString,
    dateTo: optionalString,
    sortBy: z.enum(SORT_FIELDS).default("date"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .superRefine((data, ctx) => {
    if (data.dateFrom && data.dateTo && data.dateFrom > data.dateTo) {
      ctx.addIssue({
        code: "custom",
        message: "dateFrom cannot be after dateTo",
        path: ["dateFrom"],
      });
    }
  });

export const summaryQuerySchema = z
  .object({
    dateFrom: optionalString,
    dateTo: optionalString,
  })
  .superRefine((data, ctx) => {
    if (data.dateFrom && data.dateTo && data.dateFrom > data.dateTo) {
      ctx.addIssue({
        code: "custom",
        message: "dateFrom cannot be after dateTo",
        path: ["dateFrom"],
      });
    }
  });

export type ListQuery = z.infer<typeof listQuerySchema>;
export type SummaryQuery = z.infer<typeof summaryQuerySchema>;
