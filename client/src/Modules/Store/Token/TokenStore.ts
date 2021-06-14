import { writable } from 'svelte/store';
import type { Token } from '../../../Models/Token';
import type { Optional } from '../../../Shared/Types';
import { LocalStorage } from '../../LocalStorage/LocalStorage';

function createTokenStore() {
  const storage: LocalStorage<Token> = new LocalStorage('token');
  const { subscribe, set } = writable<Optional<Token>>(storage.get());
  subscribe((token: Token) => storage.set(token));

  return {
    subscribe,
    set: (token: Optional<Token>) => set(token),
    get: (): Optional<Token> => storage.get(),
    getString: (): string => storage.get()?.token ?? ''
  };
}

export const token = createTokenStore();
