import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as E from "electron";
import * as url from "url";
import * as util from "util";

import Tabs from "./Tabs";
import Fonts from "../Fonts";
import { storage } from "../Storage";
import { logger } from "../Logger";
import { dialogs } from "../Dialogs";
import MenuState from "../MenuState";
import * as Const from "Const";
import {
  isDev,
  normalizeUrl,
  isValidProjectLink,
  isPrototypeUrl,
  isAppAuthGrandLink,
  isAppAuthRedeem,
  parseURL,
  isFigmaDocLink,
  isCommunityUrl,
} from "Utils/Common";
import {
  winUrlDev,
  winUrlProd,
  toggleDetachedDevTools,
  getThemesFromDirectory,
  setMenuFromTemplate,
  buildActionToMenuItemMap,
  resetMenu,
  loadCreatorTheme,
  getThemeById,
  saveCreatorTheme,
  exportCreatorTheme,
  updateThemesFromRepository,
  getThemesCount,
  updateIds,
} from "Utils/Main";
import { registerIpcMainHandlers } from "Main/events";

class WindowManager {
  home: string;
  mainWindow: E.BrowserWindow;
  settingsView: E.BrowserView | null = null;
  themeCreatorView: E.BrowserView | null = null;
  mainTab: E.BrowserView;
  figmaUiScale: number;
  panelScale: number;
  closedTabsHistory: Array<string> = [];
  tabsWereRestored: boolean;
  themes: Themes.Theme[] = [];
  currentTheme: Themes.Theme;
  creatorTheme: Themes.Theme;
  private lastFocusedTab: E.WebContents;
  private tabs: Tab[];
  private menu: E.Menu;
  private static _instance: WindowManager;
  private panelHeight = storage.get().app.panelHeight;
  private enableColorSpaceSrgbWasChanged = false;
  private figmaUserIDs: string[] = [];

  private constructor() {
    this.home = Const.HOMEPAGE;
    this.figmaUiScale = storage.get().ui.scaleFigmaUI;
    this.panelScale = storage.get().ui.scalePanel;
    this.figmaUserIDs = storage.get().authedUserIDs;
    this.tabsWereRestored = false;

    const options: E.BrowserWindowConstructorOptions = {
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
        enableRemoteModule: true,
        contextIsolation: false,
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

    updateIds().then(() => {
      this.updateThemes();
    });

    getThemeById().then(theme => {
      this.currentTheme = theme;
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

  openUrl = (url: string): void => {
    if (isAppAuthRedeem(url)) {
      const normalizedUrl = normalizeUrl(url);
      const tab = Tabs.getTabByIndex(0);

      tab.view.webContents.loadURL(normalizedUrl);
    } else if (/figma:\/\//.test(url)) {
      this.addTab("loadContent.js", url.replace(/figma:\//, Const.HOMEPAGE));
    } else if (/https?:\/\//.test(url)) {
      this.addTab("loadContent.js", url);
    }
  };

  loadRecentFilesMainTab = (): void => {
    this.mainTab.webContents.loadURL(Const.RECENT_FILES);
  };

  private restoreTabs = () => {
    const tabs = storage.get().app.lastOpenedTabs;

    if (Array.isArray(tabs) && tabs.length) {
      tabs.forEach((tab, i) => {
        setTimeout(() => {
          this.addTab("loadContent.js", tab.url, tab.title);
          if (i === tabs.length - 1) {
            this.tabsWereRestored = true;
          }
        }, 500 * i);
      });

      storage.clearLastOpenedTabs();

      MenuState.updateInFileBrowserActionState();
    } else {
      this.tabsWereRestored = true;
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
    E.ipcMain.on("window-maximize", (event: E.IpcMainEvent) => {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.restore();
        event.reply("did-restored");
      } else {
        this.mainWindow.maximize();
        event.reply("did-maximized");
      }
    });
    E.ipcMain.on("closeTab", (event, id) => {
      this.closeTab(id);
    });
    E.ipcMain.on("setTabFocus", (event, id) => {
      this.focusTab(id);

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

      this.mainWindow.webContents.send("setTitle", { id: tab.view.webContents.id, title });
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
      const tab = Tabs.getByWebContentId(event.sender.id);

      if (!tab) {
        return;
      }

      if (tab.view.webContents.id !== this.mainTab.webContents.id) {
        MenuState.updatePluginState(pluginMenu);
      } else {
        MenuState.updateInFileBrowserActionState();
      }
    });
    E.ipcMain.on("registerManifestChangeObserver", (event: any, callbackId: any) => {
      const tab = Tabs.getByWebContentId(event.sender.id);

      if (!tab) {
        return;
      }
    });
    E.ipcMain.on("setTabUrl", (event, url: string) => {
      const tab = Tabs.getByWebContentId(event.sender.id);

      if (!tab) {
        return;
      }

      this.mainWindow.webContents.send("setTabUrl", { id: tab.view.webContents.id, url });
    });
    E.ipcMain.on("updateFileKey", (event, key) => {
      const tab = Tabs.getByWebContentId(event.sender.id);

      if (!tab) {
        return;
      }

      this.mainWindow.webContents.send("updateFileKey", { id: tab.view.webContents.id, fileKey: key });
    });
    E.ipcMain.on("updateActionState", (_, state) => {
      MenuState.updateActionState(state);
    });
    E.ipcMain.on("openFile", (_, ...args) => {
      let url = `${this.home}${args[0]}`;

      if (args[2]) {
        url = `${url}${args[2]}`;
      }

      this.addTab("loadContent.js", url);
    });
    E.ipcMain.on("setFeatureFlags", (_, args) => {
      storage.setFeatureFlags(args.featureFlags);
    });
    E.ipcMain.on("openDevTools", (event, mode) => {
      if (event.sender) {
        event.sender.openDevTools({ mode });
      }
    });
    E.ipcMain.on("startAppAuth", (_, args) => {
      if (isAppAuthGrandLink(args.grantPath)) {
        const url = `${this.home}${args.grantPath}?desktop_protocol=figma`;

        E.shell.openExternal(url);
      }
    });
    E.ipcMain.on("finishAppAuth", (_, args) => {
      const url = `${this.home}${args.redirectURL}`;

      this.mainTab.webContents.loadURL(url);
    });
    E.ipcMain.on("setAuthedUsers", (_, userIds) => {
      this.setFigmaUserIDs(userIds);
    });
    E.ipcMain.on("setUsingMicrophone", (event, isUsingMicrophone) => {
      const tab = Tabs.getByWebContentId(event.sender.id);

      if (!tab) {
        return;
      }

      this.mainWindow.webContents.send("setUsingMicrophone", { id: tab.view.webContents.id, isUsingMicrophone });
    });
    E.ipcMain.on("requestMicrophonePermission", event => {
      const tab = Tabs.getByWebContentId(event.sender.id);

      if (!tab || tab.micAccess) {
        return;
      }

      tab.view.webContents.session.setPermissionRequestHandler((webContents, permission, cb) => {
        const id = dialogs.showMessageBoxSync({
          type: "question",
          title: "Figma",
          message: "Microphone access required for voice call.",
          detail: `Allow microphone access?`,
          textOkButton: "Allow",
          textCancelButton: "Deny",
          defaultFocusedButton: "Ok",
        });

        if (id === 0 && permission === "media") {
          return cb(true);
        }

        return cb(false);
      });
    });
    E.ipcMain.on("setIsInVoiceCall", (event, isInVoiceCall) => {
      const tab = Tabs.getByWebContentId(event.sender.id);

      if (!tab) {
        return;
      }

      this.mainWindow.webContents.send("setIsInVoiceCall", { id: tab.view.webContents.id, isInVoiceCall });
    });
    E.ipcMain.on("setWorkspaceName", (event, name) => {
      logger.info("The setWorkspaceName not implemented, workspaceName: ", name);
    });
    E.ipcMain.on("setFigjamEnabled", (event, enabled) => {
      logger.info("The setFigjamEnabled not implemented, enabled: ", enabled);
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
        const id = dialogs.showMessageBoxSync({
          type: "question",
          title: "Figma",
          message: "Restart to Change Color Space?",
          detail: `Figma needs to be restarted to change the color space.`,
          textOkButton: "Restart",
          defaultFocusedButton: "Ok",
        });

        if (!id) {
          E.app.relaunch();
          E.app.quit();
        }
      }

      this.destroyView(this.settingsView);
    });
    E.ipcMain.on("closeThemeCreatorView", () => {
      if (!this.themeCreatorView) {
        return;
      }

      if (this.themeCreatorView.webContents.isDevToolsOpened()) {
        this.themeCreatorView.webContents.closeDevTools();
      }

      this.mainWindow.removeBrowserView(this.themeCreatorView);

      this.destroyView(this.themeCreatorView);
    });
    E.ipcMain.on("updateFigmaUiScale", (event, scale) => {
      this.updateFigmaUiScale(scale);
    });
    E.ipcMain.on("updatePanelScale", (event, scale) => {
      this.updatePanelScale(scale);
    });
    E.ipcMain.on("updateVisibleNewProjectBtn", (_, visible) => {
      this.mainWindow.webContents.send("updateVisibleNewProjectBtn", visible);
    });
    E.ipcMain.on("themes-change", (_, theme) => {
      if (theme.id === Const.TEST_THEME_ID) {
        const testTheme = this.themes.find(t => t.id === theme.id);

        if (testTheme) {
          testTheme.palette = theme.palette;
        }
      }

      this.changeTheme(theme);
    });
    E.ipcMain.on("set-default-theme", () => {
      this.changeTheme(Const.DEFAULT_THEME);
    });
    E.ipcMain.on("saveCreatorTheme", (_, theme) => {
      saveCreatorTheme(theme);
      if (theme.id === Const.TEST_THEME_ID) {
        const testTheme = this.themes.find(t => t.id === theme.id);

        if (testTheme) {
          testTheme.palette = theme.palette;
        }
      }

      this.creatorTheme = theme;
    });
    E.ipcMain.on("themeCreatorExportTheme", (_, theme) => {
      exportCreatorTheme(theme);
    });
    E.ipcMain.on("sync-themes", async () => {
      logger.debug("Sync themes start");
      if (this.isActive(this.settingsView)) {
        this.settingsView.webContents.send("sync-themes-start");
      }

      await updateThemesFromRepository();
      await this.updateThemes();

      if (this.isActive(this.settingsView)) {
        this.settingsView.webContents.send("sync-themes-end");
      }
      logger.debug("Sync themes end");
    });
    E.ipcMain.on("getCurrentTheme", (event, id) => {
      getThemeById(id).then(theme => {
        event.returnValue = theme;
      });
    });
    E.ipcMain.on("set-clipboard-data", (event, data) => {
      const format = data.format;
      const buffer = Buffer.from(data.data);

      if (["image/jpeg", "image/png"].indexOf(format) !== -1) {
        E.clipboard.writeImage(E.nativeImage.createFromBuffer(buffer));
      } else if (format === "image/svg+xml") {
        E.clipboard.writeText(buffer.toString());
      } else if (format === "application/pdf") {
        E.clipboard.writeBuffer("Portable Document Format", buffer);
      } else {
        E.clipboard.writeBuffer(format, buffer);
      }
    });
    E.ipcMain.handle("get-fonts", async () => {
      let dirs = storage.get().app.fontDirs;

      if (!dirs) {
        dirs = Const.DEFAULT_SETTINGS.app.fontDirs;
      }

      return Fonts.getFonts(dirs);
    });
    E.ipcMain.handle("get-font-file", async (event, data) => {
      const file = await Fonts.getFontFile(data.path);

      if (file && file.byteLength > 0) {
        return file;
      }

      return null;
    });

    E.app.on("handlePluginMenuAction", pluginMenuAction => {
      this.lastFocusedTab.send("handlePluginMenuAction", pluginMenuAction);
    });
    E.app.on("toggle-current-tab-devtools", () => {
      toggleDetachedDevTools(this.lastFocusedTab);
    });
    E.app.on("openSettingsView", () => {
      this.enableColorSpaceSrgbWasChanged = false;
      this.initSettingsView();
    });
    E.app.on("openThemeCreatorView", () => {
      this.initThemeCreatorView();
    });
    E.app.on("sign-out", () => {
      this.logoutAndRestart();
    });
    E.app.on("toggle-settings-developer-tools", () => {
      if (this.settingsView && this.isActive(this.settingsView)) {
        toggleDetachedDevTools(this.settingsView.webContents);
      } else if (this.themeCreatorView && this.isActive(this.themeCreatorView)) {
        toggleDetachedDevTools(this.themeCreatorView.webContents);
      }
    });
    E.app.on("handleUrl", (senderId, path) => {
      if (senderId !== this.mainTab.webContents.id) {
        this.focusMainTab();
      }

      this.mainTab.webContents.send("handleUrl", path);
    });
    E.app.on("handle-command", (sender, id) => {
      switch (id) {
        case "scale-normal": {
          this.updateAllScale();
          break;
        }
        case "scale-inc0.1": {
          this.updateAllScale(0.1);
          break;
        }
        case "scale-dic0.1": {
          this.updateAllScale(-0.1);
          break;
        }
        case "scale-inc0.05": {
          this.updateAllScale(0.05);
          break;
        }
        case "scale-dic0.05": {
          this.updateAllScale(-0.05);
          break;
        }
        case "openFileBrowser": {
          this.focusMainTab();
          break;
        }
        case "reopenClosedTab": {
          if (this.closedTabsHistory.length <= 0) return;

          const url = this.closedTabsHistory.pop();
          const script = isValidProjectLink(url) ? "loadContent.js" : "loadMainContent.js";

          this.addTab(script, url);
          break;
        }
        case "closeTab": {
          const tab = Tabs.getByWebContentId(sender.id);

          if (!tab) {
            return;
          }

          this.mainWindow.webContents.send("closeTab", { id: tab.view.webContents.id });
          this.closeTab(tab.view.webContents.id);
          break;
        }
        case "newFile": {
          this.newProject();
          break;
        }
        case "chrome://gpu": {
          this.addTab("", `chrome://gpu`, "chrome://gpu/");
          break;
        }
        case "openFileUrlClipboard": {
          const uri = E.clipboard.readText();

          if (isValidProjectLink(uri) || isPrototypeUrl(uri)) {
            this.addTab("loadContent.js", normalizeUrl(uri));
          }

          if (isCommunityUrl(uri)) {
            const parsedUrl = url.parse(uri);
            this.mainTab.webContents.send("handleUrl", parsedUrl.path);
            this.focusMainTab();
          }
          break;
        }

        default: {
          logger.error("unavailable command id: ", id);
        }
      }
    });
  };

  public setFigmaUserIDs = (userIds: string[]): void => {
    if (!util.isDeepStrictEqual(this.figmaUserIDs, userIds)) {
      storage.setUserIds(userIds);
      this.figmaUserIDs = userIds;
    }

    if (userIds.length === 1) {
      storage.setUserId(userIds[0]);
    }
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

  public addTab = (scriptPreload = "loadMainContent.js", url = Const.RECENT_FILES, title?: string): E.BrowserView => {
    const userId = storage.get().userId;
    const tab = Tabs.newTab(`${url}?fuid=${userId}`, this.getBounds(), scriptPreload);

    tab.view.webContents.on("will-navigate", this.onMainWindowWillNavigate);
    tab.view.webContents.on("new-window", this.onNewWindow);

    MenuState.updateActionState(Const.ACTIONTABSTATE);

    this.mainWindow.addBrowserView(tab.view);
    if (this.lastFocusedTab && this.tabsWereRestored && this.lastFocusedTab.id !== tab.view.webContents.id) {
      this.focusTab(tab.view.webContents.id);
    } else {
      this.focusMainTab();
    }
    this.mainWindow.webContents.send("didTabAdd", {
      id: tab.view.webContents.id,
      url,
      showBackBtn: true,
      title,
      focused:
        this.lastFocusedTab && this.tabsWereRestored ? this.lastFocusedTab.id === tab.view.webContents.id : false,
    });

    tab.view.webContents.session.setPermissionRequestHandler((webContents, permission, cb) => {
      if (permission === "media") {
        if (tab.micAccess) {
          return cb(true);
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
          Tabs.setMicAccess(tab.view.webContents.id, true);

          return cb(true);
        }
      }

      return cb(false);
    });

    return tab.view;
  };

  public addMainTab = (): E.BrowserView => {
    const userId = storage.get().userId;
    const url = `${Const.RECENT_FILES}/?fuid=${userId}`;
    const tab = Tabs.newTab(url, this.getBounds(), "loadMainContent.js", false);

    this.mainWindow.addBrowserView(tab.view);
    this.mainWindow.setTopBrowserView(tab.view);

    tab.view.webContents.on("will-navigate", this.onMainTabWillNavigate);
    tab.view.webContents.on("will-navigate", this.onMainWindowWillNavigate);
    tab.view.webContents.on("new-window", this.onNewWindow);

    MenuState.updateInFileBrowserActionState();

    this.lastFocusedTab = tab.view.webContents;

    return tab.view;
  };

  public focusTab = (webContentsId: number): void => {
    const neededTab = Tabs.getByWebContentId(webContentsId);

    if (!neededTab) {
      this.mainWindow.setTopBrowserView(this.mainTab);
      this.lastFocusedTab = this.mainTab.webContents;

      return;
    }

    this.mainWindow.setTopBrowserView(neededTab.view);
    this.lastFocusedTab = neededTab.view.webContents;
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

  private initThemeCreatorView = () => {
    this.themeCreatorView = new E.BrowserView({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        experimentalFeatures: false,
        enableRemoteModule: true,
      },
    });

    this.mainWindow.addBrowserView(this.themeCreatorView);

    const windowBounds = this.mainWindow.getBounds();

    this.themeCreatorView.setBounds({
      height: windowBounds.height,
      width: windowBounds.width,
      y: 0,
      x: 0,
    });

    this.themeCreatorView.setAutoResize({
      width: true,
      height: true,
      horizontal: true,
      vertical: true,
    });

    this.themeCreatorView.webContents.loadURL(isDev ? winUrlDev : winUrlProd);

    this.themeCreatorView.webContents.on("did-finish-load", () => {
      this.themeCreatorView.webContents.send("renderView", "ThemeCreator");
      this.themeCreatorView.webContents.send("getUploadedThemes", this.themes);
      this.themeCreatorView.webContents.send("loadCreatorTheme", this.creatorTheme);
    });
  };

  private logoutAndRestart = (event?: E.Event): void => {
    const request = E.net.request({
      url: Const.LOGOUT_PAGE,
      useSessionCookies: true,
    });

    request.on("response", async () => {
      this.setFigmaUserIDs([]);
      try {
        await Promise.all([E.session.defaultSession.clearStorageData(), E.session.defaultSession.clearCache()]);
      } finally {
        Tabs.closeAll();

        this.mainWindow.setBrowserView(this.mainTab);
        this.mainTab.webContents.loadURL(Const.LOGIN_PAGE);

        this.mainWindow.webContents.send("closeAllTab");
      }
    });
    request.on("error", error => logger.error("Logout error: ", error));
    request.end();

    event && event.preventDefault();
    return;
  };

  private changeTheme = (theme: Themes.Theme) => {
    this.mainTab.webContents.send("themes-change", theme);
    this.mainWindow.webContents.send("themes-change", theme);

    if (this.settingsView && this.isActive(this.settingsView)) {
      this.settingsView.webContents.send("themes-change", theme);
    }
    if (this.themeCreatorView && this.isActive(this.themeCreatorView)) {
      this.themeCreatorView.webContents.send("themes-change", theme);
    }

    const tabs = Tabs.getAll();

    tabs.forEach(tab => {
      tab.view.webContents.send("themes-change", theme);
    });

    storage.setTheme(theme.id);
  };

  private onNewWindow = (event: Event, url: string) => {
    event.preventDefault();
    logger.debug("newWindow, url: ", url);

    if (/start_google_sso/.test(url)) return;

    if (isPrototypeUrl(url) || isValidProjectLink(url)) {
      this.addTab("loadContent.js", url);
      return;
    }

    E.shell.openExternal(url);
  };

  private focusMainTab = (): void => {
    this.focusTab(this.mainTab.webContents.id);

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
    const currentTab = Tabs.getByWebContentId(id);
    const currentTabUrl = currentTab.view.webContents.getURL();
    const currentTabIndex = Tabs.getTabIndex(id);

    this.mainWindow.removeBrowserView(currentTab.view);
    Tabs.close(id);

    const index = currentTabIndex > 0 ? currentTabIndex - 1 : currentTabIndex;
    const nextTab = Tabs.getTabByIndex(index);

    if (nextTab) {
      this.focusTab(nextTab.view.webContents.id);
    } else {
      this.focusTab(this.mainTab.webContents.id);
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

    views.forEach(tab => {
      tab.view.webContents.setZoomFactor(this.figmaUiScale);
    });
  };

  private updateFigmaUiScale = (figmaScale: number): void => {
    const views = Tabs.getAll();

    this.figmaUiScale = +figmaScale.toFixed(2);

    views.forEach(tab => {
      tab.view.webContents.setZoomFactor(+figmaScale.toFixed(2));
    });
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

    views.forEach(tab => {
      tab.view.setBounds(bounds);
    });
  };

  private updateThemes = async (): Promise<void> => {
    this.mainWindow.webContents.on("dom-ready", () => {
      this.mainWindow.webContents.send("getUploadedThemes", this.themes);
    });

    [this.creatorTheme, this.currentTheme] = await Promise.all([loadCreatorTheme(), getThemeById()]);
    const themesCount = await getThemesCount();

    logger.debug("themes count: ", themesCount);

    if (themesCount === 0) {
      logger.debug("Download themes from repository...");
      await updateThemesFromRepository();
      logger.debug("Download themes successful");
    }

    this.themes = await getThemesFromDirectory();
    this.mainWindow.webContents.send("getUploadedThemes", this.themes);

    if (this.isActive(this.settingsView)) {
      this.settingsView.webContents.send("getUploadedThemes", this.themes);
    }
  };

  private isActive = (view: E.BrowserView): boolean => {
    if (!view || !view.webContents) {
      return false;
    }

    return !view.webContents.isDestroyed();
  };

  private destroyView = (view: E.BrowserView): void => {
    view.webContents.destroy();
  };

  private installReactDevTools = (): void => {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: string) => logger.info(`Added Extension:  ${name}`))
      .catch((err: Error) => logger.error("An error occurred: ", err));
  };
}

export default WindowManager;
