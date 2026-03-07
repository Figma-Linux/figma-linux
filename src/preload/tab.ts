/**
 * Secure preload script for Figma tabs with contextBridge
 * This script exposes a safe API to the renderer process
 *
 * NOTE: Uses CommonJS require() because Electron preload scripts must be CommonJS
 */
const { contextBridge, ipcRenderer, clipboard, webFrame } = require('electron');

// Type definitions for the exposed API
interface FigmaDesktopAPI {
  // Invoke handlers (async, returns promise)
  getFonts: () => Promise<any>;
  getFontFile: (args: { id: string; postscript: string; style: string }) => Promise<ArrayBuffer>;
  createFile: (args: any) => Promise<any>;
  writeFiles: (args: any) => Promise<void>;
  selectExportDirectory: () => Promise<string | null>;
  isDevToolsOpened: () => Promise<boolean>;
  themesIsDisabled: () => Promise<boolean>;
  writeNewExtensionToDisk: (args: any) => Promise<string>;
  writeNewExtensionDirectoryToDisk: (args: any) => Promise<any>;
  getLocalManifestFileExtensionIdsToCachedMetadataMap: () => Promise<any>;
  createMultipleNewLocalFileExtensions: (args: any) => Promise<any>;
  getAllLocalFileExtensionIds: () => Promise<string[]>;
  getLocalFileExtensionManifest: (args: { id: string }) => Promise<any>;
  getLocalFileExtensionSource: (args: { id: string }) => Promise<string>;

  // Send handlers (one-way, fire and forget)
  setTitle: (title: string) => void;
  setUser: (id: string) => void;
  setClipboardData: (args: any) => void;
  setUsingMicrophone: (isUsingMicrophone: boolean) => void;
  setIsInVoiceCall: (isInVoiceCall: boolean) => void;
  newFile: (info: any) => void;
  openFile: (url: string, title: string, params: string | undefined, target: string) => void;
  openCommunity: (args: any) => void;
  closeTab: (suppressReopening?: boolean) => void;
  setLoading: (args: any) => void;
  updateSaveStatus: (saved: boolean) => void;
  updateFullscreenMenuState: (state: any) => void;
  showFileBrowser: () => void;
  setIsPreloaded: () => void;
  setInitialOptions: (args: any) => void;
  setFeatureFlags: (args: any) => void;
  startAppAuth: (args: any) => void;
  finishAppAuth: (args: any) => void;
  openDevTools: (mode: string) => void;
  setAuthedUsers: (userIDs: string[]) => void;
  setWorkspaceName: (name: string) => void;
  setFigjamEnabled: (enabled: boolean) => void;
  removeLocalFileExtension: (args: { id: string }) => void;
  openExtensionDirectory: (args: { id: string }) => void;
  toggleCurrentWindowFullscreen: () => void;
  setLocales: (locales: string[]) => void;

  // Log methods
  logDebug: (...args: any[]) => void;
  logInfo: (...args: any[]) => void;
  logWarn: (...args: any[]) => void;
  logError: (...args: any[]) => void;

  // Callback handlers (with cleanup)
  registerUiChangeObserver: (callback: (result: any) => void) => () => void;

  // Event listeners
  onNewFile: (callback: () => void) => () => void;
  onHandleAction: (callback: (action: string, source: string) => void) => () => void;
  onHandleUrl: (callback: (path: string, params: string) => void) => () => void;
  onHandleSetFullScreen: (callback: (fullscreen: boolean) => void) => () => void;
  onShowFlashMessage: (callback: (message: string) => void) => () => void;
  onHandlePageCommand: (callback: (command: string) => void) => () => void;
  onRedeemAppAuth: (callback: (gSecret: string) => void) => () => void;
  onHandlePluginMenuAction: (callback: (action: any) => void) => () => void;
  onLoadCurrentTheme: (callback: (theme: any) => void) => () => void;
  onHandleCallback: (callback: (callbackID: number, result: any) => void) => () => void;

  // Clipboard operations
  clipboard: {
    readHTML: () => string;
    readText: () => string;
    readBuffer: (format: string) => Uint8Array;
    readImage: () => { toBitmap: () => Uint8Array };
    has: (format: string) => boolean;
  };

  // WebFrame operations
  getZoomFactor: () => number;
  executeJavaScript: (code: string) => Promise<any>;

  // Callback registration for main process
  sendWebCallback: (channel: string, callbackID: number, args: any) => void;
  cancelWebCallback: (callbackID: number) => void;
}

// Create callback ID counter for registering callbacks
let nextCallbackID = 0;
const registeredCallbacks = new Map<number, (result: any) => void>();

// Handle callbacks from main process
ipcRenderer.on('handleCallback', (_: any, callbackID: number, result: any) => {
  const callback = registeredCallbacks.get(callbackID);
  if (callback) {
    callback(result);
  }
});

const figmaAPI: FigmaDesktopAPI = {
  // Invoke handlers
  getFonts: () => ipcRenderer.invoke('getFonts'),
  getFontFile: (args) => ipcRenderer.invoke('getFontFile', args),
  createFile: (args) => ipcRenderer.invoke('createFile', args),
  writeFiles: (args) => ipcRenderer.invoke('writeFiles', args),
  selectExportDirectory: () => ipcRenderer.invoke('selectExportDirectory'),
  isDevToolsOpened: () => ipcRenderer.invoke('isDevToolsOpened'),
  themesIsDisabled: () => ipcRenderer.invoke('themesIsDisabled'),
  writeNewExtensionToDisk: (args) => ipcRenderer.invoke('writeNewExtensionToDisk', args),
  writeNewExtensionDirectoryToDisk: (args) => ipcRenderer.invoke('writeNewExtensionDirectoryToDisk', args),
  getLocalManifestFileExtensionIdsToCachedMetadataMap: () => ipcRenderer.invoke('getLocalManifestFileExtensionIdsToCachedMetadataMap'),
  createMultipleNewLocalFileExtensions: (args) => ipcRenderer.invoke('createMultipleNewLocalFileExtensions', args),
  getAllLocalFileExtensionIds: () => ipcRenderer.invoke('getAllLocalFileExtensionIds'),
  getLocalFileExtensionManifest: (args) => ipcRenderer.invoke('getLocalFileExtensionManifest', args),
  getLocalFileExtensionSource: (args) => ipcRenderer.invoke('getLocalFileExtensionSource', args),

  // Send handlers
  setTitle: (title) => ipcRenderer.send('setTitle', title),
  setUser: (id) => ipcRenderer.send('setUser', id),
  setClipboardData: (args) => ipcRenderer.send('setClipboardData', args),
  setUsingMicrophone: (isUsingMicrophone) => ipcRenderer.send('setUsingMicrophone', isUsingMicrophone),
  setIsInVoiceCall: (isInVoiceCall) => ipcRenderer.send('setIsInVoiceCall', isInVoiceCall),
  newFile: (info) => ipcRenderer.send('newFile', info),
  openFile: (url, title, params, target) => ipcRenderer.send('openFile', url, title, params, target),
  openCommunity: (args) => ipcRenderer.send('openCommunity', args),
  closeTab: (suppressReopening) => ipcRenderer.send('closeTab', suppressReopening),
  setLoading: (args) => ipcRenderer.send('setLoading', args),
  updateSaveStatus: (saved) => ipcRenderer.send('updateSaveStatus', saved),
  updateFullscreenMenuState: (state) => ipcRenderer.send('updateFullscreenMenuState', state),
  showFileBrowser: () => ipcRenderer.send('showFileBrowser'),
  setIsPreloaded: () => ipcRenderer.send('setIsPreloaded'),
  setInitialOptions: (args) => ipcRenderer.send('setInitialOptions', args),
  setFeatureFlags: (args) => ipcRenderer.send('setFeatureFlags', args),
  startAppAuth: (args) => ipcRenderer.send('startAppAuth', args),
  finishAppAuth: (args) => ipcRenderer.send('finishAppAuth', args),
  openDevTools: (mode) => ipcRenderer.send('openDevTools', mode),
  setAuthedUsers: (userIDs) => ipcRenderer.send('setAuthedUsers', userIDs),
  setWorkspaceName: (name) => ipcRenderer.send('setWorkspaceName', name),
  setFigjamEnabled: (enabled) => ipcRenderer.send('setFigjamEnabled', enabled),
  removeLocalFileExtension: (args) => ipcRenderer.send('removeLocalFileExtension', args),
  openExtensionDirectory: (args) => ipcRenderer.send('openExtensionDirectory', args),
  toggleCurrentWindowFullscreen: () => ipcRenderer.send('toggleCurrentWindowFullscreen'),
  setLocales: (locales) => ipcRenderer.send('setLocales', locales),

  // Log methods
  logDebug: (...args) => ipcRenderer.send('logDebug', ...args),
  logInfo: (...args) => ipcRenderer.send('logInfo', ...args),
  logWarn: (...args) => ipcRenderer.send('logWarn', ...args),
  logError: (...args) => ipcRenderer.send('logError', ...args),

  // Callback registration for extensions
  registerUiChangeObserver: (callback) => {
    const callbackID = nextCallbackID++;
    registeredCallbacks.set(callbackID, callback);
    ipcRenderer.send('web-callback:registerUiChangeObserver', callbackID, {});
    return () => {
      ipcRenderer.send('web-cancel-callback', callbackID);
      registeredCallbacks.delete(callbackID);
    };
  },

  // Event listeners with cleanup
  onNewFile: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('newFile', handler);
    return () => ipcRenderer.removeListener('newFile', handler);
  },
  onHandleAction: (callback) => {
    const handler = (_: any, action: string, source: string) => callback(action, source);
    ipcRenderer.on('handleAction', handler);
    return () => ipcRenderer.removeListener('handleAction', handler);
  },
  onHandleUrl: (callback) => {
    const handler = (_: any, path: string, params: string) => callback(path, params);
    ipcRenderer.on('handleUrl', handler);
    return () => ipcRenderer.removeListener('handleUrl', handler);
  },
  onHandleSetFullScreen: (callback) => {
    const handler = (_: any, fullscreen: boolean) => callback(fullscreen);
    ipcRenderer.on('handleSetFullScreen', handler);
    return () => ipcRenderer.removeListener('handleSetFullScreen', handler);
  },
  onShowFlashMessage: (callback) => {
    const handler = (_: any, message: string) => callback(message);
    ipcRenderer.on('showFlashMessage', handler);
    return () => ipcRenderer.removeListener('showFlashMessage', handler);
  },
  onHandlePageCommand: (callback) => {
    const handler = (_: any, command: string) => callback(command);
    ipcRenderer.on('handlePageCommand', handler);
    return () => ipcRenderer.removeListener('handlePageCommand', handler);
  },
  onRedeemAppAuth: (callback) => {
    const handler = (_: any, gSecret: string) => callback(gSecret);
    ipcRenderer.on('redeemAppAuth', handler);
    return () => ipcRenderer.removeListener('redeemAppAuth', handler);
  },
  onHandlePluginMenuAction: (callback) => {
    const handler = (_: any, action: any) => callback(action);
    ipcRenderer.on('handlePluginMenuAction', handler);
    return () => ipcRenderer.removeListener('handlePluginMenuAction', handler);
  },
  onLoadCurrentTheme: (callback) => {
    const handler = (_: any, theme: any) => callback(theme);
    ipcRenderer.on('loadCurrentTheme', handler);
    return () => ipcRenderer.removeListener('loadCurrentTheme', handler);
  },
  onHandleCallback: (callback) => {
    const handler = (_: any, callbackID: number, result: any) => callback(callbackID, result);
    ipcRenderer.on('handleCallback', handler);
    return () => ipcRenderer.removeListener('handleCallback', handler);
  },

  // Clipboard operations (safe subset)
  clipboard: {
    readHTML: () => clipboard.readHTML(),
    readText: () => clipboard.readText(),
    readBuffer: (format) => {
      const buffer = clipboard.readBuffer(format);
      return new Uint8Array(buffer);
    },
    readImage: () => ({
      toBitmap: () => {
        const image = clipboard.readImage();
        return new Uint8Array(image.toBitmap());
      }
    }),
    has: (format) => clipboard.has(format),
  },

  // WebFrame operations
  getZoomFactor: () => webFrame.getZoomFactor(),
  executeJavaScript: (code) => webFrame.executeJavaScript(code),

  // Web callback handlers
  sendWebCallback: (channel, callbackID, args) => {
    ipcRenderer.send(`web-callback:${channel}`, callbackID, args);
  },
  cancelWebCallback: (callbackID) => {
    ipcRenderer.send('web-cancel-callback', callbackID);
  },
};

// Expose the API to the renderer
contextBridge.exposeInMainWorld('figmaAPI', figmaAPI);

// Expose the fileBrowser flag (set during initialization)
contextBridge.exposeInMainWorld('__figmaFileBrowser', process.argv.includes('--file-browser'));
