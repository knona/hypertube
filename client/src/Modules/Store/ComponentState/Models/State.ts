import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { ComponentState } from './ComponentState';

export type State<T> = {
  subscribe: (this: void, run: Subscriber<ComponentState<T>>, invalidate?: any) => Unsubscriber;
  set: (state: ComponentState<T>) => void;
  setDefault: () => void;
  setEmpty: () => void;
  setLoading: () => void;
  setError: (error: T) => void;
  setCustom: (state: string) => void;
};
