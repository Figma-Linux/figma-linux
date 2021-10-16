import * as E from "electron";
import * as path from "path";

import { isDev } from "Utils/Common";
import { storage } from "../Storage";
import WindowManager from "./WindowManager";

export default class Tabs {
  public static registeredCancelCallbackMap: Map<number, () => void> = new Map();

  private static tabs: Map<number, TabData> = new Map();

  public static newTab = (url: string, rect: E.Rectangle, preloadScript?: string, save = true): TabData => {
    const options: E.BrowserViewConstructorOptions = {
      webPreferences: {
        nodeIntegration: false,
        webgl: true,
        contextIsolation: false,
        worldSafeExecuteJavaScript: true,
        zoomFactor: 1,
      },
    };

    if (preloadScript !== "") {
      options.webPreferences.preload = path.resolve(
        isDev ? `${process.cwd()}/dist/` : `${__dirname}/../`,
        "renderer/middleware",
        preloadScript || "",
      );
    }

    const tab = new E.BrowserView(options);

    tab.setAutoResize({
      width: true,
      height: true,
      horizontal: true,
      vertical: true,
    });
    tab.setBounds(rect);
    tab.webContents.loadURL(url);
    tab.webContents.on("dom-ready", () => {
      const currentThemeId = storage.get().theme.currentTheme;
      if (currentThemeId !== "0") {
        const wm = WindowManager.instance;
        const foundTheme = wm.themes.find(theme => theme.id === currentThemeId);

        if (foundTheme) {
          tab.webContents.send("themes-change", foundTheme);
        }
      }
    });

    isDev && tab.webContents.toggleDevTools();

    const data = {
      micAccess: false,
      view: tab,
    };

    if (save) {
      Tabs.tabs.set(tab.webContents.id, data);
    }

    return data;
  };

  public static closeAll = (): void => {
    Tabs.tabs.forEach((_, id) => {
      if (id !== 1) {
        Tabs.tabs.delete(id);
      }
    });
  };

  public static close = (tabId: number): void => {
    Tabs.tabs.forEach((value, id) => {
      if (id === tabId) {
        value.view.webContents.loadURL("about:blank");

        if (value.view.webContents && !value.view.webContents.isDestroyed()) {
          value.view.webContents.destroy();
        }

        Tabs.tabs.delete(id);
      }
    });
  };

  public static reloadAll = (): void =>
    Tabs.tabs.forEach(t => (!t.view.webContents.isDestroyed() ? t.view.webContents.reload() : ""));

  public static getTabByIndex = (index: number): TabData | undefined => {
    let i = 0;
    let foundTab: TabData | undefined;

    Tabs.tabs.forEach(tab => {
      if (index === i) {
        foundTab = tab;
      }

      i++;
    });

    return foundTab;
  };

  public static getTabIndex = (webContentsId: number): number | undefined => {
    let i = 0;

    Tabs.tabs.forEach((_, id) => {
      if (webContentsId === id) {
        return;
      }

      i++;
    });

    return i;
  };

  public static getAll = (): Map<number, TabData> => Tabs.tabs;

  public static setMicAccess = (webContentsId: number, value: boolean): void => {
    Tabs.tabs.forEach((tab, id) => {
      if (id === webContentsId) {
        tab.micAccess = value;
      }
    });
  };

  public static getByWebContentId = (webContentsId: number): TabData | undefined => {
    let foundTab: TabData | undefined;

    Tabs.tabs.forEach((tab, id) => {
      if (id === webContentsId) {
        foundTab = tab;
      }
    });

    return foundTab;
  };
}
