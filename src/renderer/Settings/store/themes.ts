import { writable } from "svelte/store";
import { DEFAULT_THEME } from "Const";

function createThemes() {
  const { subscribe, update } = writable<Themes.Theme[]>([DEFAULT_THEME]);

  return {
    subscribe,
    update,
    set: (themes: Themes.Theme[]) =>
      update((store) => {
        store = [DEFAULT_THEME, ...themes];

        return store;
      }),
  };
}

export const themes = createThemes();
