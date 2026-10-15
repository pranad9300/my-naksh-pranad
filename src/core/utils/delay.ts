/** Small async timing helper for mock “typing” and staged UI. */

/**
 * Resolves after the given duration (non-blocking sleep for async flows).
 *
 * @param ms - Delay in milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
