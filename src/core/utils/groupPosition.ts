/** Computes chat bubble grouping (first/middle/last) for consecutive same-sender rows. */
import {MessageType, type GroupPosition} from '../types';

/** Minimal shape needed to compare sender type between adjacent list indices. */
type TypedItem = {
  type: (typeof MessageType)[keyof typeof MessageType] | string;
};

/**
 * Same-sender grouping for a chat-like list. System messages never group visually.
 *
 * @param items - Full message array in display order.
 * @param index - Index of the row being rendered.
 * @returns Position within a run of consecutive messages from the same sender.
 */
export function groupPosition(
  items: TypedItem[],
  index: number,
): GroupPosition {
  const current = items[index];
  const prev = items[index - 1];
  const next = items[index + 1];
  const samePrev =
    prev?.type === current.type && current.type !== MessageType.System;
  const sameNext =
    next?.type === current.type && current.type !== MessageType.System;

  if (!samePrev && !sameNext) {
    return 'single';
  }
  if (!samePrev && sameNext) {
    return 'first';
  }
  if (samePrev && sameNext) {
    return 'middle';
  }
  return 'last';
}
