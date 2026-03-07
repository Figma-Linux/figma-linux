import {
  themesStore,
  settingsStore,
  themesLoadedStore,
  creatorsThemesStore,
  creatorThemeStore,
} from './stores';

// Access the settingsAPI exposed by the preload script
declare global {
  interface Window {
    settingsAPI: {
      // Invoke handlers
      getSettings: () => Promise<any>;
      selectExportDirectory: () => Promise<string | null>;
      updatePanelScale: (scale: number) => Promise<void>;
      updateFigmaUiScale: (scale: number) => Promise<void>;
      getThemePreviewPreloadPath: () => Promise<string>;

      // Clipboard
      clipboardWriteText: (text: string) => void;
      clipboardReadText: () => string;

      // Send handlers
      frontReady: () => void;
      changeTheme: (theme: any) => void;
      syncThemes: () => void;
      saveCreatorTheme: (theme: any) => void;
      themeCreatorAddTheme: (theme: any) => void;
      themeCreatorRemoveTheme: (themeId: string) => void;
      themeCreatorExportTheme: (themeId: string) => void;
      closeSettingsView: (settings: any) => void;
      setUseZenity: (value: boolean) => void;

      // Event listeners with cleanup
      onThemesLoaded: (callback: (themes: any[]) => void) => () => void;
      onLoadCreatorThemes: (callback: (themes: any[]) => void) => () => void;
      onToggleThemeCreatorPreviewMask: (callback: () => void) => () => void;
      onLoadSettings: (callback: (settings: any) => void) => () => void;
      onLoadCurrentTheme: (callback: (theme: any) => void) => () => void;
    };
  }
}

export async function initSettingsIpc() {
  const api = window.settingsAPI;

  if (!api) {
    console.error('[Settings IPC] settingsAPI not available - preload script may not have loaded');
    return;
  }

  api.onThemesLoaded((themes: Themes.Theme[]) => {
    themesStore.set(themes);
    themesLoadedStore.set(true);
  });

  api.onLoadCreatorThemes((themes: Themes.Theme[]) => {
    creatorsThemesStore.set(themes);
  });

  api.onToggleThemeCreatorPreviewMask(() => {
    creatorThemeStore.togglePreviewVisible();
  });

  // Get settings asynchronously
  try {
    const settings = await api.getSettings();
    settingsStore.set(settings);
  } catch (error) {
    console.error('[Settings IPC] Failed to get settings:', error);
  }

  api.frontReady();
}
