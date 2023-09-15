import { parse } from "url";
import { app, ipcMain, BrowserWindow, IpcMainEvent, Rectangle } from "electron";
import { storage } from "Main/Storage";
import MenuManager from "./Menu/MenuManager";
import SettingsView from "./SettingsView";
import TabManager from "./TabManager";

import {
  HOMEPAGE,
  WINDOW_DEFAULT_OPTIONS,
  TOPPANELHEIGHT,
  NEW_PROJECT_TAB_URL,
  NEW_FILE_TAB_TITLE,
} from "Const";
import { isDev, isCommunityUrl, isAppAuthRedeem, normalizeUrl } from "Utils/Common";
import { panelUrlDev, panelUrlProd, toggleDetachedDevTools } from "Utils/Main";
import Tab from "./Tab";

export default class Window {
  private window: BrowserWindow;
  private tabManager: TabManager;
  private menuManager: MenuManager;
  private settingsView: SettingsView;

  private closedTabsHistory: Types.SavedTab[] = [];

  constructor() {
    this.window = new BrowserWindow(WINDOW_DEFAULT_OPTIONS);
    this.tabManager = new TabManager(this.window.id);
    this.menuManager = new MenuManager();
    this.settingsView = new SettingsView();

    this.window.addBrowserView(this.tabManager.mainTab.view);
    this.window.setTopBrowserView(this.tabManager.mainTab.view);

    this.menuManager.initMainMenu();
    this.menuManager.updateMainTabState();

    this.window.loadURL(isDev ? panelUrlDev : panelUrlProd);
    isDev && toggleDetachedDevTools(this.window.webContents);

    this.registerEvents();
  }

  public get id() {
    return this.window.id;
  }
  public get webContentId() {
    return this.window.webContents.id;
  }
  public get settingsViewId() {
    return this.settingsView.view.webContents.id;
  }
  public get closedTabs() {
    return this.closedTabsHistory;
  }
  public get tabs() {
    return this.tabManager.getAll();
  }
  public get allWebContentsIds() {
    return [
      this.webContentId,
      this.settingsViewId,
      this.tabManager.mainTabWebContentId,
      this.tabManager.communityTabWebContentId,
      ...this.tabs.keys(),
    ];
  }

  public sortTabs(tabs: Types.TabFront[]) {
    this.tabManager.sortTabs(tabs);
  }
  public saveOpenedTabs() {
    storage.settings.app.lastOpenedTabs = {};
    storage.settings.app.lastOpenedTabs[this.id] = [];

    for (const [_, tab] of this.tabs) {
      storage.settings.app.lastOpenedTabs[this.id].push({
        title: tab.title,
        url: tab.url,
      });
    }
  }
  public restoreTabs() {
    const tabs = (
      storage.settings.app.lastOpenedTabs as {
        [key: string]: Types.SavedTab[];
      }
    )[this.id];

    if (!tabs) {
      return;
    }

    setTimeout(() => {
      tabs.forEach((tab, i) => {
        setTimeout(() => {
          this.addTab(tab.url, tab.title);
        }, 500 * i);
      });

      this.menuManager.updateMainTabState();
    }, 1000);
  }
  public restoreClosedTab() {
    const tabData = this.closedTabsHistory.pop();

    this.addTab(tabData.url, tabData.title);
  }

  public calcBoundsForTabView(): Rectangle {
    const panelHeight = storage.settings.app.panelHeight;
    return {
      x: 0,
      y: panelHeight,
      width: this.window.getContentBounds().width,
      height: this.window.getContentBounds().height - panelHeight,
    };
  }

  public handleUrl(path: string) {
    this.tabManager.handleUrl(path);
    this.setFocusToMainTab();
  }

  public openUrl(url: string) {
    if (isAppAuthRedeem(url)) {
      const normalizedUrl = normalizeUrl(url);

      this.tabManager.loadUrlInMainTab(normalizedUrl);
    } else if (isCommunityUrl(url)) {
      this.handleUrl(parse(url).path);
      this.setFocusToMainTab();
    } else if (/figma:\/\//.test(url)) {
      this.addTab(url.replace(/figma:\//, HOMEPAGE));
    } else if (/https?:\/\//.test(url)) {
      this.addTab(url);
    }
  }
  public focus() {
    this.window.focus();
  }
  public showHandler(event: IpcMainEvent) {
    const scale = storage.settings.ui.scalePanel;

    this.updatePanelScale(event, scale);
  }
  public toggleThemeCreatorPreviewMask() {
    this.settingsView.toggleThemeCreatorPreviewMask();
  }

  public updatePanelScale(_: IpcMainEvent, scale: number) {
    const panelScale = +scale.toFixed(2);

    storage.settings.app.panelHeight = Math.floor(TOPPANELHEIGHT * panelScale);
    storage.settings.ui.scalePanel = panelScale;

    this.window.webContents.send("setPanelScale", panelScale, storage.settings.app.panelHeight);

    this.updateTabsBounds();
  }
  public updateFigmaUiScale(_: IpcMainEvent, scale: number) {
    this.tabManager.updateScaleAll(scale);
  }
  public updateTabsBounds() {
    const bounds = this.calcBoundsForTabView();

    this.tabManager.setBoundsForAllTab(bounds);
  }
  public closeAllTab(_: IpcMainEvent) {
    const tabs = this.tabManager.getAll();

    for (const [_, tab] of tabs) {
      this.window.removeBrowserView(tab.view);
    }

    this.tabManager.closeAll();

    this.window.webContents.send("closeAllTab");
  }
  public loadLoginPageAllWindows() {
    this.tabManager.loadLoginPage();
  }
  public redeemAppAuth(secret: string) {
    this.tabManager.redeemAppAuth(secret);
  }

  public newProject() {
    if (this.tabManager.hasOpenedNewFileTab) {
      return;
    }

    const userId = storage.settings.userId;
    this.addTab(`${NEW_PROJECT_TAB_URL}?fuid=${userId}`, NEW_FILE_TAB_TITLE);
  }
  public createFile(args: WebApi.CreateFile) {
    const newFileTab = this.tabManager.getByTitle(NEW_FILE_TAB_TITLE);
    const tab = this.addTab(args.url);

    tab.loadUrl(args.url);
    this.closeTab(newFileTab.id);
    this.tabWasClosed(newFileTab.id);

    this.window.webContents.send("newFileBtnVisible", true);

    return true;
  }
  public openMainMenuHandler() {
    const width = this.window.getBounds().width;

    this.menuManager.openMainMenuHandler(
      width,
      this.window,
      this.openMainMenuCloseHandler.bind(this),
    );
  }
  private openMainMenuCloseHandler() {
    setTimeout(() => {
      this.window.webContents.send("isMainMenuOpen", false);
    }, 150);
  }
  public openTabMenu(tabId: number) {
    const url = this.tabManager.getTabUrl(tabId);

    this.menuManager.openTabMenuHandler(this.window, tabId, url);
  }
  public hasWebContentId(webContentsId: number) {
    return this.tabManager.getAll().has(webContentsId);
  }

  public addTab(url: string, title?: string) {
    const tab = this.tabManager.addTab(url, title);

    this.window.addBrowserView(tab.view);
    this.window.setTopBrowserView(this.tabManager.mainTab.view);

    this.window.webContents.send("didTabAdd", {
      id: tab.id,
      url,
      title,
    });

    this.menuManager.updateTabState();

    return tab;
  }

  public openSettingsView() {
    const bounds = this.window.getBounds();
    this.settingsView.updateProps(bounds);

    this.window.addBrowserView(this.settingsView.view);

    isDev && toggleDetachedDevTools(this.settingsView.view.webContents);

    setTimeout(() => {
      this.settingsView.updateProps(bounds);
    }, 100);
  }
  public closeSettingsView() {
    if (!this.settingsView.view) {
      return;
    }

    this.settingsView.closeDevTools();

    this.window.removeBrowserView(this.settingsView.view);

    this.settingsView.postClose();
  }
  private loadCurrentTheme(theme: Themes.Theme) {
    this.window.webContents.send("loadCurrentTheme", theme);
  }
  private windowMinimize(_: IpcMainEvent, windowId: number) {
    this.window.minimize();
  }
  private windowMaimize(event: IpcMainEvent, windowId: number) {
    if (this.window.isMaximized()) {
      this.window.restore();
      event.reply("windowDidRestored");
    } else {
      this.window.maximize();
      event.reply("windowDidMaximized");
    }
  }
  public setIsInVoiceCall(tabId: number, isInVoiceCall: boolean) {
    this.window.webContents.send("setIsInVoiceCall", { id: tabId, isInVoiceCall });
  }
  public setUsingMicrophone(tabId: number, isUsingMicrophone: boolean) {
    this.window.webContents.send("setUsingMicrophone", { id: tabId, isUsingMicrophone });
  }
  public reloadTab(tabId: number) {
    this.tabManager.reloadTab(tabId);
  }
  public closeCommunityTab() {
    this.window.removeBrowserView(this.tabManager.communityTab.view);
    this.setFocusToMainTab();

    this.tabManager.hasOpenedCommunityTab = false;
  }
  public closeTab(tabId: number) {
    const tab = this.tabManager.getById(tabId);

    this.window.removeBrowserView(tab.view);
    const nextTabId = this.tabManager.close(tabId);
    this.tabManager.focusTab(nextTabId);
    this.window.webContents.send("focusTab", nextTabId);

    switch (nextTabId) {
      case "mainTab": {
        this.setFocusToMainTab();
        break;
      }
      case "communityTab": {
        this.setFocusToCommunityTab();
        break;
      }
      default: {
        this.setTabFocus(nextTabId);
      }
    }

    if (tab instanceof Tab && tab.title !== NEW_FILE_TAB_TITLE) {
      this.closedTabsHistory.push({
        title: tab.title,
        url: tab.view.webContents.getURL(),
      });
    }
  }
  public tabWasClosed(tabId: number) {
    this.window.webContents.send("tabWasClosed", tabId);
  }
  public setFocusToMainTab() {
    const mainTab = this.tabManager.mainTab;

    this.window.setTopBrowserView(mainTab.view);
    this.tabManager.focusMainTab();
    this.menuManager.updateMainTabState();
  }
  public setFocusToCommunityTab() {
    const bounds = this.calcBoundsForTabView();
    const communityTab = this.tabManager.communityTab;

    this.window.setTopBrowserView(communityTab.view);
    this.tabManager.focusCommunityTab();
    this.menuManager.updateMainTabState();
    this.tabManager.communityTab.setBounds(bounds);
  }
  public setTabFocus(tabId: number) {
    const bounds = this.calcBoundsForTabView();
    const tab = this.tabManager.getById(tabId);

    try {
      this.window.setTopBrowserView(tab.view);
    } catch (error) {
      this.window.addBrowserView(tab.view);
      this.window.setTopBrowserView(tab.view);
    }

    this.tabManager.focusTab(tabId);
    this.tabManager.setBounds(tabId, bounds);
    this.menuManager.updateTabState();
  }
  public setTabTitle(event: IpcMainEvent, title: string) {
    const tab = this.tabManager.getById(event.sender.id);

    if (!tab || (tab instanceof Tab && tab.title === NEW_FILE_TAB_TITLE)) {
      return;
    }

    this.tabManager.setTitle(tab.id, title);
    this.window.webContents.send("setTitle", { id: tab.view.webContents.id, title });
  }
  public setPluginMenuData(event: IpcMainEvent, pluginMenu: Menu.MenuItem[]) {
    const tab = this.tabManager.getById(event.sender.id);

    if (!tab) {
      return;
    }

    const isMainTab = this.tabManager.isMainTab(event.sender.id);

    if (isMainTab) {
      this.menuManager.updateMainTabState();
    } else {
      this.menuManager.updatePluginState(pluginMenu);
    }
  }
  public openFile(_: IpcMainEvent, ...args: string[]) {
    let url = `${HOMEPAGE}${args[0]}`;

    if (args[2]) {
      url = `${url}${args[2]}`;
    }

    this.addTab(url);
  }
  public openCommunity(args: WebApi.OpenCommunity) {
    this.tabManager.communityTab.userId = args.userId;
    this.tabManager.communityTab.loadUrl(`${HOMEPAGE}${args.path}?fuid=${args.userId}`);

    this.window.addBrowserView(this.tabManager.communityTab.view);
    this.window.setTopBrowserView(this.tabManager.communityTab.view);

    this.window.webContents.send("openCommunity");
    this.tabManager.hasOpenedCommunityTab = true;

    this.setFocusToCommunityTab();
  }
  public updateVisibleNewProjectBtn(_: IpcMainEvent, visible: boolean) {
    this.window.webContents.send("updateVisibleNewProjectBtn", visible);
  }

  public updateActionState(_: IpcMainEvent, state: MenuState.State) {
    this.menuManager.updateTabState(state);
  }
  public changeTheme(_: IpcMainEvent, theme: Themes.Theme) {
    this.loadCurrentTheme(theme);

    storage.settings.theme.currentTheme = theme.id;
  }

  public handleFrontReady() {
    this.window.webContents.send("loadSettings", storage.settings);
    this.showHandler(null);
  }

  public close() {
    this.window.close();
  }

  private registerEvents() {
    ipcMain.on("window-minimize", this.windowMinimize.bind(this));
    ipcMain.on("window-maximize", this.windowMaimize.bind(this));

    app.on("loadCurrentTheme", this.loadCurrentTheme.bind(this));

    this.window.on("show", this.showHandler.bind(this));
    this.window.on("resize", this.updateTabsBounds.bind(this));
    this.window.on("maximize", () => setTimeout(this.updateTabsBounds.bind(this), 100));
    this.window.on("unmaximize", () => setTimeout(this.updateTabsBounds.bind(this), 100));
    this.window.on("move", () => setTimeout(this.updateTabsBounds.bind(this), 100));
    this.window.on("focus", () => app.emit("windowFocus", this.window.id));
  }
}
