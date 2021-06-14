import { writable } from 'svelte/store';
import type { Preferences } from '../../../Models/Preferences';
import { defaultLanguage } from '../../../Shared/Constants';
import { LocalStorage } from '../../LocalStorage/LocalStorage';

function createPreferenceStore() {
  const initialState: Preferences = { language: defaultLanguage };
  const storage: LocalStorage<Preferences> = new LocalStorage('preferences');
  const { subscribe, update } = writable<Preferences>(storage.get() ?? initialState);

  return {
    subscribe,
    setLanguage: (language: string) =>
      update(store => {
        const preferences: Preferences = { ...store, language: language };
        storage.set(preferences);
        return preferences;
      })
  };
}

export const preferences = createPreferenceStore();
