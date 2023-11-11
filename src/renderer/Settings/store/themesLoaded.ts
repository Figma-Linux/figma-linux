import { writable } from "svelte/store";

function createThemesLoaded() {
  const { subscribe, set, update } = writable<boolean>(true);

  return {
    subscribe,
    update,
    set,
  };
}

export const themesLoaded = createThemesLoaded();
