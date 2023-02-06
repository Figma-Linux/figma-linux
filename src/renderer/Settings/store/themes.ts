import { writable } from "svelte/store";

function createThemes() {
  const { subscribe, set, update } = writable<Themes.Theme[]>([]);

  return {
    subscribe,
    update,
    set,
  };
}

export const themes = createThemes();
