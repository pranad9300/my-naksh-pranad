/** Empty conversation seed for cold-start / zero-message UI states. */
import type {Message} from '../../types';

/** No initial rows — composer and empty state render without preload. */
export const EMPTY_CONVERSATION: Message[] = [];
