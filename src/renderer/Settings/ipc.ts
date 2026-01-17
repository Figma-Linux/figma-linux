import {
  themes as themesStore,
  settings as settingsStore,
  themesLoaded,
  creatorsThemes,
  creatorTheme,
} from "./store";

// Access the settingsAPI exposed by the preload script
declare global {
  interface Window {
    settingsAPI: {
      getSettings: () => Promise<any>;
      frontReady: () => void;
      changeTheme: (theme: any) => void;
      syncThemes: () => void;
      saveCreatorTheme: (theme: any) => void;
      themeCreatorAddTheme: (theme: any) => void;
      themeCreatorRemoveTheme: (themeId: string) => void;
      themeCreatorExportTheme: (themeId: string) => void;
      closeSettingsView: () => void;
      setUseZenity: (value: boolean) => void;
      onThemesLoaded: (callback: (themes: any[]) => void) => () => void;
      onLoadCreatorThemes: (callback: (themes: any[]) => void) => () => void;
      onToggleThemeCreatorPreviewMask: (callback: () => void) => () => void;
      onLoadSettings: (callback: (settings: any) => void) => () => void;
      onLoadCurrentTheme: (callback: (theme: any) => void) => () => void;
    };
  }
}

export async function initIpc() {
  const api = window.settingsAPI;

  api.onThemesLoaded((themes: Themes.Theme[]) => {
    themesStore.set(themes);
    themesLoaded.set(true);
  });

  api.onLoadCreatorThemes((themes: Themes.Theme[]) => {
    creatorsThemes.set(themes);
  });

  api.onToggleThemeCreatorPreviewMask(() => {
    creatorTheme.togglePreviewVisible();
  });

  // Get settings asynchronously
  const settings = await api.getSettings();
  settingsStore.set(settings);

  api.frontReady();
}
