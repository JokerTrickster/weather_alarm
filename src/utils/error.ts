/**
 * Format error message with fallback
 * @param error - Error object or unknown error
 * @param fallback - Fallback message if error doesn't have a message
 * @returns Formatted error message string
 */
export function formatErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}
