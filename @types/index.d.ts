type FontsMap = import("figma-linux-rust-binding").Fonts.IFonts;

declare namespace Electron {
  interface RemoteMainInterface {
    app: App;
  }

  interface MenuItemConstructorOptions {
    click?: (menuItem: Menu.PluginMenuItem, browserWindow: BrowserWindow | undefined, event: KeyboardEvent) => void;
  }

  interface MenuItem {
    click: (item: MenuItemConstructorOptions, window: BrowserWindow, event: Event) => void;
  }

  interface App extends NodeJS.EventEmitter {
    on(event: "handle-command", listener: (sender: Electron.WebContents, command: string) => void): this;
    on(event: "handle-page-command", listener: (item: any, window: BrowserWindow) => void): this;
    on(event: "os-menu-invalidated", listener: (dependencies: MenuState.MenuStateParams) => void): this;
    on(event: "log", listener: (data: any) => void): this;
    on(event: "sign-out", listener: () => void): this;
    on(event: "set-default-theme", listener: () => void): this;
    on(event: "themes-add-repository", listener: () => void): this;
    on(event: "themes-remove-repository", listener: () => void): this;
    on(event: "toggle-settings-developer-tools", listener: () => void): this;
    on(event: "toggle-current-tab-devtools", listener: () => void): this;
    on(event: "handleUrl", listener: (senderId: number, url: string) => void): this;
    on(event: "openSettingsView", listener: () => void): this;
    on(event: "openThemeCreatorView", listener: () => void): this;

    emit(event: "handle-command", sender: Electron.WebContents, command: string): boolean;
    emit(event: "handle-page-command", item: any, window: BrowserWindow): boolean;
    emit(event: "os-menu-invalidated", dependencies: MenuState.MenuStateParams): boolean;
    emit(event: "log", data: any): boolean;
    emit(event: "sign-out"): boolean;
    emit(event: "set-default-theme"): boolean;
    emit(event: "themes-add-repository"): boolean;
    emit(event: "themes-remove-repository"): boolean;
    emit(event: "toggle-settings-developer-tools"): boolean;
    emit(event: "toggle-current-tab-devtools"): boolean;
    emit(event: "handleUrl", senderId: number, url: string): boolean;
    emit(event: "openSettingsView"): boolean;
    emit(event: "openThemeCreatorView"): boolean;
  }

  interface IpcMain extends NodeJS.EventEmitter {
    on(channel: string, listener: (event: IpcMainInvokeEvent, args: any) => void): this;
    on(channel: "setTitle", listener: (event: IpcMainInvokeEvent, title: string) => void): this;
    on(channel: "setPluginMenuData", listener: (event: IpcMainInvokeEvent, pluginMenu: Menu.MenuItem[]) => void): this;
    on(channel: "receiveTabs", listener: (event: IpcMainInvokeEvent, tabs: Tab[]) => void): this;
    on(channel: "updateActionState", listener: (event: IpcMainInvokeEvent, state: MenuState.State) => void): this;
    on(channel: "updateFileKey", listener: (event: IpcMainInvokeEvent, key: string) => void): this;
    on(channel: "setTabUrl", listener: (event: IpcMainInvokeEvent, url: string) => void): this;
    on(channel: "closeAllTab", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "setFocusToMainTab", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "setTabFocus", listener: (event: IpcMainInvokeEvent, id: number) => void): this;
    on(channel: "closeTab", listener: (event: IpcMainInvokeEvent, id: number) => void): this;
    on(channel: "newTab", listener: (event: IpcMainInvokeEvent, id: number) => void): this;
    on(channel: "closeSettingsView", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "closeThemeCreatorView", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "themeCreatorExportTheme", listener: (event: IpcMainInvokeEvent, theme: Themes.Theme) => void): this;
    on(
      channel: "enableColorSpaceSrgbWasChanged",
      listener: (event: IpcMainInvokeEvent, enabled: boolean) => void,
    ): this;
    on(channel: "updateFigmaUiScale", listener: (event: IpcMainInvokeEvent, scale: number) => void): this;
    on(channel: "updatePanelScale", listener: (event: IpcMainInvokeEvent, scale: number) => void): this;
    on(channel: "startAppAuth", listener: (event: IpcMainInvokeEvent, auth: { grantPath: string }) => void): this;
    on(channel: "finishAppAuth", listener: (event: IpcMainInvokeEvent, auth: { redirectURL: string }) => void): this;
    on(
      channel: "setFeatureFlags",
      listener: (event: IpcMainInvokeEvent, auth: { featureFlags: FeatureFlags }) => void,
    ): this;
    on(channel: "log-debug", listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): this;
    on(channel: "log-info", listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): this;
    on(channel: "log-error", listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): this;
    on(
      channel: "openDevTools",
      listener: (event: IpcMainInvokeEvent, mode: "right" | "bottom" | "undocked" | "detach") => void,
    ): this;
    on(channel: "removeLocalFileExtension", listener: (event: IpcMainInvokeEvent, id: number) => void): this;
    on(channel: "openExtensionDirectory", listener: (event: IpcMainInvokeEvent, id: number) => void): this;
    on(channel: "openMenu", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "appExit", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "newProject", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "updateVisibleNewProjectBtn", listener: (event: IpcMainInvokeEvent, visible: boolean) => void): this;
    on(channel: "themes-change", listener: (event: IpcMainInvokeEvent, theme: Themes.Theme) => void): this;
    on(channel: "set-default-theme", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "saveCreatorTheme", listener: (event: IpcMainInvokeEvent, theme: Themes.Theme) => void): this;
    on(channel: "sync-themes", listener: (event: IpcMainInvokeEvent) => void): this;
    on(
      channel: "set-clipboard-data",
      listener: (event: IpcMainInvokeEvent, data: WebApi.SetClipboardData) => void,
    ): this;

    handle(
      channel: "writeNewExtensionToDisk",
      listener: (event: IpcMainInvokeEvent, data: WebApi.WriteNewExtensionToDiskArgs) => Promise<number> | number,
    ): void;
    handle(channel: "getAllLocalFileExtensionIds", listener: (event: IpcMainInvokeEvent) => Promise<void> | any): void;
    handle(
      channel: "getLocalFileExtensionManifest",
      listener: (
        event: IpcMainInvokeEvent,
        id: number,
      ) => Promise<void> | Extensions.ExtensionWithManifest | Extensions.ExtensionWithError,
    ): void;
    handle(
      channel: "getLocalFileExtensionSource",
      listener: (
        event: IpcMainInvokeEvent,
        id: number,
      ) => Promise<void> | Extensions.ExtensionSource | Extensions.ExtensionSourceError,
    ): void;
    handle(
      channel: "createMultipleNewLocalFileExtensions",
      listener: (event: IpcMainInvokeEvent, data: WebApi.CreateMultipleExtension) => Promise<void> | any,
    ): void;
    handle(channel: "isDevToolsOpened", listener: (event: IpcMainInvokeEvent) => Promise<void> | any): void;
    handle(
      channel: "writeFiles",
      listener: (event: IpcMainInvokeEvent, data: WebApi.WriteFiles) => Promise<void> | void,
    ): void;
    handle(channel: "get-fonts", listener: (event: IpcMainInvokeEvent) => Promise<void> | FontsMap): void;
    handle(
      channel: "get-font-file",
      listener: (event: IpcMainInvokeEvent, data: WebApi.GetFontFile) => Promise<void> | Buffer,
    ): void;
  }

  interface IpcRenderer extends NodeJS.EventEmitter {
    on(channel: "renderView", listener: (event: IpcRendererEvent, view: View) => void): this;
    on(channel: "updatePanelHeight", listener: (event: IpcRendererEvent, height: number) => void): this;
    on(channel: "updateVisibleNewProjectBtn", listener: (event: IpcRendererEvent, visible: boolean) => void): this;
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
    on(channel: "mainTabFocused", listener: (event: IpcRendererEvent) => void): this;
    on(channel: "themes-change", listener: (event: IpcRendererEvent, theme: Themes.Theme) => void): this;
    on(channel: "set-default-theme", listener: (event: IpcRendererEvent) => void): this;
    on(channel: "loadCreatorTheme", listener: (event: IpcRendererEvent, theme: Themes.Theme) => void): this;
    on(channel: "sync-themes-start", listener: (event: IpcRendererEvent) => void): this;
    on(channel: "sync-themes-end", listener: (event: IpcRendererEvent) => void): this;
    on(channel: "did-maximized", listener: (event: IpcRendererEvent) => void): this;
    on(channel: "did-restored", listener: (event: IpcRendererEvent) => void): this;

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
    send(channel: "closeSettingsView"): this;
    send(channel: "closeThemeCreatorView"): this;
    send(channel: "themeCreatorExportTheme", theme: Themes.Theme): this;
    send(channel: "enableColorSpaceSrgbWasChanged", enabled: boolean): this;
    send(channel: "updateFigmaUiScale", scale: number): this;
    send(channel: "updatePanelScale", scale: number): this;
    send(channel: "log-debug", ...args: any[]): this;
    send(channel: "log-info", ...args: any[]): this;
    send(channel: "log-error", ...args: any[]): this;
    send(channel: "removeLocalFileExtension", id: number): this;
    send(channel: "openExtensionDirectory", id: number): this;
    send(channel: "openMenu"): this;
    send(channel: "newProject"): this;
    send(channel: "appExit"): this;
    send(channel: "updateVisibleNewProjectBtn", visible: boolean): this;
    send(channel: "themes-change", theme: Themes.Theme): this;
    send(channel: "set-default-theme"): this;
    send(channel: "saveCreatorTheme", theme: Themes.Theme): this;
    send(channel: "sync-themes"): this;
    send(channel: "set-clipboard-data", data: WebApi.SetClipboardData): this;
    send(channel: "did-maximized"): this;
    send(channed: "did-restored"): this;

    invoke(channel: "writeNewExtensionToDisk", data: WebApi.WriteNewExtensionToDiskArgs): Promise<number>;
    invoke(channel: "getAllLocalFileExtensionIds"): Promise<number[]>;
    invoke(channel: "getLocalFileExtensionManifest", id: number): Promise<number[]>;
    invoke(
      channel: "getLocalFileExtensionSource",
      id: number,
    ): Promise<Extensions.ExtensionSource | Extensions.ExtensionSourceError>;
    invoke(channel: "createMultipleNewLocalFileExtensions", data: WebApi.CreateMultipleExtension): Promise<any>;
    invoke(channel: "isDevToolsOpened"): Promise<boolean>;
    invoke(channel: "writeFiles", data: WebApi.WriteFiles): Promise<void>;
    invoke(channel: "get-fonts"): Promise<FontsMap>;
    invoke(channel: "get-font-file", data: WebApi.GetFontFile): Promise<Buffer>;
  }

  interface WebContents extends NodeJS.EventEmitter {
    send(channel: "renderView", view: View): void;
    send(channel: "getUploadedThemes", themes: Themes.Theme[]): void;
    send(channel: "updatePanelHeight", height: number): void;
    send(channel: "updateVisibleNewProjectBtn", visible: boolean): void;
    send(channel: "updatePanelScale", scale: number): void;
    send(channel: "updateUiScale", scale: number): void;
    send(channel: "closeAllTab"): void;
    send(channel: "updateFileKey", data: { id: number; fileKey: string }): this;
    send(channel: "setTabUrl", data: { id: number; url: string }): this;
    send(channel: "setTitle", data: { id: number; title: string }): void;
    send(channel: "closeTab", data: { id: number }): this;
    send(channel: "didTabAdd", data: Tab): this;
    send(channel: "handleUrl", url: string): this;
    send(channel: "mainTabFocused"): this;
    send(channel: "themes-change", theme: Themes.Theme): this;
    send(channel: "loadCreatorTheme", theme: Themes.Theme): this;
    send(channel: "sync-themes-start", theme: Themes.Theme): this;
    send(channel: "sync-themes-end", theme: Themes.Theme): this;

    destroy(): void;
  }

  interface RequestHeaders {
    [name: string]: string;
  }
}
