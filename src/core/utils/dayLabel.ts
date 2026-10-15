/** Calendar-day helpers for timeline separators — no feature domain types. */

/**
 * Formats a timestamp as a day separator label (`Today` / `Yesterday` / locale date).
 *
 * @param isoDate - Message `createdAt` (ISO string).
 * @param now - Reference clock for relative labels; inject in tests.
 */
export function dayLabel(isoDate: string, now: Date = new Date()): string {
  const date = new Date(isoDate);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfTarget.getTime()) / 86_400_000,
  );

  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Stable `YYYY-MM-DD` key in local timezone for grouping messages by calendar day.
 *
 * @param isoDate - Message `createdAt` (ISO string).
 */
export function dayKey(isoDate: string): string {
  const date = new Date(isoDate);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
