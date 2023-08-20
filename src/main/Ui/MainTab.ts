import { parse } from "url";
import {
  app,
  shell,
  ipcMain,
  IpcMainEvent,
  BrowserView,
  BrowserViewConstructorOptions,
  Rectangle,
  BrowserWindow,
  DidCreateWindowDetails,
} from "electron";

import { LOGIN_PAGE, RECENT_FILES } from "Const";
import {
  preloadMainScriptPathDev,
  preloadMainScriptPathProd,
  toggleDetachedDevTools,
} from "Utils/Main";
import {
  isDev,
  isValidProjectLink,
  isPrototypeUrl,
  isAppAuthRedeem,
  isFigmaDocLink,
} from "Utils/Common";
import { storage } from "Main/Storage";
import { logger } from "Main/Logger";

export default class MainTab {
  public id: number;
  public view: BrowserView;

  constructor(private windowId: number) {
    this.initTab();
    this.registerEvents();
  }

  public loadUrl(url: string) {
    this.view.webContents.loadURL(url);
  }
  public loadLoginPage() {
    this.view.webContents.loadURL(LOGIN_PAGE);
  }
  public redeemAppAuth(secret: string) {
    this.view.webContents.send("redeemAppAuth", secret);
  }
  public handleUrl(path: string) {
    this.view.webContents.send("handleUrl", path);
  }
  public setAutosize(flag: boolean) {
    this.view.setAutoResize({
      width: flag,
      height: flag,
      horizontal: flag,
      vertical: flag,
    });
  }
  public setBounds(bounds: Rectangle) {
    this.view.setBounds(bounds);
  }

  private initTab() {
    const userId = storage.settings.userId;
    const url = `${RECENT_FILES}/?fuid=${userId}`;

    const options: BrowserViewConstructorOptions = {
      webPreferences: {
        nodeIntegration: false,
        webgl: true,
        contextIsolation: false,
        zoomFactor: 1,
        preload: isDev ? preloadMainScriptPathDev : preloadMainScriptPathProd,
      },
    };

    this.view = new BrowserView(options);
    this.id = this.view.webContents.id;

    this.loadUrl(url);
    this.setAutosize(true);

    isDev && toggleDetachedDevTools(this.view.webContents);

    app.emit("requestBoundsForTabView", this.windowId);
  }

  public updateScale(scale: number) {
    this.view.webContents.setZoomFactor(scale);
  }
  public reloadCurrentTheme() {
    app.emit("reloadCurrentTheme");
  }
  public loadTheme(theme: Themes.Theme) {
    this.view.webContents.send("loadCurrentTheme", theme);
  }

  private onMainTabWillNavigate(event: Event, url: string) {
    if (isValidProjectLink(url) || isPrototypeUrl(url)) {
      app.emit("openUrlInNewTab", url);

      event.preventDefault();
    }
  }
  private onDomReady(event: any) {
    this.reloadCurrentTheme();
  }
  private onMainWindowWillNavigate(event: any, newUrl: string) {
    const currentUrl = event.sender.getURL();

    if (isAppAuthRedeem(newUrl)) {
      return;
    }

    if (newUrl === currentUrl) {
      event.preventDefault();
      return;
    }

    if (isFigmaDocLink(newUrl)) {
      shell.openExternal(newUrl);

      event.preventDefault();
      return;
    }

    const from = parse(currentUrl);
    const to = parse(newUrl);

    if (from.pathname === "/login") {
      // this.tabManager.reloadAll();

      event.preventDefault();
      return;
    }

    if (to.pathname === "/logout") {
      app.emit("signOut");
    }

    if (to.search && to.search.match(/[\?\&]redirected=1/)) {
      event.preventDefault();
      return;
    }
  }
  private onNewWindow(window: BrowserWindow, details: DidCreateWindowDetails) {
    const url = details.url;
    logger.debug("newWindow, url: ", url);

    if (/start_google_sso/.test(url)) return;

    if (isPrototypeUrl(url) || isValidProjectLink(url)) {
      app.emit("openUrlInNewTab", url);
      return;
    }

    shell.openExternal(url);
  }

  private registerEvents() {
    this.view.webContents.on("will-navigate", this.onMainTabWillNavigate.bind(this));
    this.view.webContents.on("will-navigate", this.onMainWindowWillNavigate.bind(this));
    this.view.webContents.on("dom-ready", this.onDomReady.bind(this));
    this.view.webContents.on("did-create-window", this.onNewWindow.bind(this));
  }
}
