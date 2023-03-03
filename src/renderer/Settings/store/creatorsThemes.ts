import { writable } from "svelte/store";

function createCreatorsThemes() {
  const { subscribe, set, update } = writable<Themes.Theme[]>([]);

  return {
    subscribe,
    update,
    set,
  };
}

export const creatorsThemes = createCreatorsThemes();
