import type { BrowserWindowConstructorOptions } from "electron";

export const WINDOW_DEFAULT_OPTIONS: BrowserWindowConstructorOptions = {
  width: 1200,
  height: 900,
  frame: false,
  resizable: true,
  webPreferences: {
    sandbox: true,
    zoomFactor: 1,
    nodeIntegration: false,
    nodeIntegrationInWorker: false,
    webviewTag: false,
    webSecurity: true,
    webgl: true,
    experimentalFeatures: false,
    contextIsolation: true,
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
