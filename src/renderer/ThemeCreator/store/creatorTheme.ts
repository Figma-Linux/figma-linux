import { writable } from "svelte/store";

function createCreatorTheme() {
  const { subscribe, set, update } = writable<Themes.Theme>();

  return {
    subscribe,
    update,
    set,
  };
}

export const creatorTheme = createCreatorTheme();
