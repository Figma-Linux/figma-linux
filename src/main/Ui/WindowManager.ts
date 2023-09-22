import { app, shell, clipboard, ipcMain, IpcMainEvent, WebContents } from "electron";

import Window from "./Window";
import { storage } from "Main/Storage";
import { dialogs } from "Main/Dialogs";
import { HOMEPAGE } from "Const";
import { normalizeUrl, isAppAuthGrandLink, isAppAuthRedeem, parseURL } from "Utils/Common";
import { registerIpcMainHandlers } from "Main/events";

export default class WindowManager {
  private lastFocusedwindowId: number;
  private windows: Map<number, Window> = new Map();

  constructor() {
    this.addIpc();
    registerIpcMainHandlers();

    this.registerEvents();
  }

  openUrl = (url: string): void => {
    const window = this.windows.get(this.lastFocusedwindowId);
    window.openUrl(url);
  };

  public newWindow() {
    const window = new Window();

    this.lastFocusedwindowId = window.id;
    this.windows.set(window.id, window);

    window.focus();
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

    // app.on("handle-command", (sender, id) => {
    //   switch (id) {
    //     case "scale-normal": {
    //       this.updateAllScale();
    //       break;
    //     }
    //     case "scale-inc0.1": {
    //       this.updateAllScale(0.1);
    //       break;
    //     }
    //     case "scale-dic0.1": {
    //       this.updateAllScale(-0.1);
    //       break;
    //     }
    //     case "scale-inc0.05": {
    //       this.updateAllScale(0.05);
    //       break;
    //     }
    //     case "scale-dic0.05": {
    //       this.updateAllScale(-0.05);
    //       break;
    //     }

    //     default: {
    //       logger.error("unavailable command id: ", id);
    //     }
    //   }
    // });
  };

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
  private closeTabFromMenu(tabId: number) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.closeTab(tabId);
    window.tabWasClosed(tabId);
  }
  private chromeGpu(_: WebContents) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.addTab("chrome://gpu", "chrome://gpu");
  }
  private openFileUrlClipboard(_: WebContents) {
    const window = this.windows.get(this.lastFocusedwindowId);
    const uri = clipboard.readText();

    window.openUrl(uri);
  }
  private openFileBrowser(_: WebContents) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.setFocusToMainTab();
  }
  private reopenClosedTab(_: WebContents) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.restoreClosedTab();
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

    window.openTabMenu(tabId);
  }
  private openMainTabMenuHandler(_: IpcMainEvent) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.openMainTabMenuHandler();
  }
  private openCommunityTabMenuHandler(_: IpcMainEvent) {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.openCommunityTabMenuHandler();
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

    window.closeTab(tabId);
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
    const window = this.getWindowByWebContentsId(event.sender.id);

    window.updatePanelScale(event, scale);
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
  private toggleSettingsDevTools() {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.toggleSettingsDevTools();
  }
  private toggleCurrentWindowDevTools() {
    const window = this.windows.get(this.lastFocusedwindowId);

    window.toggleDevTools();
  }
  private updateFullscreenMenuState(event: IpcMainEvent, state: Menu.State) {
    const window = this.getWindowByWebContentsId(event.sender.id);

    window.updateFullscreenMenuState(event, state);
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

    window.openMainMenuHandler();
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
    app.on("closeCommunityTab", this.closeCommunityTab.bind(this));
    app.on("closeAllTab", this.closeAllTab.bind(this));
    app.on("chromeGpu", this.chromeGpu.bind(this));
    app.on("openFileUrlClipboard", this.openFileUrlClipboard.bind(this));
    app.on("openFileBrowser", this.openFileBrowser.bind(this));
    app.on("reopenClosedTab", this.reopenClosedTab.bind(this));
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
  }
}
