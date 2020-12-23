declare namespace Electron {
  interface RemoteMainInterface {
    app: App;
  }

  interface MenuItemConstructorOptions {
    click?: (menuItem: Menu.PluginMenuItem, browserWindow: BrowserWindow | undefined, event: KeyboardEvent) => void;
  }

  interface MenuItem {
    click: (item: MenuItemConstructorOptions, window: BrowserWindow, event: Event) => void | Function;
  }

  interface App extends NodeJS.EventEmitter {
    on(event: "handle-command", listener: (command: string) => void): this;
    on(event: "handle-page-command", listener: (item: any, window: BrowserWindow) => void): this;
    on(event: "os-menu-invalidated", listener: (dependencies: MenuState.MenuStateParams) => void): this;
    on(event: "log", listener: (data: any) => void): this;
    on(event: "sign-out", listener: () => void): this;
    on(event: "themes-change", listener: (theme: Themes.Theme) => void): this;
    on(event: "set-default-theme", listener: () => void): this;
    on(event: "themes-add-repository", listener: () => void): this;
    on(event: "themes-remove-repository", listener: () => void): this;
    on(event: "toggle-settings-developer-tools", listener: () => void): this;
    on(event: "settings-ready", listener: (settings: SettingsInterface) => void): this;

    emit(event: "handle-command", command: string): boolean;
    emit(event: "handle-page-command", item: any, window: BrowserWindow): boolean;
    emit(event: "os-menu-invalidated", dependencies: MenuState.MenuStateParams): boolean;
    emit(event: "log", data: any): boolean;
    emit(event: "sign-out"): boolean;
    emit(event: "themes-change", theme: Themes.Theme): boolean;
    emit(event: "set-default-theme"): boolean;
    emit(event: "themes-add-repository"): boolean;
    emit(event: "themes-remove-repository"): boolean;
    emit(event: "toggle-settings-developer-tools"): boolean;
    emit(event: "settings-ready", settings: SettingsInterface): boolean;
  }

  interface IpcMain extends NodeJS.EventEmitter {
    on(channel: string, listener: (event: IpcMainEvent, args: any) => void): this;
    on(channel: "setTitle", listener: (event: IpcMainEvent, title: string) => void): this;
    on(channel: "setPluginMenuData", listener: (event: IpcMainEvent, pluginMenu: Menu.MenuItem[]) => void): this;
    on(channel: "receiveTabs", listener: (event: IpcMainEvent, tabs: Tab[]) => void): this;
    on(channel: "updateActionState", listener: (event: IpcMainEvent, state: MenuState.State) => void): this;
    on(channel: "updateFileKey", listener: (event: IpcMainEvent, key: string) => void): this;
    on(channel: "setTabUrl", listener: (event: IpcMainEvent, url: string) => void): this;
    on(channel: "closeAllTab", listener: (event: IpcMainEvent) => void): this;
    on(channel: "setFocusToMainTab", listener: (event: IpcMainEvent) => void): this;
    on(channel: "setTabFocus", listener: (event: IpcMainEvent, id: number) => void): this;
    on(channel: "closeTab", listener: (event: IpcMainEvent, id: number) => void): this;
    on(channel: "newTab", listener: (event: IpcMainEvent, id: number) => void): this;
    on(channel: "openSettingsView", listener: (event: IpcMainEvent) => void): this;
    on(channel: "closeSettingsView", listener: (event: IpcMainEvent) => void): this;
    on(channel: "updateFigmaUiScale", listener: (event: IpcMainEvent, scale: number) => void): this;
    on(channel: "updatePanelScale", listener: (event: IpcMainEvent, scale: number) => void): this;
    on(channel: "setVisibleMainMenu", listener: (event: IpcMainEvent, visible: boolean) => void): this;
    on(channel: "setDisableMainMenu", listener: (event: IpcMainEvent, disable: boolean) => void): this;
    on(channel: "startAppAuth", listener: (event: IpcMainEvent, auth: { grantPath: string }) => void): this;
    on(channel: "finishAppAuth", listener: (event: IpcMainEvent, auth: { redirectURL: string }) => void): this;
    on(channel: "setFeatureFlags", listener: (event: IpcMainEvent, auth: { featureFlags: FeatureFlags }) => void): this;
  }

  interface IpcRenderer extends NodeJS.EventEmitter {
    on(channel: "renderView", listener: (event: IpcRendererEvent, view: View) => void): this;
    on(channel: "renderSettingsView", listener: (event: IpcRendererEvent, view: SettingsView) => void): this;
    on(channel: "updateMainMenuVisibility", listener: (event: IpcRendererEvent, show: boolean) => void): this;
    on(channel: "updatePanelHeight", listener: (event: IpcRendererEvent, height: number) => void): this;
    on(channel: "updatePanelScale", listener: (event: IpcRendererEvent, scale: number) => void): this;
    on(channel: "updateUiScale", listener: (event: IpcRendererEvent, scale: number) => void): this;
    on(
      channel: "updateFileKey",
      listener: (event: IpcRendererEvent, data: { id: number; fileKey: string }) => void,
    ): this;
    on(channel: "setTabUrl", listener: (event: IpcRendererEvent, data: { id: number; url: string }) => void): this;
    on(channel: "closeAllTabs", listener: (event: IpcRendererEvent) => void): this;
    on(channel: "setTitle", listener: (event: IpcRendererEvent, data: { id: number; title: string }) => void): this;
    on(channel: "closeTab", listener: (event: IpcRendererEvent, data: { id: number }) => void): this;
    on(channel: "didTabAdd", listener: (event: IpcRendererEvent, data: Tab) => void): this;
    on(channel: "getUploadedThemes", listener: (event: IpcRendererEvent, themes: Themes.Theme[]) => void): this;

    send(channel: string, ...args: any[]): void;
    send(channel: "setTitle", data: { id: number; title: string }): this;
    send(channel: "setPluginMenuData", pluginMenu: Menu.MenuItem[]): this;
    send(channel: "receiveTabs", tabs: Tab[]): this;
    send(channel: "updateActionState", state: MenuState.State): this;
    send(channel: "closeAllTab"): this;
    send(channel: "setFocusToMainTab"): this;
    send(channel: "updateFileKey", data: { id: number; fileKey: string }): this;
    send(channel: "setTabUrl", data: { id: number; url: string }): this;
    send(channel: "setTabFocus", id: number): this;
    send(channel: "closeTab", id: number): this;
    send(channel: "newTab"): this;
    send(channel: "openSettingsView"): this;
    send(channel: "closeSettingsView"): this;
    send(channel: "updateFigmaUiScale", scale: number): this;
    send(channel: "updatePanelScale", scale: number): this;
    send(channel: "setVisibleMainMenu", visible: boolean): this;
    send(channel: "setDisableMainMenu", disable: boolean): this;
  }

  interface WebContents extends NodeJS.EventEmitter {
    send(channel: "renderView", view: View): void;
    send(channel: "getUploadedThemes", themes: Themes.Theme[]): void;
    send(channel: "renderSettingsView", view: SettingsView): void;
    send(channel: "updateMainMenuVisibility", show: boolean): void;
    send(channel: "updatePanelHeight", height: number): void;
    send(channel: "updatePanelScale", scale: number): void;
    send(channel: "updateUiScale", scale: number): void;
    send(channel: "closeAllTab"): void;
    send(channel: "updateFileKey", data: { id: number; fileKey: string }): this;
    send(channel: "setTabUrl", data: { id: number; url: string }): this;
    send(channel: "setTitle", data: { id: number; title: string }): void;
    send(channel: "closeTab", data: { id: number }): this;
    send(channel: "didTabAdd", data: Tab): this;
  }

  interface RequestHeaders {
    [name: string]: string;
  }
}
