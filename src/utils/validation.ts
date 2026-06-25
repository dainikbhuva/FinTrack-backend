import type { ZodError } from "zod";

export function formatValidationError(error: ZodError) {
  const details = error.issues.map((issue) => ({
    field: issue.path.join(".") || "query",
    message: issue.message,
  }));

  return {
    error: "Invalid query parameters",
    details,
  };
}

export function formatBodyError(error: ZodError) {
  const details = error.issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
  }));

  return {
    error: "Invalid request body",
    details,
  };
}
