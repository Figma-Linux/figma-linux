import type { BrowserWindowConstructorOptions } from "electron";

export const WINDOW_DEFAULT_OPTIONS: BrowserWindowConstructorOptions = {
  width: 1200,
  height: 900,
  frame: false,
  resizable: true,
  webPreferences: {
    sandbox: false,
    zoomFactor: 1,
    nodeIntegration: true,
    nodeIntegrationInWorker: false,
    webviewTag: false,
    webSecurity: false,
    webgl: true,
    experimentalFeatures: true,
    contextIsolation: false,
  },
};

export const DEFAULT_WIN_OPTIONS: Types.WindowState = {
  x: -1,
  y: -1,
  width: 1200,
  height: 900,
  isMaximized: false,
  lastActiveTabPath: "",
  hasOpenedCommunityTab: false,
  userId: "",
  tabs: [],
};
