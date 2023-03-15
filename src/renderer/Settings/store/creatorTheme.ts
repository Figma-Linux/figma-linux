import { writable } from "svelte/store";
import { DEFAULT_THEME } from "Const";

function createCreatorTheme() {
  const { subscribe, set, update } = writable<Store.CreatorThemeStore>({
    state: "new",
    previewMaskVisible: true,
    theme: DEFAULT_THEME,
  });

  return {
    subscribe,
    update,
    set,
    reset: () =>
      update(() => ({
        state: "new",
        previewMaskVisible: true,
        theme: DEFAULT_THEME,
      })),
    setTheme: (theme: Themes.Theme) =>
      update((store) => ({
        state: store.state,
        previewMaskVisible: store.previewMaskVisible,
        theme,
      })),
    setPaletteTheme: (theme: Themes.Theme) =>
      update((store) => ({
        state: "new",
        previewMaskVisible: store.previewMaskVisible,
        theme: {
          ...store.theme,
          palette: theme.palette,
        },
      })),
    setEditTheme: (theme: Themes.Theme) =>
      update((store) => ({
        state: "edit",
        previewMaskVisible: store.previewMaskVisible,
        theme,
      })),
    togglePreviewVisible: () =>
      update((store) => ({
        ...store,
        previewMaskVisible: !store.previewMaskVisible,
      })),
  };
}

export const creatorTheme = createCreatorTheme();
