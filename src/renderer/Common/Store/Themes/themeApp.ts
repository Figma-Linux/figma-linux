import { writable } from "svelte/store";
import { DEFAULT_THEME } from "Const";

function createThemeApp() {
  const { subscribe, set } = writable<Themes.Theme>();

  return {
    subscribe,
    set,
    reset: () => set(structuredClone(DEFAULT_THEME)),
  };
}

export const themeApp = createThemeApp();
