import { writable } from "svelte/store";
import { DEFAULT_SETTINGS } from "Utils/Render";

function createSettings() {
  const { subscribe, update, set } = writable<Types.SettingsInterface>();

  return {
    set: (settings: Types.SettingsInterface) =>
      set({
        ...settings,
        app: {
          ...settings.app,
          themeDropdownOpen: settings.app.themeDropdownOpen ?? true,
          creatorsThemesDropdownOpen: settings.app.creatorsThemesDropdownOpen ?? false,
          useOldPreviewer: settings.app.useOldPreviewer ?? false,
        },
      }),
    subscribe,
    reset: () => update((current) => (current = DEFAULT_SETTINGS)),
  };
}

export const settings = createSettings();
