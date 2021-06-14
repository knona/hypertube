import { writable } from 'svelte/store';
import type { ComponentState } from './Models/ComponentState';
import { ComponentStateType } from './Models/ComponentStateType';
import type { State } from './Models/State';

export function componentState<T>(defaultState: ComponentState<T> = { current: ComponentStateType.default }): State<T> {
  const { subscribe, set } = writable<ComponentState<T>>(defaultState);

  return {
    subscribe,
    set: (state: ComponentState<T>) => set(state),
    setDefault: () => set({ current: ComponentStateType.default }),
    setEmpty: () => set({ current: ComponentStateType.empty }),
    setLoading: () => set({ current: ComponentStateType.loading }),
    setError: (error: T) => set({ current: ComponentStateType.error, error: error }),
    setCustom: (state: string) => set({ current: state })
  };
}
