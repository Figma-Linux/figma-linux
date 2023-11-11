import * as URL from "url";
import { app, ipcMain, Rectangle, IpcMainEvent } from "electron";

import { NEW_FILE_TAB_TITLE, RECENT_FILES } from "Const";
import MainTab from "./MainTab";
import CommunityTab from "./CommunityTab";
import Tab from "./Tab";
import { storage } from "Main/Storage";

export default class TabManager {
  public mainTab: MainTab;
  public communityTab: CommunityTab | undefined;
  public hasOpenedNewFileTab: boolean = false;
  public hasOpenedCommunityTab: boolean = false;

  public lastFocusedTab: number | undefined;
  private tabs: Map<number, Tab> = new Map();

  public get mainTabWebContentId() {
    return this.mainTab.view.webContents.id;
  }
  public get communityTabWebContentId() {
    return this.communityTab ? this.communityTab.view.webContents.id : undefined;
  }

  constructor(private windowId: number) {
    this.mainTab = new MainTab(this.windowId);
    this.lastFocusedTab = this.mainTab.id;

    this.registerEvents();
  }

  public setUserId(id: string) {
    this.mainTab.setUserId(id);
  }
  public addTab(url = RECENT_FILES, title?: string): Tab {
    const tab = new Tab(this.windowId);

    tab.title = title;
    tab.loadUrl(url);
    this.tabs.set(tab.id, tab);

    if (title === NEW_FILE_TAB_TITLE) {
      this.hasOpenedNewFileTab = true;
    }

    return tab;
  }

  public addCommunityTab() {
    this.communityTab = new CommunityTab(this.windowId);
  }
  public closeCommunityTab() {
    if (this.communityTab.view.webContents && !this.communityTab.view.webContents.isDestroyed()) {
      this.communityTab.view.webContents.destroy();
    }

    this.communityTab = undefined;
  }
  public handleCallbackForTab(webContentsId: number, callbackID: number, args: any) {
    const tab = this.getById(webContentsId);

    tab.view.webContents.send("handleCallback", callbackID, args);
  }

  public closeAll() {
    this.tabs.clear();
  }
  public close(tabId: number): Types.TabIdType {
    const tab = this.tabs.get(tabId);
    const array = [...this.tabs.entries()];
    let nextTabId: Types.TabIdType;

    for (let i = 0; i < array.length; i++) {
      const tab = array[i];
      const next = array[i + 1];

      if (!next) {
        break;
      }
      if (tab[0] === tabId) {
        nextTabId = next[0];
        break;
      }

      nextTabId = tab[0];
    }

    if (tab.view.webContents && !tab.view.webContents.isDestroyed()) {
      tab.view.webContents.destroy();
    }
    if (tab.title === NEW_FILE_TAB_TITLE) {
      this.hasOpenedNewFileTab = false;
    }

    this.tabs.delete(tabId);

    if (!nextTabId) {
      nextTabId = this.hasOpenedCommunityTab ? "communityTab" : "mainTab";
    }

    return nextTabId;
  }

  public reloadAll() {
    this.tabs.forEach((t) =>
      !t.view.webContents.isDestroyed() ? t.view.webContents.reload() : "",
    );
  }
  public updateScaleAll(scale: number) {
    this.mainTab.updateScale(scale);
    this.communityTab && this.communityTab.updateScale(scale);
    this.tabs.forEach((t) => t.updateScale(scale));
  }

  public getTabByIndex(index: number) {
    let i = 0;
    let foundTab: Types.Tab | undefined;

    this.tabs.forEach((tab) => {
      if (index === i) {
        foundTab = tab;
      }

      i++;
    });

    return foundTab;
  }

  public getTabIndex(webContentsId: number) {
    let i = 0;

    this.tabs.forEach((_, id) => {
      if (webContentsId === id) {
        return;
      }

      i++;
    });

    return i;
  }

  public reloadTab(tabId: number) {
    const tab = this.getById(tabId);

    tab.view.webContents.reload();
  }
  public loadUrlInMainTab(url: string) {
    this.mainTab.loadUrl(url);
  }
  public loadUrlInCommunityTab(url: string) {
    this.communityTab.loadUrl(url);
  }
  public loadLoginPage() {
    this.mainTab.loadLoginPage();
  }
  public redeemAppAuth(secret: string) {
    this.mainTab.redeemAppAuth(secret);
  }
  public handleUrl(path: string) {
    this.mainTab.handleUrl(path);
  }
  public getById(id: Types.TabIdType) {
    switch (id) {
      case "mainTab": {
        return this.mainTab;
      }
      case "communityTab": {
        return this.communityTab;
      }
      default: {
        if (this.tabs.has(id)) {
          return this.tabs.get(id);
        } else if (this.mainTab.id === id) {
          return this.mainTab;
        } else if (this.communityTab.id === id) {
          return this.communityTab;
        }
      }
    }

    return this.mainTab;
  }
  public getByTitle(title: string) {
    let foundTab: Tab | undefined;

    this.tabs.forEach((tab) => {
      if (tab.title === title) {
        foundTab = tab;
      }
    });

    return foundTab;
  }
  public getByPath(path: string) {
    let foundTab: Tab | undefined;

    this.tabs.forEach((tab) => {
      const pathname = URL.parse(tab.url ?? tab.getUrl()).pathname;
      const reg = new RegExp(pathname);
      if (reg.test(path)) {
        foundTab = tab;
      }
    });

    return foundTab;
  }
  public getAll = () => this.tabs;

  public focusTab(id: Types.TabIdType) {
    const tab = this.getById(id);

    this.lastFocusedTab = tab.id;
  }
  public setTitle(id: number, title: string) {
    const tab = this.getById(id);

    if (tab instanceof Tab) {
      tab.title = title;
    }
  }
  public setBounds(id: number, bounds: Rectangle) {
    const tab = this.getById(id);

    tab.setBounds(bounds);
  }
  public focusMainTab() {
    this.lastFocusedTab = this.mainTab.id;
  }
  public focusCommunityTab() {
    this.lastFocusedTab = this.communityTab.id;
  }
  public setBoundsForAllTab(bounds: Rectangle) {
    this.mainTab.setBounds(bounds);

    if (this.hasOpenedCommunityTab) {
      this.communityTab.setBounds(bounds);
    }

    for (const [_, tab] of this.tabs) {
      tab.setBounds(bounds);
    }
  }
  public sortTabs(tabs: Types.TabFront[]) {
    const entries = [...this.tabs.entries()];

    this.tabs.clear();

    for (const tab of tabs) {
      const needed = entries.find(([_, t]) => t.id === tab.id);

      this.tabs.set(needed[0], needed[1]);
    }
  }

  public getTabUrl(tabId: number) {
    const tab = this.tabs.get(tabId);

    return tab.view.webContents.getURL();
  }

  public isNewFileTab(tabId: number) {
    for (const [_, tab] of this.tabs) {
      if (tab.title && tab.title === NEW_FILE_TAB_TITLE && tab.id === tabId) {
        return true;
      }
    }

    return false;
  }
  public isMainTab(tabId: number) {
    const keys = [...this.tabs.keys()];

    if (keys[0] === tabId) {
      return true;
    }

    return false;
  }

  public handlePluginMenuAction(pluginMenuAction: Menu.MenuAction) {
    const tab = this.getById(this.lastFocusedTab);

    tab.view.webContents.send("handlePluginMenuAction", pluginMenuAction);
  }

  public getActiveTabPath(): string {
    const tab = this.getById(this.lastFocusedTab);
    const tabUri = tab.view.webContents.getURL();

    return URL.parse(tabUri).pathname;
  }

  private loadCurrentTheme(theme: Themes.Theme) {
    this.mainTab.loadTheme(theme);
    this.communityTab && this.communityTab.loadTheme(theme);
    this.tabs.forEach((t) => t.view.webContents.send("loadCurrentTheme", theme));
  }
  private changeTheme(_: IpcMainEvent, theme: Themes.Theme) {
    this.loadCurrentTheme(theme);

    storage.settings.theme.currentTheme = theme.id;
  }

  private registerEvents() {
    ipcMain.on("changeTheme", this.changeTheme.bind(this));

    app.on("loadCurrentTheme", this.loadCurrentTheme.bind(this));
  }
}
