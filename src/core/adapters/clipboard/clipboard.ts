/** Clipboard adapter — isolates `@react-native-clipboard/clipboard` from feature code. */
import Clipboard from '@react-native-clipboard/clipboard';

/**
 * Clipboard surface used by features. Swap the underlying library here without touching callers.
 */
export const clipboard = {
  /**
   * Copies plain text to the system clipboard.
   *
   * @param text - String to copy; empty strings are still written.
   */
  copyText(text: string): void {
    Clipboard.setString(text);
  },
};
