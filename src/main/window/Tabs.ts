import * as E from "electron";
import * as path from "path";

import { DEFAULT_SETTINGS } from "Const";
import { isDev } from "Utils/Common";
// import { getThemeById } from "Utils/Main";
import Fonts from "../Fonts";
import { storage } from "../Storage";
import { logger } from "../Logger";

export default class Tabs {
  public static registeredCancelCallbackMap: Map<number, Function> = new Map();

  private static tabs: Array<E.BrowserView> = [];

  public static newTab = (url: string, rect: E.Rectangle, preloadScript?: string, save = true): E.BrowserView => {
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
      let dirs = storage.get().app.fontDirs;

      // const currentThemeId = Settings.getSync("theme.currentTheme") as string;
      // if (currentThemeId !== "0") {
      //   getThemeById(currentThemeId).then(theme => {
      //     E.app.emit("themes-change", theme);
      //   });
      // }

      if (!dirs) {
        dirs = DEFAULT_SETTINGS.app.fontDirs;
      }
      Fonts.getFonts(dirs)
        .catch(err => logger.error(`Failed to load local fonts, error: ${err}`))
        .then(fonts => {
          tab.webContents.send("updateFonts", fonts);
        });
    });

    isDev && tab.webContents.toggleDevTools();

    if (save) {
      Tabs.tabs.push(tab);
    }

    return tab;
  };

  public static closeAll = () => {
    Tabs.tabs = Tabs.tabs.filter(t => {
      if (t.webContents.id != 1) {
        return false;
      } else {
        return true;
      }
    });
  };

  public static close = (id: number) => {
    Tabs.tabs = Tabs.tabs.filter(t => {
      if (t.webContents.id != id) {
        return true;
      } else {
        // FIXME: https://github.com/electron/electron/pull/23578#issuecomment-703736447
        t.webContents.loadURL("about:blank");
        if (!t.webContents.isDestroyed()) {
          (t.webContents as any).destroy();
        }
        return false;
      }
    });
  };

  public static reloadAll = () => Tabs.tabs.forEach(t => (!t.webContents.isDestroyed() ? t.webContents.reload() : ""));

  public static focus = (id: number): E.BrowserView => {
    return Tabs.tabs.find(t => t.webContents.id === id) as E.BrowserView;
  };

  public static getTab = (webContentsId: number): E.BrowserView | undefined => {
    let tab: E.BrowserView | undefined;

    Tabs.tabs.forEach(t => {
      if (t.webContents.id === webContentsId) {
        tab = t;
      }
    });

    return tab;
  };

  public static getTabByIndex = (index: number): E.BrowserView | undefined => {
    return Tabs.tabs[index];
  };

  public static getTabIndex = (webContentsId: number): number | undefined => {
    let index: number | undefined;

    Tabs.tabs.forEach((t, i) => {
      if (t.webContents.id === webContentsId) {
        index = i;
      }
    });

    return index;
  };

  public static getAll = (): Array<E.BrowserView> => Tabs.tabs;

  public static getByWebContentId = (id: number): E.BrowserView | undefined => {
    for (const tab of Tabs.tabs) {
      if (tab.webContents.id === id) {
        return tab;
      }
    }

    return undefined;
  };
}
