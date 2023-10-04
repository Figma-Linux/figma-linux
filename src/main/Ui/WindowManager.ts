import { app, shell, clipboard, ipcMain, IpcMainEvent, WebContents } from "electron";

import Window from "./Window";
import MenuManager from "./MenuManager";
import { storage } from "Main/Storage";
import { dialogs } from "Main/Dialogs";
import { HOMEPAGE, NEW_FILE_TAB_TITLE } from "Const";
import { normalizeUrl, isAppAuthGrandLink, isAppAuthRedeem, parseURL } from "Utils/Common";
import { registerIpcMainHandlers } from "Main/events";

export default class WindowManager {
  private menuManager: MenuManager;

  private lastFocusedwindowId: number;
  private windows: Map<number, Window> = new Map();
  private closedTabs: Map<string, Types.SavedTab> = new Map();

  constructor() {
    this.menuManager = new MenuManager();

    this.addIpc();
    this.restoreData();
    registerIpcMainHandlers();

    this.registerEvents();
  }

  public get closedTabsForMenu() {
    const list = [...this.closedTabs.values()].reverse();

    if (list.length > 10) {
      list.length = 10;
    }

    return list;
  }

  public openUrl(url: string): void {
    const window = this.windows.get(this.lastFocusedwindowId);
    window.openUrl(url);
  }

  public newWindow() {
    const menu = this.menuManager.getMenu({
      recentClosedTabsMenuData: this.closedTabsForMenu,
      actionCheckedState: {
        "close-tab": false,
      },
    });
    const window = new Window();

    this.lastFocusedwindowId = window.id;
    this.windows.set(window.id, window);

    window.focus();
    window.setMenu(menu);
    this.restoreTabs();
  }

  public openUrlInNewTab(url: string) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.openUrl(url);
  }
  public openUrlFromCommunity(url: string) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.openUrlFromCommunity(url);
  }
  public sendWindowBoundsToTabs(windowId: number) {
    for (const [id, window] of this.windows) {
      if (id === windowId) {
        window.updateTabsBounds();
      }
    }
  }
  public closeTabOnAllWindows() {
    for (const [_, window] of this.windows) {
      window.closeAllTab(null);
    }
  }
  public closeAllTab() {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.closeAllTab(null);
  }
  public loadLoginPageAllWindows() {
    for (const [_, window] of this.windows) {
      window.loadLoginPageAllWindows();
    }
  }
  public tryHandleAppAuthRedeemUrl = (url: string): boolean => {
    if (isAppAuthRedeem(url)) {
      const parsedUrl = parseURL(normalizeUrl(url));

      const secret = parsedUrl.searchParams.get("g_secret");
      if (secret) {
        for (const [_, window] of this.windows) {
          window.redeemAppAuth(secret);
        }
        return true;
      }

      return true;
    }

    return false;
  };

  public focusLastWindow() {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.focus();
  }

  private addIpc = (): void => {
    ipcMain.on("registerManifestChangeObserver", (event: any, callbackId: any) => {
      // const tab = Tabs.getByWebContentId(event.sender.id);
      // if (!tab) {
      //   return;
      // }
    });
  };
  private restoreData() {
    const recentlyClosedTabs = storage.settings.app.recentlyClosedTabs;

    if (recentlyClosedTabs?.length > 0) {
      for (const tabInfo of recentlyClosedTabs.reverse()) {
        this.closedTabs.set(tabInfo.title, {
          title: tabInfo.title,
          url: tabInfo.url,
        });
      }
    }
  }

  private restoreTabs() {
    if (!storage.settings.app.saveLastOpenedTabs) {
      return;
    }

    const window = this.windows.get(this.lastFocusedwindowId);

    window.restoreTabs();
  }

  private newFile(_: WebContents) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.newProject();
  }
  private reloadTabFromMenu(tabId: number) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.reloadTab(tabId);
  }
  private closeTabFromMenu(windowId: number, tabId: number) {
    const window = this.windows.get(windowId || this.lastFocusedwindowId);

    this.handleCloseTab(window, tabId);
  }
  private closeCurrentTabFromMenu(windowId: number) {
    const window = this.windows.get(windowId || this.lastFocusedwindowId);
    const tabId = window.getLatestFocusedTabId();

    if (tabId) {
      this.handleCloseTab(window, tabId);
    }
  }
  private closeCurrentWindowFromMenu(windowId: number) {
    this.windowClose(windowId);
  }
  private reopenClosedTabFromMenu(windowId: number) {
    const window = this.windows.get(windowId || this.lastFocusedwindowId);

    window.restoreTabs(this.closedTabsForMenu);
  }
  private handleCloseTab(window: Window, tabId: number) {
    const tabInfo = window.getTabInfo(tabId);

    if (tabInfo.title !== NEW_FILE_TAB_TITLE) {
      this.closedTabs.delete(tabInfo.title);
      this.closedTabs.set(tabInfo.title, {
        title: tabInfo.title,
        url: tabInfo.url,
      });
    }

    storage.settings.app.recentlyClosedTabs = this.closedTabsForMenu;

    window.closeTab(tabId);
    window.tabWasClosed(tabId);
  }

  private chromeGpu(windowId: number) {
    const window = this.windows.get(windowId || this.lastFocusedwindowId);

    window.addTab("chrome://gpu", "chrome://gpu");
  }
  private openFileUrlClipboard() {
    const window = this.windows.get(this.lastFocusedwindowId);
    const uri = clipboard.readText();

    window.openUrl(uri);
  }
  private openFileBrowser() {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.setFocusToMainTab();
  }
  private restoreClosedTab(windowId: number, title: string, uri: string) {
    const window = this.windows.get(windowId || this.lastFocusedwindowId);

    window.addTab(uri, title);
  }
  private openDevTools(event: IpcMainEvent, mode: "right" | "bottom" | "undocked" | "detach") {
    if (event.sender) {
      event.sender.openDevTools({ mode });
    }
  }
  private startAppAuth(event: IpcMainEvent, data: { grantPath: string }) {
    if (isAppAuthGrandLink(data.grantPath)) {
      const url = `${HOMEPAGE}${data.grantPath}?desktop_protocol=figma`;

      shell.openExternal(url);
    }
  }
  private finishAppAuth(event: IpcMainEvent, data: { redirectURL: string }) {
    const url = `${HOMEPAGE}${data.redirectURL}`;

    this.handleUrl(url);
  }

  private getWindowByWebContentsId(webContentsId: number): Window | undefined {
    for (const [_, window] of this.windows) {
      if (window.allWebContentsIds.includes(webContentsId)) {
        return window;
      }
    }
  }
  private windowFocus(windowId: number) {
    this.lastFocusedwindowId = windowId;
  }
  private handlerWindowClose(_: IpcMainEvent, tabs: Types.TabFront[]) {
    this.sortTabs(this.lastFocusedwindowId, tabs);
    this.windowClose(this.lastFocusedwindowId);
  }
  private sortTabs(windowId: number, tabs: Types.TabFront[]) {
    const window = this.windows.get(windowId);

    window.sortTabs(tabs);
  }

  private windowClose(windowId: number) {
    const window = this.windows.get(windowId);

    window.saveOpenedTabs();
    window.close();

    this.windows.delete(windowId);

    if (this.windows.size === 0) {
      app.emit("quitApp");
    }
  }
  private setFocusToMainTab(_: IpcMainEvent) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.setFocusToMainTab();
  }
  private openTabMenuHandler(_: IpcMainEvent, tabId: number) {
    const window = this.windows.get(this.lastFocusedwindowId);
    const tabInfo = window.getTabInfo(tabId);

    this.menuManager.openTabMenuHandler(window.win, tabId, tabInfo.url);
  }
  private openMainTabMenuHandler(_: IpcMainEvent) {
    const window = this.windows.get(this.lastFocusedwindowId);
    const mainTabInfo = window.mainTabInfo;

    this.menuManager.openMainTabMenuHandler(window.win, mainTabInfo.id, mainTabInfo.url);
  }
  private openCommunityTabMenuHandler(_: IpcMainEvent) {
    const window = this.windows.get(this.lastFocusedwindowId);
    const communityTabInfo = window.communityTabInfo;

    this.menuManager.openCommunityTabMenuHandler(
      window.win,
      communityTabInfo.id,
      communityTabInfo.url,
    );
  }
  private needUpdateMenu(
    windowId: number,
    tabId?: number,
    actionCheckedState: { [key: string]: boolean } = {},
  ) {
    const window = this.windows.get(windowId || this.lastFocusedwindowId);
    let state: Menu.State = {
      recentClosedTabsMenuData: this.closedTabsForMenu,
      actionCheckedState,
    };

    if (tabId) {
      const tabMenuState = this.menuManager.getTabMenu(tabId);
      state = {
        ...state,
        ...tabMenuState,
        actionCheckedState: {
          ...state.actionCheckedState,
          ...(tabMenuState.actionCheckedState ?? {}),
          "close-tab": true,
        },
      };
    }

    const menu = this.menuManager.getMenu(state);

    window.setMenu(menu);
  }
  private newProject(_: IpcMainEvent) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.newProject();
  }
  private async createFile(_: IpcMainEvent, args: WebApi.CreateFile) {
    const window = this.windows.get(this.lastFocusedwindowId);

    return window.createFile(args);
  }
  private closeTab(_: IpcMainEvent, tabId: number) {
    const window = this.windows.get(this.lastFocusedwindowId);

    this.handleCloseTab(window, tabId);
  }
  private closeCommunityTab(_: IpcMainEvent) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.closeCommunityTab();
  }
  private setFocusToCommunityTab(_: IpcMainEvent) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.setFocusToCommunityTab();
  }
  private setTabFocus(_: IpcMainEvent, tabId: number) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.setTabFocus(tabId);
  }
  private async selectExportDirectory(_: IpcMainEvent) {
    const directories = await dialogs.showOpenDialog({ properties: ["openDirectory"] });

    if (!directories) {
      return null;
    }

    return directories[0];
  }
  private updatePanelScale(event: IpcMainEvent, scale: number) {
    for (const [_, window] of this.windows) {
      window.updatePanelScale(event, scale);
    }
  }
  private updateFigmaUiScale(event: IpcMainEvent, scale: number) {
    for (const [_, window] of this.windows) {
      window.updateFigmaUiScale(event, scale);
    }
  }

  public closeSettingsView(_: IpcMainEvent, settings: Types.SettingsInterface) {
    const window = this.windows.get(this.lastFocusedwindowId);

    storage.settings = settings;
    storage.save();

    window.closeSettingsView();
  }
  private handleUrl(path: string) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.handleUrl(path);
  }
  private handlePluginManageAction() {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.handlePluginManageAction();
  }
  private handlePluginMenuAction(windowId: number, pluginMenuAction: Menu.MenuAction) {
    const window = this.windows.get(windowId ?? this.lastFocusedwindowId);

    window.handlePluginMenuAction(pluginMenuAction);
  }
  private toggleSettingsDevTools(windowId: number, webContentId: number) {
    const window = this.windows.get(windowId || this.lastFocusedwindowId);

    window.toggleSettingsDevTools();
  }
  private toggleCurrentTabDevTools(windowId: number, webContentsId: number) {
    const window = this.windows.get(windowId || this.lastFocusedwindowId);

    window.toggleCurrentTabDevTools();
  }
  private toggleCurrentWindowDevTools(windowId: number, webContentId: number) {
    const window = this.windows.get(windowId || this.lastFocusedwindowId);

    window.toggleDevTools();
  }
  private updateFullscreenMenuState(event: IpcMainEvent, state: Menu.State) {
    // event.sender.id - it's id of a tab's webContent
    const tabId = event.sender.id;
    const window = this.getWindowByWebContentsId(tabId);

    this.menuManager.setTabMenu(tabId, state);

    this.needUpdateMenu(window.id, tabId);
  }
  private toggleThemeCreatorPreviewMask(path: string) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.toggleThemeCreatorPreviewMask();
  }

  private setIsInVoiceCall(event: IpcMainEvent, isInVoiceCall: boolean) {
    const window = this.windows.get(this.lastFocusedwindowId);
    const tabId = event.sender.id;

    window.setIsInVoiceCall(tabId, isInVoiceCall);
  }
  private setUsingMicrophone(event: IpcMainEvent, isUsingMicrophone: boolean) {
    const window = this.windows.get(this.lastFocusedwindowId);
    const tabId = event.sender.id;

    window.setUsingMicrophone(tabId, isUsingMicrophone);
  }

  private setTabTitle(event: IpcMainEvent, title: string) {
    const window = this.getWindowByWebContentsId(event.sender.id);

    window.setTabTitle(event, title);
  }
  private openFile(event: IpcMainEvent, ...args: string[]) {
    const window = this.getWindowByWebContentsId(event.sender.id);

    window.openFile(event, ...args);
  }
  private openCommunity(event: IpcMainEvent, args: WebApi.OpenCommunity) {
    const window = this.getWindowByWebContentsId(event.sender.id);

    window.openCommunity(args);
  }
  private updateVisibleNewProjectBtn(event: IpcMainEvent, visible: boolean) {
    const window = this.getWindowByWebContentsId(event.sender.id);

    window.updateVisibleNewProjectBtn(event, visible);
  }

  private changeTheme(event: IpcMainEvent, theme: Themes.Theme) {
    for (const [_, window] of this.windows) {
      window.changeTheme(event, theme);
    }
  }
  private handleFrontReady(event: IpcMainEvent) {
    const window = this.getWindowByWebContentsId(event.sender.id);

    window.handleFrontReady();
  }
  private openMainMenuHandler(event: IpcMainEvent) {
    const window = this.getWindowByWebContentsId(event.sender.id);
    const width = window.getBounds().width;

    this.menuManager.openMainMenuHandler(
      width,
      window.win,
      window.openMainMenuCloseHandler.bind(window),
    );
  }
  private openSettingsView() {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.openSettingsView();
  }

  private registerEvents() {
    ipcMain.handle("selectExportDirectory", this.selectExportDirectory);
    ipcMain.handle("updatePanelScale", this.updatePanelScale.bind(this));
    ipcMain.handle("updateFigmaUiScale", this.updateFigmaUiScale.bind(this));
    ipcMain.handle("createFile", this.createFile.bind(this));

    ipcMain.on("openDevTools", this.openDevTools.bind(this));
    ipcMain.on("startAppAuth", this.startAppAuth.bind(this));
    ipcMain.on("finishAppAuth", this.finishAppAuth.bind(this));
    ipcMain.on("windowClose", this.handlerWindowClose.bind(this));
    ipcMain.on("setFocusToMainTab", this.setFocusToMainTab.bind(this));
    ipcMain.on("openTabMenu", this.openTabMenuHandler.bind(this));
    ipcMain.on("openMainTabMenu", this.openMainTabMenuHandler.bind(this));
    ipcMain.on("openCommunityTabMenu", this.openCommunityTabMenuHandler.bind(this));
    ipcMain.on("newProject", this.newProject.bind(this));
    ipcMain.on("closeTab", this.closeTab.bind(this));
    ipcMain.on("closeCommunityTab", this.closeCommunityTab.bind(this));
    ipcMain.on("setFocusToCommunityTab", this.setFocusToCommunityTab.bind(this));
    ipcMain.on("setTabFocus", this.setTabFocus.bind(this));
    ipcMain.on("closeSettingsView", this.closeSettingsView.bind(this));
    ipcMain.on("toggleThemeCreatorPreviewMask", this.toggleThemeCreatorPreviewMask.bind(this));
    ipcMain.on("setUsingMicrophone", this.setUsingMicrophone.bind(this));
    ipcMain.on("setIsInVoiceCall", this.setIsInVoiceCall.bind(this));
    ipcMain.on("closeAllTab", this.closeAllTab.bind(this));
    ipcMain.on("setTitle", this.setTabTitle.bind(this));
    ipcMain.on("openMainMenu", this.openMainMenuHandler.bind(this));
    ipcMain.on("changeTheme", this.changeTheme.bind(this));
    ipcMain.on("openFile", this.openFile.bind(this));
    ipcMain.on("openCommunity", this.openCommunity.bind(this));
    ipcMain.on("updateVisibleNewProjectBtn", this.updateVisibleNewProjectBtn.bind(this));
    ipcMain.on("frontReady", this.handleFrontReady.bind(this));
    ipcMain.on("updateFullscreenMenuState", this.updateFullscreenMenuState.bind(this));

    // Events from main menu
    app.on("newFile", this.newFile.bind(this));
    app.on("newWindow", this.newWindow.bind(this));
    app.on("reloadTab", this.reloadTabFromMenu.bind(this));
    app.on("closeTab", this.closeTabFromMenu.bind(this));
    app.on("closeCurrentTab", this.closeCurrentTabFromMenu.bind(this));
    app.on("reopenClosedTab", this.reopenClosedTabFromMenu.bind(this));
    app.on("closeCurrentWindow", this.closeCurrentWindowFromMenu.bind(this));
    app.on("closeCommunityTab", this.closeCommunityTab.bind(this));
    app.on("closeAllTab", this.closeAllTab.bind(this));
    app.on("chromeGpu", this.chromeGpu.bind(this));
    app.on("openFileUrlClipboard", this.openFileUrlClipboard.bind(this));
    app.on("openFileBrowser", this.openFileBrowser.bind(this));
    app.on("restoreClosedTab", this.restoreClosedTab.bind(this));
    app.on("openSettingsView", this.openSettingsView.bind(this));
    // End events from main menu

    app.on("focusLastWindow", this.focusLastWindow.bind(this));
    app.on("requestBoundsForTabView", this.sendWindowBoundsToTabs.bind(this));
    app.on("openUrlInNewTab", this.openUrlInNewTab.bind(this));
    app.on("openUrlFromCommunity", this.openUrlFromCommunity.bind(this));
    app.on("windowFocus", this.windowFocus.bind(this));
    app.on("windowClose", this.windowClose.bind(this));
    app.on("handleUrl", this.handleUrl.bind(this));
    app.on("handlePluginManageAction", this.handlePluginManageAction.bind(this));
    app.on("handlePluginMenuAction", this.handlePluginMenuAction.bind(this));
    app.on("toggleCurrentWindowDevTools", this.toggleCurrentWindowDevTools.bind(this));
    app.on("toggleSettingsDeveloperTools", this.toggleSettingsDevTools.bind(this));
    app.on("toggleCurrentTabDevTools", this.toggleCurrentTabDevTools.bind(this));
    app.on("needUpdateMenu", this.needUpdateMenu.bind(this));
  }
}
