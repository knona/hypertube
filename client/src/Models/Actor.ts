import type { Director } from './Director';

export interface Actor extends Director {
  character: string;
}
