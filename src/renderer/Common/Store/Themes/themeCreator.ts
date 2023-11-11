import { writable } from "svelte/store";
import { DEFAULT_THEME, TEST_THEME_ID } from "Const";

function createThemeCreator() {
  const { subscribe, update } = writable<Themes.Theme>({
    ...structuredClone(DEFAULT_THEME),
    id: TEST_THEME_ID,
  });

  return {
    subscribe,
  };
}

export const themeCreator = createThemeCreator();
