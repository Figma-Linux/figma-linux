/**
 * Secure preload script for the main panel with contextBridge
 * This handles the tab bar and window controls
 *
 * NOTE: Uses CommonJS require() because Electron preload scripts must be CommonJS
 */
const { contextBridge, ipcRenderer } = require('electron');

interface PanelAPI {
  // Send handlers
  frontReady: () => void;
  setTabFocus: (tabId: number) => void;
  closeTab: (tabId: number) => void;
  closeAllTab: () => void;
  closeCommunityTab: () => void;
  setFocusToMainTab: () => void;
  setFocusToCommunityTab: () => void;
  openTabMenu: (tabId: number, x: number, y: number) => void;
  openMainTabMenu: (x: number, y: number) => void;
  openCommunityTabMenu: (x: number, y: number) => void;
  openMainMenu: () => void;
  windowClose: () => void;
  windowMinimize: () => void;
  windowMaximize: () => void;
  newProject: (editorType: string) => void;

  // Event listeners with cleanup
  onCloseAllTabs: (callback: () => void) => () => void;
  onDidTabAdd: (callback: (data: any) => void) => () => void;
  onSetTitle: (callback: (data: { id: number; title: string }) => void) => () => void;
  onTabWasClosed: (callback: (tabId: number) => void) => () => void;
  onFocusTab: (callback: (tabId: number) => void) => () => void;
  onNewFileBtnVisible: (callback: (visible: boolean) => void) => () => void;
  onSetUsingMicrophone: (callback: (data: { id: number; isUsingMicrophone: boolean }) => void) => () => void;
  onSetIsInVoiceCall: (callback: (data: { id: number; isInVoiceCall: boolean }) => void) => () => void;
  onIsMainMenuOpen: (callback: (isOpen: boolean) => void) => () => void;
  onSetPanelScale: (callback: (scale: number) => void) => () => void;
  onLoadSettings: (callback: (settings: any) => void) => () => void;
  onOpenCommunity: (callback: () => void) => () => void;
  onCommunityTabWasClose: (callback: () => void) => () => void;
  onSetLoading: (callback: (tabId: number, loading: boolean) => void) => () => void;
  onLoadCurrentTheme: (callback: (theme: any) => void) => () => void;
}

const panelAPI: PanelAPI = {
  // Send handlers
  frontReady: () => ipcRenderer.send('frontReady'),
  setTabFocus: (tabId) => ipcRenderer.send('setTabFocus', tabId),
  closeTab: (tabId) => ipcRenderer.send('closeTab', tabId),
  closeAllTab: () => ipcRenderer.send('closeAllTab'),
  closeCommunityTab: () => ipcRenderer.send('closeCommunityTab'),
  setFocusToMainTab: () => ipcRenderer.send('setFocusToMainTab'),
  setFocusToCommunityTab: () => ipcRenderer.send('setFocusToCommunityTab'),
  openTabMenu: (tabId, x, y) => ipcRenderer.send('openTabMenu', tabId, x, y),
  openMainTabMenu: (x, y) => ipcRenderer.send('openMainTabMenu', x, y),
  openCommunityTabMenu: (x, y) => ipcRenderer.send('openCommunityTabMenu', x, y),
  openMainMenu: () => ipcRenderer.send('openMainMenu'),
  windowClose: () => ipcRenderer.send('windowClose'),
  windowMinimize: () => ipcRenderer.send('windowMinimize'),
  windowMaximize: () => ipcRenderer.send('windowMaximize'),
  newProject: (editorType) => ipcRenderer.send('newProject', editorType),

  // Event listeners with cleanup
  onCloseAllTabs: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('closeAllTabs', handler);
    return () => ipcRenderer.removeListener('closeAllTabs', handler);
  },
  onDidTabAdd: (callback) => {
    const handler = (_: any, data: any) => callback(data);
    ipcRenderer.on('didTabAdd', handler);
    return () => ipcRenderer.removeListener('didTabAdd', handler);
  },
  onSetTitle: (callback) => {
    const handler = (_: any, data: { id: number; title: string }) => callback(data);
    ipcRenderer.on('setTitle', handler);
    return () => ipcRenderer.removeListener('setTitle', handler);
  },
  onTabWasClosed: (callback) => {
    const handler = (_: any, tabId: number) => callback(tabId);
    ipcRenderer.on('tabWasClosed', handler);
    return () => ipcRenderer.removeListener('tabWasClosed', handler);
  },
  onFocusTab: (callback) => {
    const handler = (_: any, tabId: number) => callback(tabId);
    ipcRenderer.on('focusTab', handler);
    return () => ipcRenderer.removeListener('focusTab', handler);
  },
  onNewFileBtnVisible: (callback) => {
    const handler = (_: any, visible: boolean) => callback(visible);
    ipcRenderer.on('newFileBtnVisible', handler);
    return () => ipcRenderer.removeListener('newFileBtnVisible', handler);
  },
  onSetUsingMicrophone: (callback) => {
    const handler = (_: any, data: { id: number; isUsingMicrophone: boolean }) => callback(data);
    ipcRenderer.on('setUsingMicrophone', handler);
    return () => ipcRenderer.removeListener('setUsingMicrophone', handler);
  },
  onSetIsInVoiceCall: (callback) => {
    const handler = (_: any, data: { id: number; isInVoiceCall: boolean }) => callback(data);
    ipcRenderer.on('setIsInVoiceCall', handler);
    return () => ipcRenderer.removeListener('setIsInVoiceCall', handler);
  },
  onIsMainMenuOpen: (callback) => {
    const handler = (_: any, isOpen: boolean) => callback(isOpen);
    ipcRenderer.on('isMainMenuOpen', handler);
    return () => ipcRenderer.removeListener('isMainMenuOpen', handler);
  },
  onSetPanelScale: (callback) => {
    const handler = (_: any, scale: number) => callback(scale);
    ipcRenderer.on('setPanelScale', handler);
    return () => ipcRenderer.removeListener('setPanelScale', handler);
  },
  onLoadSettings: (callback) => {
    const handler = (_: any, settings: any) => callback(settings);
    ipcRenderer.on('loadSettings', handler);
    return () => ipcRenderer.removeListener('loadSettings', handler);
  },
  onOpenCommunity: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('openCommunity', handler);
    return () => ipcRenderer.removeListener('openCommunity', handler);
  },
  onCommunityTabWasClose: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('communityTabWasClose', handler);
    return () => ipcRenderer.removeListener('communityTabWasClose', handler);
  },
  onSetLoading: (callback) => {
    const handler = (_: any, tabId: number, loading: boolean) => callback(tabId, loading);
    ipcRenderer.on('setLoading', handler);
    return () => ipcRenderer.removeListener('setLoading', handler);
  },
  onLoadCurrentTheme: (callback) => {
    const handler = (_: any, theme: any) => callback(theme);
    ipcRenderer.on('loadCurrentTheme', handler);
    return () => ipcRenderer.removeListener('loadCurrentTheme', handler);
  },
};

// Expose the API to the renderer
contextBridge.exposeInMainWorld('panelAPI', panelAPI);
