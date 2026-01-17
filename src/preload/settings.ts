/**
 * Secure preload script for the settings view with contextBridge
 */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

interface SettingsAPI {
  // Invoke handlers
  getSettings: () => Promise<any>;
  selectExportDirectory: () => Promise<string | null>;
  updatePanelScale: (scale: number) => Promise<void>;
  updateFigmaUiScale: (scale: number) => Promise<void>;

  // Send handlers
  frontReady: () => void;
  changeTheme: (theme: any) => void;
  syncThemes: () => void;
  saveCreatorTheme: (theme: any) => void;
  themeCreatorAddTheme: (theme: any) => void;
  themeCreatorRemoveTheme: (themeId: string) => void;
  themeCreatorExportTheme: (themeId: string) => void;
  closeSettingsView: () => void;
  setUseZenity: (value: boolean) => void;

  // Event listeners with cleanup
  onThemesLoaded: (callback: (themes: any[]) => void) => () => void;
  onLoadCreatorThemes: (callback: (themes: any[]) => void) => () => void;
  onToggleThemeCreatorPreviewMask: (callback: () => void) => () => void;
  onLoadSettings: (callback: (settings: any) => void) => () => void;
  onLoadCurrentTheme: (callback: (theme: any) => void) => () => void;
}

const settingsAPI: SettingsAPI = {
  // Invoke handlers
  getSettings: () => ipcRenderer.invoke('getSettings'),
  selectExportDirectory: () => ipcRenderer.invoke('selectExportDirectory'),
  updatePanelScale: (scale) => ipcRenderer.invoke('updatePanelScale', scale),
  updateFigmaUiScale: (scale) => ipcRenderer.invoke('updateFigmaUiScale', scale),

  // Send handlers
  frontReady: () => ipcRenderer.send('frontReady'),
  changeTheme: (theme) => ipcRenderer.send('changeTheme', theme),
  syncThemes: () => ipcRenderer.send('syncThemes'),
  saveCreatorTheme: (theme) => ipcRenderer.send('saveCreatorTheme', theme),
  themeCreatorAddTheme: (theme) => ipcRenderer.send('themeCreatorAddTheme', theme),
  themeCreatorRemoveTheme: (themeId) => ipcRenderer.send('themeCreatorRemoveTheme', themeId),
  themeCreatorExportTheme: (themeId) => ipcRenderer.send('themeCreatorExportTheme', themeId),
  closeSettingsView: () => ipcRenderer.send('closeSettingsView'),
  setUseZenity: (value) => ipcRenderer.send('set-use-zenity', value),

  // Event listeners with cleanup
  onThemesLoaded: (callback) => {
    const handler = (_: IpcRendererEvent, themes: any[]) => callback(themes);
    ipcRenderer.on('themesLoaded', handler);
    return () => ipcRenderer.removeListener('themesLoaded', handler);
  },
  onLoadCreatorThemes: (callback) => {
    const handler = (_: IpcRendererEvent, themes: any[]) => callback(themes);
    ipcRenderer.on('loadCreatorThemes', handler);
    return () => ipcRenderer.removeListener('loadCreatorThemes', handler);
  },
  onToggleThemeCreatorPreviewMask: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('toggleThemeCreatorPreviewMask', handler);
    return () => ipcRenderer.removeListener('toggleThemeCreatorPreviewMask', handler);
  },
  onLoadSettings: (callback) => {
    const handler = (_: IpcRendererEvent, settings: any) => callback(settings);
    ipcRenderer.on('loadSettings', handler);
    return () => ipcRenderer.removeListener('loadSettings', handler);
  },
  onLoadCurrentTheme: (callback) => {
    const handler = (_: IpcRendererEvent, theme: any) => callback(theme);
    ipcRenderer.on('loadCurrentTheme', handler);
    return () => ipcRenderer.removeListener('loadCurrentTheme', handler);
  },
};

// Expose the API to the renderer
contextBridge.exposeInMainWorld('settingsAPI', settingsAPI);
