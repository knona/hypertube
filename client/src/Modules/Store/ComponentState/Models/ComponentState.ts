import type { ComponentStateType } from './ComponentStateType';

export interface ComponentState<T> {
  current: ComponentStateType | string;
  error?: T;
}
