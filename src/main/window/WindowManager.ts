import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as E from "electron";
import * as url from "url";

import Tabs from "./Tabs";
import { storage } from "../Storage";
import { logger } from "../Logger";
import Commander from "../Commander";
import MenuState from "../MenuState";
import * as Const from "Const";
import {
  isDev,
  isProtoLink,
  normalizeUrl,
  isValidProjectLink,
  isPrototypeUrl,
  isAppAuthGrandLink,
  isAppAuthRedeem,
  parseURL,
  isFigmaDocLink,
} from "Utils/Common";
import {
  winUrlDev,
  winUrlProd,
  toggleDetachedDevTools,
  getThemesFromDirectory,
  setMenuFromTemplate,
  buildActionToMenuItemMap,
  resetMenu,
  showMessageBoxSync,
} from "Utils/Main";
import { registerIpcMainHandlers } from "Main/events";

class WindowManager {
  home: string;
  mainWindow: E.BrowserWindow;
  settingsView: E.BrowserView | null = null;
  mainTab: E.BrowserView;
  figmaUiScale: number;
  panelScale: number;
  closedTabsHistory: Array<string> = [];
  themes: Themes.Theme[] = [];
  private tabs: Tab[];
  private menu: E.Menu;
  private static _instance: WindowManager;
  private panelHeight = storage.get().app.panelHeight;
  private enableColorSpaceSrgbWasChanged = false;

  private constructor() {
    this.home = Const.HOMEPAGE;
    this.figmaUiScale = storage.get().ui.scaleFigmaUI;
    this.panelScale = storage.get().ui.scalePanel;

    const options: E.BrowserWindowConstructorOptions = {
      width: 1200,
      height: 900,
      frame: false,
      webPreferences: {
        sandbox: false,
        zoomFactor: 1,
        nodeIntegration: true,
        nodeIntegrationInWorker: false,
        webviewTag: false,
        webSecurity: false,
        webgl: true,
        experimentalFeatures: true,
        enableRemoteModule: true,
      },
    };

    this.mainWindow = new E.BrowserWindow(options);
    this.mainWindow.loadURL(isDev ? winUrlDev : winUrlProd);

    this.initMenu();

    this.mainTab = this.addMainTab();

    this.mainWindow.on("resize", this.updateBounds);
    this.mainWindow.on("maximize", () => setTimeout(() => this.updateBounds(), 100));
    this.mainWindow.on("unmaximize", () => setTimeout(() => this.updateBounds(), 100));
    this.mainWindow.on("move", () => setTimeout(() => this.updateBounds(), 100));

    isDev && this.installReactDevTools();
    isDev && this.mainWindow.webContents.openDevTools({ mode: "detach" });

    this.addIpc();
    registerIpcMainHandlers();

    E.app.on("will-quit", this.onWillQuit);

    if (storage.get().app.saveLastOpenedTabs) {
      setTimeout(() => this.restoreTabs(), 1000);
    }

    getThemesFromDirectory()
      .then(themes => {
        this.themes = themes;
      })
      .catch(error => {
        throw new Error(error);
      });

    this.updatePanelScale(this.panelScale);
  }

  static get instance(): WindowManager {
    if (WindowManager._instance) {
      return WindowManager._instance;
    }

    WindowManager._instance = new WindowManager();

    return WindowManager._instance;
  }

  openUrl = (url: string) => {
    if (isAppAuthRedeem(url)) {
      const normalizedUrl = normalizeUrl(url);
      const tab = Tabs.getAll()[0];

      tab.webContents.loadURL(normalizedUrl);
    } else if (/figma:\/\//.test(url)) {
      this.addTab("loadContent.js", url.replace(/figma:\//, Const.HOMEPAGE));
    } else if (/https?:\/\//.test(url)) {
      this.addTab("loadContent.js", url);
    }
  };

  loadRecentFilesMainTab = () => {
    this.mainTab.webContents.loadURL(Const.RECENT_FILES);
  };

  private restoreTabs = () => {
    const tabs = storage.get().app.lastOpenedTabs;

    if (Array.isArray(tabs) && tabs.length) {
      tabs.forEach((tab, i) => {
        setTimeout(() => {
          this.addTab("loadContent.js", tab.url, tab.title, false);
        }, 500 * i);
      });

      storage.clearLastOpenedTabs();

      MenuState.updateInFileBrowserActionState();
    }
  };

  private initMenu = (template?: E.MenuItemConstructorOptions[]) => {
    let pluginMenuData: Menu.MenuItem[] = [];
    this.menu = setMenuFromTemplate(pluginMenuData, template);
    const menuItemMap = buildActionToMenuItemMap(this.menu);

    this.menu = resetMenu(pluginMenuData, template);

    E.app.on("os-menu-invalidated", state => {
      if (Array.isArray(state.pluginMenuData)) {
        pluginMenuData = state.pluginMenuData;

        this.menu = resetMenu(pluginMenuData, template);
      }

      if (!state.actionState) return;

      for (const action of Object.keys(menuItemMap)) {
        const menuItem: E.MenuItem = menuItemMap[action];
        menuItem.enabled = state.actionState ? !!state.actionState[action] : false;
      }
    });
  };

  private newProject = (): void => {
    const currentView = this.addTab();
    const onDidFinishLoad = (): void => {
      currentView.webContents.send("newFile");
      currentView.webContents.removeListener("did-finish-load", onDidFinishLoad);
    };

    currentView.webContents.on("did-finish-load", onDidFinishLoad);
  };

  private onWillQuit = (): void => {
    const lastOpenedTabs: SavedTab[] = [];

    this.tabs.forEach(tab => {
      if (tab.id > 1) {
        lastOpenedTabs.push({
          title: tab.title,
          url: tab.url,
        });
      }
    });

    storage.setOpenedTabs(lastOpenedTabs);
  };

  private addIpc = (): void => {
    E.ipcMain.on("newTab", () => this.addTab());
    E.ipcMain.on("newProject", () => {
      this.newProject();
    });
    E.ipcMain.on("appExit", () => {
      E.app.quit();
    });
    E.ipcMain.on("window-minimize", () => {
      this.mainWindow.minimize();
    });
    E.ipcMain.on("window-maximize", () => {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.restore();
      } else {
        this.mainWindow.maximize();
      }
    });
    E.ipcMain.on("closeTab", (event, id) => {
      this.closeTab(id);
    });
    E.ipcMain.on("setTabFocus", (event, id) => {
      const view = Tabs.focus(id);
      this.mainWindow.setBrowserView(view);

      MenuState.updateInProjectActionState();
    });
    E.ipcMain.on("setFocusToMainTab", () => {
      this.focusMainTab();
    });
    E.ipcMain.on("closeAllTab", () => {
      logger.debug("Close all tab");
    });
    E.ipcMain.on("setTitle", (event, title) => {
      const tab = Tabs.getByWebContentId(event.sender.id);

      if (!tab) {
        return;
      }

      this.mainWindow.webContents.send("setTitle", { id: tab.webContents.id, title });
    });
    E.ipcMain.on("openMenu", () => {
      const windowWidth = this.mainWindow.getBounds().width;

      this.menu.popup({
        window: this.mainWindow,
        x: windowWidth - Const.MENU_WIDTH,
        y: this.panelHeight,
      });
    });
    E.ipcMain.on("setPluginMenuData", (event, pluginMenu) => {
      const currentView = this.mainWindow.getBrowserView();

      if (currentView.webContents.id !== this.mainTab.webContents.id) {
        MenuState.updatePluginState(pluginMenu);
      } else {
        MenuState.updateInFileBrowserActionState();
      }
    });
    E.ipcMain.on("registerManifestChangeObserver", (event: any, callbackId: any) => {
      logger.debug("registerManifestChangeObserver, callbackId: ", callbackId);
      const tab = Tabs.getByWebContentId(event.sender.id);

      if (!tab) {
        return;
      }
    });
    E.ipcMain.on("setTabUrl", (event: Event, url: string) => {
      const view = this.mainWindow.getBrowserView();

      if (!view) return;

      this.mainWindow.webContents.send("setTabUrl", { id: view.webContents.id, url });
    });
    E.ipcMain.on("updateFileKey", (event, key) => {
      const view = this.mainWindow.getBrowserView();

      if (!view) return;

      this.mainWindow.webContents.send("updateFileKey", { id: view.webContents.id, fileKey: key });
    });
    E.ipcMain.on("updateActionState", (event, state) => {
      MenuState.updateActionState(state);
    });
    E.ipcMain.on("openFile", (event, ...args) => {
      let url = `${this.home}${args[0]}`;

      if (args[2]) {
        url = `${url}${args[2]}`;
      }

      this.addTab("loadContent.js", url, undefined, false);
    });
    E.ipcMain.on("setFeatureFlags", (event, args) => {
      storage.setFeatureFlags(args.featureFlags);
    });
    E.ipcMain.on("openDevTools", (event, mode) => {
      if (event.sender) {
        event.sender.openDevTools({ mode });
      }
    });
    E.ipcMain.on("startAppAuth", (event, args) => {
      if (isAppAuthGrandLink(args.grantPath)) {
        const url = `${this.home}${args.grantPath}?desktop_protocol=figma`;

        E.shell.openExternal(url);
      }
    });
    E.ipcMain.on("finishAppAuth", (event, args) => {
      const url = `${this.home}${args.redirectURL}`;

      this.mainTab.webContents.loadURL(url);
    });
    E.ipcMain.on("receiveTabs", (event, tabs) => {
      this.tabs = tabs;
    });
    E.ipcMain.on("enableColorSpaceSrgbWasChanged", (event, enabled) => {
      const previousValue = storage.get().app.enableColorSpaceSrgb;

      if (enabled === previousValue) {
        return;
      }

      this.enableColorSpaceSrgbWasChanged = true;
    });
    E.ipcMain.on("closeSettingsView", () => {
      if (!this.settingsView) {
        return;
      }

      if (this.settingsView.webContents.isDevToolsOpened()) {
        this.settingsView.webContents.closeDevTools();
      }

      this.mainWindow.removeBrowserView(this.settingsView);

      if (this.enableColorSpaceSrgbWasChanged) {
        const id = showMessageBoxSync(this.mainWindow, {
          type: "none",
          title: "Figma",
          message: "Restart to Change Color Space?",
          detail: `Figma needs to be restarted to change the color space.`,
          buttons: ["Cancel", "Restart"],
          defaultId: 1,
        });

        if (id) {
          E.app.relaunch();
          E.app.quit();
        }
      }
    });
    E.ipcMain.on("updateFigmaUiScale", (event, scale) => {
      this.updateFigmaUiScale(scale);
    });
    E.ipcMain.on("updatePanelScale", (event, scale) => {
      this.updatePanelScale(scale);
    });
    E.ipcMain.on("updateVisibleNewProjectBtn", (event, visible) => {
      this.mainWindow.webContents.send("updateVisibleNewProjectBtn", visible);
    });

    E.app.on("openSettingsView", () => {
      this.enableColorSpaceSrgbWasChanged = false;
      this.initSettingsView();
    });
    E.app.on("sign-out", () => {
      this.logoutAndRestart();
    });
    E.app.on("toggle-settings-developer-tools", () => {
      if (this.settingsView) {
        toggleDetachedDevTools(this.settingsView.webContents);
      }
    });
    E.app.on("handleUrl", (senderId, url) => {
      if (senderId !== this.mainTab.webContents.id) {
        this.focusMainTab();
      }

      this.mainTab.webContents.send("handleUrl", url);
    });
    E.app.on("handle-command", (id: string) => {
      switch (id) {
        case "scale-normal":
          {
            this.updateAllScale();
          }
          break;
        case "scale-inc0.1":
          {
            this.updateAllScale(0.1);
          }
          break;
        case "scale-dic0.1":
          {
            this.updateAllScale(-0.1);
          }
          break;
        case "scale-inc0.05":
          {
            this.updateAllScale(0.05);
          }
          break;
        case "scale-dic0.05":
          {
            this.updateAllScale(-0.05);
          }
          break;
        case "openFileBrowser":
          {
            this.focusMainTab();
          }
          break;
        case "reopenClosedTab":
          {
            if (this.closedTabsHistory.length <= 0) return;

            const url = this.closedTabsHistory.pop();
            const script = isValidProjectLink(url) ? "loadContent.js" : "loadMainContent.js";

            this.addTab(script, url);
          }
          break;
        case "closeTab":
          {
            const currentView = this.mainWindow.getBrowserView();

            if (currentView.webContents.id === 1) return;

            this.mainWindow.webContents.send("closeTab", { id: currentView.webContents.id });
            this.closeTab(currentView.webContents.id);
          }
          break;
        case "newFile":
          {
            this.newProject();
          }
          break;
        case "chrome://gpu":
          {
            this.addTab("", `chrome://gpu`, "chrome://gpu/");
          }
          break;

        default: {
          Commander.exec(id);
        }
      }
    });
  };

  public tryHandleAppAuthRedeemUrl = (url: string): boolean => {
    if (isAppAuthRedeem(url)) {
      const normalizedUrl = normalizeUrl(url);
      const parsedUrl = parseURL(normalizedUrl);

      const secret = parsedUrl.searchParams.get("g_secret");
      if (secret) {
        this.mainTab.webContents.send("redeemAppAuth", secret);
        return true;
      }

      return true;
    }

    return false;
  };

  public addTab = (
    scriptPreload = "loadMainContent.js",
    url = `${this.home}/login`,
    title?: string,
    focused = true,
  ): E.BrowserView => {
    const tab = Tabs.newTab(url, this.getBounds(), scriptPreload);

    if (focused) {
      this.mainWindow.setBrowserView(tab);
    }

    tab.webContents.on("will-navigate", this.onMainWindowWillNavigate);
    tab.webContents.on("new-window", this.onNewWindow);

    MenuState.updateActionState(Const.ACTIONTABSTATE);

    this.mainWindow.webContents.send("didTabAdd", { id: tab.webContents.id, url, showBackBtn: true, title, focused });

    if (focused) {
      this.mainWindow.setBrowserView(tab);
    }

    return tab;
  };

  public addMainTab = (): E.BrowserView => {
    const url = `${this.home}/login`;
    const tab = Tabs.newTab(url, this.getBounds(), "loadMainContent.js", false);

    this.mainWindow.setBrowserView(tab);

    tab.webContents.on("will-navigate", this.onMainTabWillNavigate);
    tab.webContents.on("will-navigate", this.onMainWindowWillNavigate);
    tab.webContents.on("new-window", this.onNewWindow);

    MenuState.updateInFileBrowserActionState();

    return tab;
  };

  private initSettingsView = () => {
    this.settingsView = new E.BrowserView({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        experimentalFeatures: false,
        enableRemoteModule: true,
      },
    });

    this.mainWindow.addBrowserView(this.settingsView);

    const windowBounds = this.mainWindow.getBounds();

    this.settingsView.setBounds({
      height: windowBounds.height,
      width: windowBounds.width,
      y: 0,
      x: 0,
    });

    this.settingsView.setAutoResize({
      width: true,
      height: true,
      horizontal: true,
      vertical: true,
    });

    this.settingsView.webContents.loadURL(isDev ? winUrlDev : winUrlProd);

    this.settingsView.webContents.on("did-finish-load", () => {
      this.settingsView.webContents.send("renderView", "Settings");
      this.settingsView.webContents.send("getUploadedThemes", this.themes);

      isDev && this.settingsView.webContents.openDevTools({ mode: "detach" });
    });
  };

  private logoutAndRestart = (event?: E.Event): void => {
    E.net
      .request(`${this.home}/logout`)
      .on("response", response => {
        response.on("error", (err: Error) => {
          logger.error("Request error: ", err);
        });
        response.on("end", () => {
          if (response.statusCode >= 200 && response.statusCode <= 299) {
            E.session.defaultSession.cookies.flushStore().then(() => {
              const view = Tabs.focus(1);
              this.mainWindow.setBrowserView(view);
              view.webContents.reload();

              Tabs.closeAll();

              this.mainWindow.webContents.send("closeAllTab");
            });
          }

          if (response.statusCode >= 400) {
            E.session.defaultSession.clearStorageData();
            this.mainWindow.webContents.loadURL(`${this.home}`);
          }
        });
      })
      .end();

    event && event.preventDefault();
    return;
  };

  private onNewWindow = (event: Event, url: string) => {
    event.preventDefault();
    logger.debug("newWindow, url: ", url);

    if (/start_google_sso/.test(url)) return;

    if (isProtoLink(url)) {
      this.addTab("loadContent.js", url);
      return;
    }

    E.shell.openExternal(url);
  };

  private focusMainTab = (): void => {
    this.mainWindow.setBrowserView(this.mainTab);

    MenuState.updateInFileBrowserActionState();

    this.mainWindow.webContents.send("mainTabFocused");
  };

  private onMainTabWillNavigate = (event: E.Event, url: string): void => {
    if (isValidProjectLink(url) || isPrototypeUrl(url)) {
      this.addTab("loadContent.js", url);

      event.preventDefault();
    }
  };

  private onMainWindowWillNavigate = (event: any, newUrl: string): void => {
    const currentUrl = event.sender.getURL();

    if (isAppAuthRedeem(newUrl)) {
      return;
    }

    if (newUrl === currentUrl) {
      event.preventDefault();
      return;
    }

    if (isFigmaDocLink(newUrl)) {
      E.shell.openExternal(newUrl);

      event.preventDefault();
      return;
    }

    const from = url.parse(currentUrl);
    const to = url.parse(newUrl);

    if (from.pathname === "/login") {
      Tabs.reloadAll();

      event.preventDefault();
      return;
    }

    if (to.pathname === "/logout") {
      this.logoutAndRestart(event);
    }

    if (to.search && to.search.match(/[\?\&]redirected=1/)) {
      event.preventDefault();
      return;
    }
  };

  private closeTab = (id: number): void => {
    const currentTab = Tabs.getTab(id);
    const currentTabUrl = currentTab.webContents.getURL();
    const currentTabIndex = Tabs.getTabIndex(id);
    const currentView = this.mainWindow.getBrowserView();
    const currentViewId = currentView.webContents.id;

    this.mainWindow.removeBrowserView(currentTab);
    Tabs.close(id);

    const index = currentTabIndex > 0 ? currentTabIndex - 1 : currentTabIndex;
    const nextTab = Tabs.getTabByIndex(index);

    if (nextTab && currentViewId !== this.mainTab.webContents.id) {
      this.mainWindow.setBrowserView(nextTab);
    } else {
      this.mainWindow.setBrowserView(this.mainTab);
      MenuState.updateInFileBrowserActionState();
    }

    this.closedTabsHistory.push(currentTabUrl);
  };

  private updateAllScale = (scale?: number): void => {
    const views = Tabs.getAll();
    let panelHeight = 0;

    if (scale) {
      this.panelScale += scale;
      this.figmaUiScale += scale;
    } else {
      this.panelScale = 1;
      this.figmaUiScale = 1;
    }

    panelHeight = Math.floor(Const.TOPPANELHEIGHT * this.panelScale);
    this.panelHeight = panelHeight;
    this.mainWindow.webContents.send("updatePanelHeight", panelHeight);

    storage.setPanelHeight(panelHeight);

    this.mainWindow.webContents.send("updatePanelScale", this.panelScale);
    this.mainWindow.webContents.send("updateUiScale", this.figmaUiScale);

    this.updateBounds();

    for (const view of views) {
      view.webContents.setZoomFactor(this.figmaUiScale);
    }
  };

  private updateFigmaUiScale = (figmaScale: number): void => {
    const views = Tabs.getAll();

    this.figmaUiScale = +figmaScale.toFixed(2);

    for (const view of views) {
      view.webContents.setZoomFactor(+figmaScale.toFixed(2));
    }
  };

  private updatePanelScale = (panelScale: number): void => {
    let panelHeight = 0;

    this.panelScale = +panelScale.toFixed(2);
    panelHeight = Math.floor(Const.TOPPANELHEIGHT * panelScale);
    this.panelHeight = panelHeight;
    this.mainWindow.webContents.send("updatePanelHeight", panelHeight);

    storage.setPanelHeight(panelHeight);

    this.mainWindow.webContents.send("updatePanelScale", this.panelScale);
    this.updateBounds();
  };

  private getBounds = (): E.Rectangle => {
    return {
      x: 0,
      y: this.panelHeight,
      width: this.mainWindow.getContentBounds().width,
      height: this.mainWindow.getContentBounds().height - this.panelHeight,
    };
  };

  private updateBounds = (): void => {
    const views = Tabs.getAll();
    const bounds = this.getBounds();

    this.mainTab.setBounds(bounds);
    views.forEach((bw: E.BrowserView) => {
      bw.setBounds(bounds);
    });
  };

  private installReactDevTools = (): void => {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: string) => logger.info(`Added Extension:  ${name}`))
      .catch((err: Error) => logger.error("An error occurred: ", err));
  };
}

export default WindowManager;
