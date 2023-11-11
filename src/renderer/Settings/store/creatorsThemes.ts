import { writable, get } from "svelte/store";

function createCreatorsThemes() {
  const { subscribe, set, update } = writable<Themes.Theme[]>([]);

  return {
    subscribe,
    update,
    set,
    exists: (name: string) => !!get(creatorsThemes).find((theme) => theme.name === name),
  };
}

export const creatorsThemes = createCreatorsThemes();
