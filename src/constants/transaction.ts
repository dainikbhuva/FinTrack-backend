export const TRANSACTION_CATEGORIES = [
  "salary",
  "groceries",
  "rent",
  "dining",
  "transport",
  "utilities",
  "entertainment",
  "health",
  "transfer",
  "other",
] as const;

export const TRANSACTION_TYPES = ["income", "expense"] as const;

export const SORT_FIELDS = [
  "date",
  "amount",
  "merchant",
  "category",
  "type",
] as const;

export const MAX_PAGE_SIZE = 500;
export const DEFAULT_PAGE_SIZE = 10;
