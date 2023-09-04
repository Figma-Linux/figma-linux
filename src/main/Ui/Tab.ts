import { parse } from "url";
import {
  app,
  shell,
  ipcMain,
  BrowserView,
  Rectangle,
  IpcMainEvent,
  BrowserWindow,
  DidCreateWindowDetails,
  BrowserViewConstructorOptions,
  WebContents,
  PermissionRequestHandlerHandlerDetails,
} from "electron";

import { preloadScriptPathDev, preloadScriptPathProd } from "Utils/Main";
import {
  isDev,
  isValidProjectLink,
  isPrototypeUrl,
  isAppAuthRedeem,
  isFigmaDocLink,
} from "Utils/Common";
import { dialogs } from "Main/Dialogs";
import { logger } from "Main/Logger";

export default class Tab {
  public id: number;
  public title?: string;
  public url?: string;
  public moves?: boolean;
  public fileKey?: string;
  public isUsingMicrophone?: boolean;
  public isInVoiceCall?: boolean;
  public view: BrowserView;

  constructor(private windowId: number) {
    this.initTab();
    this.registerEvents();
  }

  public loadUrl(url: string) {
    this.url = url;
    this.view.webContents.loadURL(url);
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
    const options: BrowserViewConstructorOptions = {
      webPreferences: {
        nodeIntegration: false,
        webgl: true,
        contextIsolation: false,
        zoomFactor: 1,
        preload: isDev ? preloadScriptPathDev : preloadScriptPathProd,
      },
    };

    this.view = new BrowserView(options);
    this.id = this.view.webContents.id;

    this.setAutosize(true);

    app.emit("requestBoundsForTabView", this.windowId);
  }

  public updateScale(scale: number) {
    this.view.webContents.setZoomFactor(scale);
  }
  public reloadCurrentTheme() {
    app.emit("reloadCurrentTheme");
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

    // window.close();

    if (/start_google_sso/.test(url)) return;

    if (isPrototypeUrl(url) || isValidProjectLink(url)) {
      app.emit("openUrlInNewTab", url);
      return;
    }

    shell.openExternal(url);
  }

  private permissionHandler(
    webContents: WebContents,
    permission:
      | "clipboard-read"
      | "clipboard-sanitized-write"
      | "display-capture"
      | "fullscreen"
      | "geolocation"
      | "idle-detection"
      | "media"
      | "mediaKeySystem"
      | "midi"
      | "midiSysex"
      | "notifications"
      | "pointerLock"
      | "openExternal"
      | "window-management"
      | "unknown",
    callback: (permissionGranted: boolean) => void,
    details: PermissionRequestHandlerHandlerDetails,
  ) {
    if (permission === "media") {
      if (this.isUsingMicrophone) {
        return callback(true);
      }

      const id = dialogs.showMessageBoxSync({
        type: "question",
        title: "Figma",
        message: "Microphone access required for voice call.",
        detail: `Allow microphone access?`,
        textOkButton: "Allow",
        textCancelButton: "Deny",
        defaultFocusedButton: "Ok",
      });

      if (id === 0) {
        this.isUsingMicrophone = true;

        return callback(true);
      }
    }

    return callback(false);
  }

  private registerEvents() {
    this.view.webContents.on("will-navigate", this.onMainWindowWillNavigate.bind(this));
    this.view.webContents.on("dom-ready", this.onDomReady.bind(this));
    this.view.webContents.on("did-create-window", this.onNewWindow.bind(this));

    this.view.webContents.session.setPermissionRequestHandler(this.permissionHandler.bind(this));
  }
}
