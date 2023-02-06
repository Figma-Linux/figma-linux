import { writable } from "svelte/store";

function createThemeApp() {
  const { subscribe, set } = writable<Themes.Theme>();

  return {
    subscribe,
    set,
  };
}

export const themeApp = createThemeApp();
