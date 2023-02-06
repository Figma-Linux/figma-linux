export const WINDOW_DEFAULT_OPTIONS = {
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
