import { writable } from "svelte/store";
import { DEFAULT_THEME } from "Const";

function createCreatorTheme() {
  const { subscribe, set, update } = writable<Store.CreatorThemeStore>({
    state: "new",
    loadedTemplateId: "",
    previewMaskVisible: true,
    zoom: 1,
    theme: DEFAULT_THEME,
  });

  return {
    subscribe,
    update,
    set,
    reset: () =>
      update(() => ({
        state: "new",
        loadedTemplateId: "",
        previewMaskVisible: true,
        zoom: 1,
        theme: DEFAULT_THEME,
      })),
    setTheme: (theme: Themes.Theme) =>
      update((store) => ({
        ...store,
        theme,
      })),
    setPaletteTheme: (theme: Themes.Theme) =>
      update((store) => ({
        ...store,
        loadedTemplateId: theme.id,
        state: "new",
        theme: {
          ...store.theme,
          palette: theme.palette,
        },
      })),
    setEditTheme: (theme: Themes.Theme) =>
      update((store) => ({
        ...store,
        state: "edit",
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
