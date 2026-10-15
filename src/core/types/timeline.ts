/** Flat list items for virtualized conversation timelines (dates + messages). */
import type {Message} from './message';

/** Bubble grouping hint for consecutive rows from the same sender. */
export type GroupPosition = 'single' | 'first' | 'middle' | 'last';

/** Day separator row inserted when the calendar day changes. */
export type DateTimelineItem = {
  kind: 'date';
  id: string;
  label: string;
};

/** Message row with precomputed group position for bubble styling. */
export type MessageTimelineItem<T extends Message = Message> = {
  kind: 'message';
  id: string;
  message: T;
  groupPosition: GroupPosition;
};

/** Discriminated union consumed by the conversation list renderer. */
export type TimelineItem<T extends Message = Message> =
  | DateTimelineItem
  | MessageTimelineItem<T>;
