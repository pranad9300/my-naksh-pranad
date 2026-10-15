/** Merges raw messages into flat timeline rows (date headers + grouped message items). */
import type {Message, TimelineItem} from '../types';
import {dayKey, dayLabel} from './dayLabel';
import {groupPosition} from './groupPosition';

/**
 * Builds the virtualized list model: inserts date separators when the day changes
 * and attaches {@link groupPosition} for each message row.
 *
 * @param messages - Conversation messages in chronological order.
 * @param now - Passed through to {@link dayLabel} for relative day text.
 */
export function buildTimeline<T extends Message>(
  messages: T[],
  now: Date = new Date(),
): TimelineItem<T>[] {
  const items: TimelineItem<T>[] = [];
  let lastDay: string | null = null;

  messages.forEach((message, index) => {
    const key = dayKey(message.createdAt);
    if (key !== lastDay) {
      lastDay = key;
      items.push({
        kind: 'date',
        id: `date-${key}`,
        label: dayLabel(message.createdAt, now),
      });
    }

    items.push({
      kind: 'message',
      id: message.id,
      message,
      groupPosition: groupPosition(messages, index),
    });
  });

  return items;
}
