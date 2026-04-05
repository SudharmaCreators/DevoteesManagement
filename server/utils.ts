/**
 * Parse an integer from a route param safely.
 * Returns null if the value is not a valid integer — callers must check for null.
 */
export function parseIntSafe(value: string | undefined): number | null {
  if (!value) return null;
  const n = parseInt(value, 10);
  return isNaN(n) ? null : n;
}

/**
 * Narrow an unknown catch value to a message string.
 */
export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
