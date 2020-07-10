import * as E from "electron";

import { toggleDetachedDevTools } from "Utils/Main";
import { app } from "Utils/Common";

export const commands = (): Map<string, Function> => {
  const map = new Map<string, Function>();

  map.set("toggle-developer-tools", (item: E.MenuItemConstructorOptions, window: E.BrowserWindow) => {
    const browserView = window.getBrowserView();

    if (browserView && browserView.webContents) {
      toggleDetachedDevTools(browserView.webContents);
    }
  });
  map.set("toggle-window-developer-tools", (item: E.MenuItemConstructorOptions, window: E.BrowserWindow) => {
    toggleDetachedDevTools(window.webContents);
  });

  map.set("toggle-settings-developer-tools", (item: E.MenuItemConstructorOptions, window: E.BrowserWindow) => {
    app.emit("toggle-settings-developer-tools");
  });

  map.set("close-window", () => {
    app.exit();
  });

  map.set("sign-out", () => {
    app.emit("sign-out");
  });

  return map;
};
