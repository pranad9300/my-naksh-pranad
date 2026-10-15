/** Zustand store adapter — feature code depends on this module only, not on Zustand directly. */
import {create} from 'zustand';

/** Zustand-compatible partial state updater (object, patch, or functional). */
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
) => void;

/** Reads the latest committed store snapshot. */
export type GetState<T> = () => T;

/** Minimal store API passed into state creators (get/set/subscribe). */
export type StoreApi<T> = {
  getState: GetState<T>;
  setState: SetState<T>;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
};

/** Function that defines initial state and actions for `createStore`. */
export type StateCreator<T> = (
  set: SetState<T>,
  get: GetState<T>,
  api: StoreApi<T>,
) => T;

/**
 * Creates a Zustand store from a state creator.
 * Singleton-friendly: call once at the composition root and reuse the returned hook/API.
 *
 * @param initializer - State shape plus actions bound to `set` / `get`.
 * @returns Zustand store hook (same as upstream `create`).
 */
export function createStore<T>(initializer: StateCreator<T>) {
  return create<T>()(initializer as never);
}
