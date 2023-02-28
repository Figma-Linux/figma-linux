import { writable } from "svelte/store";

function createSettings() {
  const { subscribe, update, set } = writable<Types.SettingsInterface | undefined>();

  return {
    set,
    subscribe,
    reset: () => update((current) => (current = undefined)),
  };
}

export const settings = createSettings();
