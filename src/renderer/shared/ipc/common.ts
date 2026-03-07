import { themeStore } from '../stores';

// Common IPC initialization - uses the panelAPI or settingsAPI depending on context
export function initCommonIpc() {
  // For panel context
  if (window.panelAPI) {
    window.panelAPI.onLoadCurrentTheme((theme: Themes.Theme) => {
      themeStore.set(theme);
    });
  }
  // For settings context
  else if (window.settingsAPI) {
    window.settingsAPI.onLoadCurrentTheme((theme: Themes.Theme) => {
      themeStore.set(theme);
    });
  }
}
