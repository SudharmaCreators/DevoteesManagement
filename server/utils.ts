/**
 * Parse an integer from a route param safely.
 * Returns NaN if the value is not a valid integer — callers must check.
 */
export function parseIntSafe(value: string | undefined): number {
  if (!value) return NaN;
  const n = parseInt(value, 10);
  return isNaN(n) ? NaN : n;
}

/**
 * Narrow an unknown catch value to a message string.
 */
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
