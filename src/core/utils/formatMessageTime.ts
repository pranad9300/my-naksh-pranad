/** Locale-aware clock display for message metadata under bubbles. */

/**
 * Formats an ISO timestamp as a short local time (e.g. `3:45 PM`).
 *
 * @param isoDate - Message `createdAt`; invalid dates yield an empty string.
 */
export function formatMessageTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
