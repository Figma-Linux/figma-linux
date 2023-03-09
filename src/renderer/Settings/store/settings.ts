import { writable } from "svelte/store";
import { DEFAULT_SETTINGS } from "Utils/Render";

function createSettings() {
  const { subscribe, update, set } = writable<Types.SettingsInterface>();

  return {
    set,
    subscribe,
    reset: () => update((current) => (current = DEFAULT_SETTINGS)),
  };
}

export const settings = createSettings();
