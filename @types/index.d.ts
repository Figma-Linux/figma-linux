declare namespace Electron {
  interface MainInterface extends CommonInterface {
    app: App;
  }

  interface MenuItem {
    click: (item: MenuItemConstructorOptions, window: BrowserWindow, event: Event) => void | Function;
  }

  interface App extends NodeJS.EventEmitter {
    on(event: "handle-command", listener: (command: string) => void): this;
    on(event: "handle-page-command", listener: (item: any, window: BrowserWindow) => void): this;
    on(event: "update-figma-ui-scale", listener: (scale: number) => void): this;
    on(event: "update-panel-scale", listener: (scale: number) => void): this;
    on(event: "set-hide-main-menu", listener: (hide: boolean) => void): this;
    on(event: "set-disable-main-menu", listener: (disabled: boolean) => void): this;
    on(event: "set-disable-fonts", listener: (disabled: boolean) => void): this;
    on(event: "os-menu-invalidated", listener: (dependencies: MenuState.MenuStateParams) => void): this;
    on(event: "log", listener: (data: any) => void): this;
    on(event: "sign-out", listener: () => void): this;
    on(event: "themes-change", listener: (theme: Themes.Palette) => void): this;
    on(event: "themes-add-repository", listener: () => void): this;
    on(event: "themes-remove-repository", listener: () => void): this;
    on(event: "toggle-settings-developer-tools", listener: () => void): this;

    once(event: "handle-command", listener: (command: string) => void): this;
    once(event: "handle-page-command", listener: (item: any, window: BrowserWindow) => void): this;
    once(event: "update-figma-ui-scale", listener: (scale: number) => void): this;
    once(event: "update-panel-scale", listener: (scale: number) => void): this;
    once(event: "set-hide-main-menu", listener: (hide: boolean) => void): this;
    once(event: "set-disable-main-menu", listener: (disabled: boolean) => void): this;
    once(event: "set-disable-fonts", listener: (disabled: boolean) => void): this;
    once(event: "os-menu-invalidated", listener: (dependencies: MenuState.MenuStateParams) => void): this;
    once(event: "log", listener: (data: any) => void): this;
    once(event: "sign-out", listener: () => void): this;
    once(event: "themes-change", listener: (theme: Themes.Palette) => void): this;
    once(event: "themes-add-repository", listener: () => void): this;
    once(event: "themes-remove-repository", listener: () => void): this;
    once(event: "toggle-settings-developer-tools", listener: () => void): this;

    addListener(event: "handle-command", listener: (command: string) => void): this;
    addListener(event: "handle-page-command", listener: (item: any, window: BrowserWindow) => void): this;
    addListener(event: "update-figma-ui-scale", listener: (scale: number) => void): this;
    addListener(event: "update-panel-scale", listener: (scale: number) => void): this;
    addListener(event: "set-hide-main-menu", listener: (hide: boolean) => void): this;
    addListener(event: "set-disable-main-menu", listener: (disabled: boolean) => void): this;
    addListener(event: "set-disable-fonts", listener: (disabled: boolean) => void): this;
    addListener(event: "os-menu-invalidated", listener: (dependencies: MenuState.MenuStateParams) => void): this;
    addListener(event: "log", listener: (data: any) => void): this;
    addListener(event: "sign-out", listener: () => void): this;
    addListener(event: "themes-change", listener: (theme: Themes.Palette) => void): this;
    addListener(event: "themes-add-repository", listener: () => void): this;
    addListener(event: "themes-remove-repository", listener: () => void): this;
    addListener(event: "toggle-settings-developer-tools", listener: () => void): this;

    removeListener(event: "handle-command", listener: (command: string) => void): this;
    removeListener(event: "handle-page-command", listener: (item: any, window: BrowserWindow) => void): this;
    removeListener(event: "update-figma-ui-scale", listener: (scale: number) => void): this;
    removeListener(event: "update-panel-scale", listener: (scale: number) => void): this;
    removeListener(event: "set-hide-main-menu", listener: (hide: boolean) => void): this;
    removeListener(event: "set-disable-main-menu", listener: (disabled: boolean) => void): this;
    removeListener(event: "set-disable-fonts", listener: (disabled: boolean) => void): this;
    removeListener(event: "os-menu-invalidated", listener: (dependencies: MenuState.MenuStateParams) => void): this;
    removeListener(event: "log", listener: (data: any) => void): this;
    removeListener(event: "sign-out", listener: () => void): this;
    removeListener(event: "themes-change", listener: (theme: Themes.Palette) => void): this;
    removeListener(event: "themes-add-repository", listener: () => void): this;
    removeListener(event: "themes-remove-repository", listener: () => void): this;
    removeListener(event: "toggle-settings-developer-tools", listener: () => void): this;

    emit(event: "handle-command", command: string): boolean;
    emit(event: "handle-page-command", item: any, window: BrowserWindow): boolean;
    emit(event: "update-figma-ui-scale", scale: number): boolean;
    emit(event: "update-panel-scale", scale: number): boolean;
    emit(event: "set-hide-main-menu", hide: boolean): boolean;
    emit(event: "set-disable-main-menu", disabled: boolean): boolean;
    emit(event: "set-disable-fonts", disabled: boolean): boolean;
    emit(event: "os-menu-invalidated", dependencies: MenuState.MenuStateParams): boolean;
    emit(event: "log", data: any): boolean;
    emit(event: "sign-out"): boolean;
    emit(event: "themes-change", theme: Themes.Palette): boolean;
    emit(event: "themes-add-repository"): boolean;
    emit(event: "themes-remove-repository"): boolean;
    emit(event: "toggle-settings-developer-tools"): boolean;
  }

  interface IpcMain extends NodeJS.EventEmitter {
    on(channel: string, listener: (event: IpcMainEvent, args: any) => void): this;
    on(channel: "setTitle", listener: (event: IpcMainEvent, title: string) => void): this;
    on(channel: "setPluginMenuData", listener: (event: IpcMainEvent, pluginMenu: Menu.MenuItem[]) => void): this;
    on(channel: "receiveTabs", listener: (event: IpcMainEvent, tabs: Tab[]) => void): this;
    on(channel: "toHome", listener: (event: IpcMainEvent) => void): this;
    on(channel: "updateActionState", listener: (event: IpcMainEvent, state: MenuState.State) => void): this;
    on(channel: "updateFileKey", listener: (event: IpcMainEvent, key: string) => void): this;
    on(channel: "setTabUrl", listener: (event: IpcMainEvent, url: string) => void): this;
    on(channel: "closeAllTab", listener: (event: IpcMainEvent) => void): this;
    on(channel: "setFocusToMainTab", listener: (event: IpcMainEvent) => void): this;
    on(channel: "clearView", listener: (event: IpcMainEvent) => void): this;
    on(channel: "setTabFocus", listener: (event: IpcMainEvent, id: number) => void): this;
    on(channel: "closeTab", listener: (event: IpcMainEvent, id: number) => void): this;
    on(channel: "newTab", listener: (event: IpcMainEvent, id: number) => void): this;
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
    on(channel: "closeAllTabl", listener: (event: IpcRendererEvent) => void): this;
    on(channel: "setTitle", listener: (event: IpcRendererEvent, data: { id: number; title: string }) => void): this;
    on(channel: "closeTab", listener: (event: IpcRendererEvent, data: { id: number }) => void): this;
    on(channel: "didTabAdd", listener: (event: IpcRendererEvent, data: Tab) => void): this;

    send(channel: string, ...args: any[]): void;
    send(channel: "setTitle", data: { id: number; title: string }): this;
    send(channel: "setPluginMenuData", pluginMenu: Menu.MenuItem[]): this;
    send(channel: "receiveTabs", tabs: Tab[]): this;
    send(channel: "toHome"): this;
    send(channel: "updateActionState", state: MenuState.State): this;
    send(channel: "closeAllTab"): this;
    send(channel: "setFocusToMainTab"): this;
    send(channel: "clearView"): this;
    send(channel: "updateFileKey", data: { id: number; fileKey: string }): this;
    send(channel: "setTabUrl", data: { id: number; url: string }): this;
    send(channel: "setTabFocus", id: number): this;
    send(channel: "closeTab", id: number): this;
    send(channel: "newTab"): this;
  }

  interface WebContents extends NodeJS.EventEmitter {
    send(channel: "renderView", view: View): void;
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
