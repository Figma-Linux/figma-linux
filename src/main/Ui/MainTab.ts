import { parse } from "url";
import {
  app,
  shell,
  BrowserView,
  BrowserViewConstructorOptions,
  Rectangle,
  BrowserWindow,
  DidCreateWindowDetails,
  Event,
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
  isFigmaBoardLink,
  isFigmaDesignLink,
} from "Utils/Common";
import { storage } from "Main/Storage";
import { logger } from "Main/Logger";
import { electron } from 'process';

export default class MainTab {
  private _userId: string;
  private options: BrowserViewConstructorOptions = {
    webPreferences: {
      nodeIntegration: false,
      webgl: true,
      contextIsolation: false,
      zoomFactor: 1,
      preload: isDev ? preloadMainScriptPathDev : preloadMainScriptPathProd,
    },
  };

  public id: number;
  public view: BrowserView;

  constructor(private windowId: number) {
    this.initTab();
    this.registerEvents();
  }

  public setUserId(id: string) {
    if (this._userId !== id) {
      const url = `${RECENT_FILES}/?fuid=${id}`;
      this.loadUrl(url);
    }

    this._userId = id;
  }
  public loadUrl(url: string) {
    this.view.webContents.loadURL(url);
  }
  public getUrl() {
    return this.view.webContents.getURL();
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
    this._userId = storage.settings.userId;
    const url = `${RECENT_FILES}/?fuid=${this._userId}`;

    this.view = new BrowserView(this.options);
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

  private onMainTabWillNavigate(event: Event<any>, url: string) {
    if (isValidProjectLink(url) || isPrototypeUrl(url)) {
      app.emit("openUrlInNewTab", url);

      event.preventDefault();
    }
  }
  private onDomReady(event: any) {
    this.reloadCurrentTheme();
  }
  private onMainWindowWillNavigate(event: Event<any>, url: string) {
    if (event?.sender) {
      const currentUrl = event.sender.getURL();
      if (isAppAuthRedeem(url)) {
        return;
      }

      if (url === currentUrl) {
        event.preventDefault();
        return;
      }


      const from = parse(currentUrl);
      const to = parse(url);

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

    if (isFigmaDocLink(url)) {
      shell.openExternal(url);
      event.preventDefault();
      return;
    }
    if (isFigmaBoardLink(url) || isFigmaDesignLink(url)) {
      app.emit("openUrlInNewTab", url);
      event.preventDefault();
      return;
    }
  }
  private onNewWindow(window: BrowserWindow, details: DidCreateWindowDetails) {
    const { url } = details;
    logger.debug("newWindow, url: ", url);

    if (/start_google_sso/.test(url)) return;

    if (isPrototypeUrl(url) || isValidProjectLink(url)) {
      app.emit("openUrlInNewTab", url);
      return;
    }
    if (isFigmaBoardLink(url) || isFigmaDesignLink(url)) {
      window.destroy()
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
