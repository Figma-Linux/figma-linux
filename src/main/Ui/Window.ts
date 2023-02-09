import { parse } from "url";
import { app, ipcMain, BrowserWindow, IpcMainEvent, IpcMainInvokeEvent, Rectangle } from "electron";
import { storage } from "Main/Storage";
import { logger } from "Main/Logger";
import MenuManager from "./Menu/MenuManager";
import ThemeCreatorView from "./ThemeCreatorView";
import SettingsView from "./SettingsView";
import TabManager from "./TabManager";

import { HOMEPAGE, WINDOW_DEFAULT_OPTIONS } from "Const";
import { isDev, isCommunityUrl, isAppAuthRedeem, normalizeUrl } from "Utils/Common";
import { panelUrlDev, panelUrlProd, toggleDetachedDevTools } from "Utils/Main";

export default class Window {
  private window: BrowserWindow;
  private tabManager: TabManager;
  private menuManager: MenuManager;
  private settingsView: SettingsView;
  private themeCreatorView: ThemeCreatorView;

  private closedTabsHistory: Types.SavedTab[] = [];

  constructor() {
    this.window = new BrowserWindow(WINDOW_DEFAULT_OPTIONS);
    this.tabManager = new TabManager(this.window.id);
    this.menuManager = new MenuManager();
    this.settingsView = new SettingsView();
    this.themeCreatorView = new ThemeCreatorView();

    this.window.addBrowserView(this.tabManager.mainTab.view);
    this.window.setTopBrowserView(this.tabManager.mainTab.view);

    this.menuManager.initMainMenu();
    this.menuManager.updateMainTabState();

    logger.debug("Create window, id: ", this.window.id, isDev ? panelUrlDev : panelUrlProd);
    this.window.loadURL(isDev ? panelUrlDev : panelUrlProd);
    isDev && toggleDetachedDevTools(this.window.webContents);

    this.registerEvents();
  }

  public get id() {
    return this.window.id;
  }
  public get closedTabs() {
    return this.closedTabsHistory;
  }

  public restoreTabs() {
    setTimeout(() => {
      this.tabManager.restoreTabs();
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
  public updatePanelScale(_: IpcMainEvent, scale: number) {
    const panelScale = +scale.toFixed(2);
    let panelHeight = storage.settings.app.panelHeight;

    panelHeight = Math.floor(panelHeight * panelScale);

    storage.settings.ui.scalePanel = panelScale;
    storage.settings.app.panelHeight = panelHeight;

    this.window.webContents.send("updatePanelScale", panelScale, panelHeight);

    this.updateTabsBounds();
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
    const tab = this.tabManager.addTab();
    const onDidFinishLoad = (): void => {
      tab.view.webContents.send("newFile");
      tab.view.webContents.removeListener("did-finish-load", onDidFinishLoad);
    };

    tab.view.webContents.addListener("did-finish-load", onDidFinishLoad);
  }
  private openMainMenuHandler() {
    const width = this.window.getBounds().width;

    this.menuManager.openMainMenuHandler(width, this.window);
  }
  public openTabMenu(tabId: number) {
    const appUrl = this.tabManager.getTabLink(tabId, "app");
    const webUrl = this.tabManager.getTabLink(tabId, "web");
    const close = () => {
      this.closeTab(tabId);
    };

    this.menuManager.openTabMenuHandler(this.window, appUrl, webUrl, close);
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
  }

  private openSettingsView() {
    const bounds = this.calcBoundsForTabView();
    this.settingsView.updateProps(bounds);

    this.window.addBrowserView(this.settingsView.view);

    isDev && toggleDetachedDevTools(this.settingsView.view.webContents);
  }
  private closeSettingsView(_: IpcMainInvokeEvent) {
    if (!this.settingsView.view) {
      return;
    }

    this.settingsView.closeDevTools();

    this.window.removeBrowserView(this.settingsView.view);

    this.settingsView.postClose();
  }
  private openThemeCreatorView() {
    const bounds = this.calcBoundsForTabView();
    this.themeCreatorView.updateProps(bounds);

    this.window.addBrowserView(this.themeCreatorView.view);

    isDev && toggleDetachedDevTools(this.themeCreatorView.view.webContents);
  }
  private closeThemeCreatorView(_: IpcMainEvent) {
    this.themeCreatorView.closeDevTools();

    this.window.removeBrowserView(this.themeCreatorView.view);
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
  public closeTab(tabId: number) {
    const tab = this.tabManager.getById(tabId);

    this.window.removeBrowserView(tab.view);
    const nextTabId = this.tabManager.close(tabId);
    this.tabManager.focusTab(nextTabId);
    this.window.webContents.send("focusTab", nextTabId);

    this.closedTabsHistory.push({
      title: tab.title,
      url: tab.view.webContents.getURL(),
    });
  }
  public setFocusToMainTab() {
    const mainTab = this.tabManager.mainTab;

    this.window.setTopBrowserView(mainTab.view);
    this.tabManager.focusMainTab();
    this.menuManager.updateMainTabState();
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
  private setTabTitle(event: IpcMainEvent, title: string) {
    const tab = this.tabManager.getById(event.sender.id);

    if (!tab) {
      return;
    }

    this.window.webContents.send("setTitle", { id: tab.view.webContents.id, title });
  }
  private setPluginMenuData(event: IpcMainEvent, pluginMenu: Menu.MenuItem[]) {
    // TODO: need use window id for understooding for what window handle this event
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
  private openFile(_: IpcMainEvent, ...args: string[]) {
    let url = `${HOMEPAGE}${args[0]}`;

    if (args[2]) {
      url = `${url}${args[2]}`;
    }

    this.addTab(url);
  }
  private updateVisibleNewProjectBtn(_: IpcMainEvent, visible: boolean) {
    this.window.webContents.send("updateVisibleNewProjectBtn", visible);
  }

  private updateActionState(_: IpcMainEvent, state: MenuState.State) {
    // TODO: need use window id for understooding for what window handle this event
    this.menuManager.updateTabState(state);
  }
  private changeTheme(_: IpcMainEvent, theme: Themes.Theme) {
    this.loadCurrentTheme(theme);

    storage.settings.theme.currentTheme = theme.id;
  }

  public close() {
    this.window.close();
  }

  private registerEvents() {
    // TODO: Add window id for determinate which window will be minimized or maximized
    ipcMain.on("window-minimize", this.windowMinimize.bind(this));
    ipcMain.on("window-maximize", this.windowMaimize.bind(this));
    //
    ipcMain.on("closeAllTab", this.closeAllTab.bind(this));
    ipcMain.on("setTitle", this.setTabTitle.bind(this));
    ipcMain.on("openMainMenu", this.openMainMenuHandler.bind(this));
    ipcMain.on("setPluginMenuData", this.setPluginMenuData.bind(this));
    ipcMain.on("updateActionState", this.updateActionState.bind(this));
    ipcMain.on("changeTheme", this.changeTheme.bind(this));
    ipcMain.on("updatePanelScale", this.updatePanelScale.bind(this));
    ipcMain.on("openFile", this.openFile.bind(this));
    ipcMain.on("closeSettingsView", this.closeSettingsView.bind(this));
    ipcMain.on("closeThemeCreatorView", this.closeThemeCreatorView.bind(this));
    ipcMain.on("updateVisibleNewProjectBtn", this.updateVisibleNewProjectBtn.bind(this));

    app.on("openSettingsView", this.openSettingsView.bind(this));
    app.on("openThemeCreatorView", this.openThemeCreatorView.bind(this));
    app.on("loadCurrentTheme", this.loadCurrentTheme.bind(this));

    this.window.on("show", this.showHandler.bind(this));
    this.window.on("resize", this.updateTabsBounds.bind(this));
    this.window.on("maximize", () => setTimeout(this.updateTabsBounds.bind(this), 100));
    this.window.on("unmaximize", () => setTimeout(this.updateTabsBounds.bind(this), 100));
    this.window.on("move", () => setTimeout(this.updateTabsBounds.bind(this), 100));
    this.window.on("focus", () => app.emit("windowFocus", this.window.id));
  }
}
