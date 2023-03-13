import { writable } from "svelte/store";
import { DEFAULT_THEME } from "Const";

function createCreatorTheme() {
  const { subscribe, set, update } = writable<Themes.CreatorThemeStore>({
    state: "new",
    theme: DEFAULT_THEME,
  });

  return {
    subscribe,
    update,
    set,
    reset: () =>
      update(() => ({
        state: "new",
        theme: DEFAULT_THEME,
      })),
    setTheme: (theme: Themes.Theme) =>
      update((store) => ({
        state: store.state,
        theme,
      })),
    setPaletteTheme: (theme: Themes.Theme) =>
      update((store) => ({
        state: "new",
        theme: {
          ...store.theme,
          palette: theme.palette,
        },
      })),
    setEditTheme: (theme: Themes.Theme) =>
      update(() => ({
        state: "edit",
        theme,
      })),
  };
}

export const creatorTheme = createCreatorTheme();
