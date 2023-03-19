import { writable } from "svelte/store";
import { DEFAULT_THEME } from "Const";

function createThemes() {
  const { subscribe, update } = writable<Themes.Theme[]>([structuredClone(DEFAULT_THEME)]);

  return {
    subscribe,
    update,
    set: (themes: Themes.Theme[]) =>
      update((store) => {
        store = [structuredClone(DEFAULT_THEME), ...themes];

        return store;
      }),
  };
}

export const themes = createThemes();
