import { writable } from "svelte/store";
import { DEFAULT_THEME } from "Const";

function createCreatorTheme() {
  const { subscribe, set, update } = writable<Themes.Theme>(DEFAULT_THEME);

  return {
    subscribe,
    update,
    set,
  };
}

export const creatorTheme = createCreatorTheme();
