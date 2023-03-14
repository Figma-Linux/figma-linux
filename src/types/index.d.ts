type FontsMap = import("figma-linux-rust-binding").Fonts.IFonts;

declare namespace Electron {
  interface RemoteMainInterface {
    app: App;
  }

  // interface MenuItemConstructorOptions {
  //   click?: (menuItem: Menu.PluginMenuItem, browserWindow: BrowserWindow | undefined, event: KeyboardEvent) => void;
  // }

  // interface MenuItem {
  //   click: (item: MenuItemConstructorOptions, window: BrowserWindow, event: Event) => void;
  // }

  interface App extends NodeJS.EventEmitter {
    on(event: "newFile", listener: (sender: Electron.WebContents) => void): this;
    on(event: "closeTab", listener: (sender: Electron.WebContents) => void): this;
    on(event: "closeAllTab", listener: () => void): this;
    on(event: "chromeGpu", listener: (sender: Electron.WebContents) => void): this;
    on(event: "openFileUrlClipboard", listener: (sender: Electron.WebContents) => void): this;
    on(event: "openFileBrowser", listener: (sender: Electron.WebContents) => void): this;
    on(event: "reopenClosedTab", listener: (sender: Electron.WebContents) => void): this;
    on(event: "handle-page-command", listener: (item: any, window: BrowserWindow) => void): this;
    on(
      event: "os-menu-invalidated",
      listener: (dependencies: MenuState.MenuStateParams) => void,
    ): this;
    on(event: "log", listener: (data: any) => void): this;
    on(event: "signOut", listener: () => void): this;
    on(event: "themes-add-repository", listener: () => void): this;
    on(event: "themes-remove-repository", listener: () => void): this;
    on(event: "toggleSettingsDeveloperTools", listener: () => void): this;
    on(event: "toggleCurrentTabDevTools", listener: () => void): this;
    on(
      event: "handlePluginMenuAction",
      listener: (pluginMenuAction: Menu.MenuAction) => void,
    ): this;
    on(event: "handleUrl", listener: (url: string) => void): this;
    on(event: "openUrlInNewTab", listener: (url: string) => void): this;
    on(event: "openSettingsView", listener: () => void): this;
    on(event: "windowClose", listener: (windowId: number) => void): this;
    on(event: "windowFocus", listener: (windowId: number) => void): this;
    on(event: "syncThemesStart", listener: () => void): this;
    on(event: "syncThemesEnd", listener: (themes: Themes.Theme[]) => void): this;
    on(event: "loadCreatorTheme", listener: (themes: Themes.Theme) => void): this;
    on(event: "loadCurrentTheme", listener: (themes: Themes.Theme) => void): this;
    on(event: "loadCreatorThemes", listener: (themes: Themes.Theme[]) => void): this;
    on(event: "requestBoundsForTabView", listener: (windowId: number) => void): this;
    on(event: "relaunchApp", listener: () => void): this;
    on(event: "quitApp", listener: () => void): this;
    on(event: "reloadCurrentTheme", listener: () => void): this;

    emit(event: string, ...args: any[]): boolean;
    emit(event: "newFile", sender: Electron.WebContents): boolean;
    emit(event: "closeTab", sender: Electron.WebContents): boolean;
    emit(event: "closeAllTab"): boolean;
    emit(event: "chromeGpu", sender: Electron.WebContents): boolean;
    emit(event: "openFileUrlClipboard", sender: Electron.WebContents): boolean;
    emit(event: "openFileBrowser", sender: Electron.WebContents): boolean;
    emit(event: "reopenClosedTab", sender: Electron.WebContents): boolean;
    emit(event: "handle-page-command", item: any, window: BrowserWindow): boolean;
    emit(event: "os-menu-invalidated", dependencies: MenuState.MenuStateParams): boolean;
    emit(event: "log", data: any): boolean;
    emit(event: "signOut"): boolean;
    emit(event: "themes-add-repository"): boolean;
    emit(event: "themes-remove-repository"): boolean;
    emit(event: "toggleSettingsDeveloperTools"): boolean;
    emit(event: "toggleCurrentTabDevTools"): boolean;
    emit(event: "handlePluginMenuAction", pluginMenuAction: Menu.MenuAction): boolean;
    emit(event: "handleUrl", url: string): boolean;
    emit(event: "openUrlInNewTab", url: string): boolean;
    emit(event: "openSettingsView"): boolean;
    emit(event: "windowClose", windowId: number): void;
    emit(event: "windowFocus", windowId: number): void;
    emit(event: "syncThemesStart"): void;
    emit(event: "syncThemesEnd", themes: Themes.Theme[]): void;
    emit(event: "loadCreatorTheme", themes: Themes.Theme): void;
    emit(event: "loadCurrentTheme", themes: Themes.Theme): void;
    emit(event: "loadCreatorThemes", themes: Themes.Theme[]): void;
    emit(event: "requestBoundsForTabView", windowId: number): void;
    emit(event: "relaunchApp"): void;
    emit(event: "quitApp"): void;
    emit(event: "reloadCurrentTheme"): void;
  }

  interface IpcMain extends NodeJS.EventEmitter {
    on(channel: string, listener: (event: IpcMainInvokeEvent, args: any) => void): this;
    on(channel: "setTitle", listener: (event: IpcMainInvokeEvent, title: string) => void): this;
    on(
      channel: "setPluginMenuData",
      listener: (event: IpcMainInvokeEvent, pluginMenu: Menu.MenuItem[]) => void,
    ): this;
    on(
      channel: "updateActionState",
      listener: (event: IpcMainInvokeEvent, state: MenuState.State) => void,
    ): this;
    on(
      channel: "updateFileKey",
      listener: (event: IpcMainInvokeEvent, windowId: number, key: string) => void,
    ): this;
    on(channel: "closeAllTab", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "setFocusToMainTab", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "setTabFocus", listener: (event: IpcMainInvokeEvent, id: number) => void): this;
    on(channel: "closeTab", listener: (event: IpcMainInvokeEvent, id: number) => void): this;
    on(
      channel: "closeSettingsView",
      listener: (event: IpcMainInvokeEvent, settings: Types.SettingsInterface) => void,
    ): this;
    on(
      channel: "themeCreatorExportTheme",
      listener: (event: IpcMainInvokeEvent, theme: Themes.Theme) => void,
    ): this;
    on(
      channel: "themeCreatorAddTheme",
      listener: (event: IpcMainInvokeEvent, theme: Themes.Theme) => void,
    ): this;
    on(
      channel: "themeCreatorRemoveTheme",
      listener: (event: IpcMainInvokeEvent, themeId: string) => void,
    ): this;
    on(
      channel: "enableColorSpaceSrgbWasChanged",
      listener: (event: IpcMainInvokeEvent, enabled: boolean) => void,
    ): this;
    on(
      channel: "disableThemesChanged",
      listener: (event: IpcMainInvokeEvent, enabled: boolean) => void,
    ): this;
    on(
      channel: "updateFigmaUiScale",
      listener: (event: IpcMainInvokeEvent, scale: number) => void,
    ): this;
    on(
      channel: "updatePanelScale",
      listener: (event: IpcMainInvokeEvent, scale: number) => void,
    ): this;
    on(
      channel: "startAppAuth",
      listener: (event: IpcMainInvokeEvent, auth: { grantPath: string }) => void,
    ): this;
    on(
      channel: "finishAppAuth",
      listener: (event: IpcMainInvokeEvent, auth: { redirectURL: string }) => void,
    ): this;
    on(
      channel: "setAuthedUsers",
      listener: (event: IpcMainInvokeEvent, userIds: string[]) => void,
    ): this;
    on(
      channel: "setUsingMicrophone",
      listener: (event: IpcMainInvokeEvent, isUsingMicrophone: boolean) => void,
    ): this;
    on(
      channel: "setIsInVoiceCall",
      listener: (event: IpcMainInvokeEvent, isInVoiceCall: boolean) => void,
    ): this;
    on(
      channel: "setWorkspaceName",
      listener: (event: IpcMainInvokeEvent, name: string) => void,
    ): this;
    on(
      channel: "setFigjamEnabled",
      listener: (event: IpcMainInvokeEvent, enabled: boolean) => void,
    ): this;
    on(
      channel: "setFeatureFlags",
      listener: (event: IpcMainInvokeEvent, data: { featureFlags: Types.FeatureFlags }) => void,
    ): this;
    on(channel: "log-debug", listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): this;
    on(channel: "log-info", listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): this;
    on(channel: "log-error", listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): this;
    on(
      channel: "openDevTools",
      listener: (
        event: IpcMainInvokeEvent,
        mode: "right" | "bottom" | "undocked" | "detach",
      ) => void,
    ): this;
    on(
      channel: "removeLocalFileExtension",
      listener: (event: IpcMainInvokeEvent, id: number) => void,
    ): this;
    on(
      channel: "openExtensionDirectory",
      listener: (event: IpcMainInvokeEvent, id: number) => void,
    ): this;
    on(channel: "openMainMenu", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "openTabMenu", listener: (event: IpcMainInvokeEvent, tabId: number) => void): this;
    on(channel: "appExit", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "newProject", listener: (event: IpcMainInvokeEvent) => void): this;
    on(
      channel: "updateVisibleNewProjectBtn",
      listener: (event: IpcMainInvokeEvent, visible: boolean) => void,
    ): this;
    on(
      channel: "saveCreatorTheme",
      listener: (event: IpcMainInvokeEvent, theme: Themes.Theme) => void,
    ): this;
    on(channel: "syncThemes", listener: (event: IpcMainInvokeEvent) => void): this;
    on(
      channel: "setClipboardData",
      listener: (event: IpcMainInvokeEvent, data: WebApi.SetClipboardData) => void,
    ): this;
    on(
      channel: "set-use-zenity",
      listener: (event: IpcMainInvokeEvent, value: boolean) => void,
    ): this;
    on(
      channel: "saveSettings",
      listener: (event: IpcMainInvokeEvent, settings: Types.SettingsInterface) => void,
    ): this;
    on(
      channel: "updateFigmaUiScale",
      listener: (event: IpcMainInvokeEvent, theme: Themes.Theme) => void,
    ): this;
    on(channel: "windowClose", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "changeTheme", listener: (event: IpcMainEvent, theme: Themes.Theme) => void): this;

    handle(
      channel: "writeNewExtensionToDisk",
      listener: (
        event: IpcMainInvokeEvent,
        data: WebApi.WriteNewExtensionToDiskArgs,
      ) => Promise<number> | number,
    ): void;
    handle(
      channel: "getAllLocalFileExtensionIds",
      listener: (event: IpcMainInvokeEvent) => Promise<void> | any,
    ): void;
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
      ) => Promise<void> | Extensions.ExtensionSource,
    ): void;
    handle(
      channel: "createMultipleNewLocalFileExtensions",
      listener: (
        event: IpcMainInvokeEvent,
        data: WebApi.CreateMultipleExtension,
      ) => Promise<void> | any,
    ): void;
    handle(
      channel: "isDevToolsOpened",
      listener: (event: IpcMainInvokeEvent) => Promise<void> | any,
    ): void;
    handle(
      channel: "themesIsDisabled",
      listener: (event: IpcMainInvokeEvent) => Promise<void> | boolean,
    ): void;
    handle(
      channel: "writeFiles",
      listener: (event: IpcMainInvokeEvent, data: WebApi.WriteFiles) => Promise<void> | void,
    ): void;
    handle(
      channel: "getFonts",
      listener: (event: IpcMainInvokeEvent) => Promise<void> | FontsMap,
    ): void;
    handle(
      channel: "getFontFile",
      listener: (event: IpcMainInvokeEvent, data: WebApi.GetFontFile) => Promise<void> | Buffer,
    ): void;
    handle(
      channel: "add-font-directories",
      listener: (event: IpcMainInvokeEvent) => Promise<string[] | null>,
    ): void;
    handle(
      channel: "selectExportDirectory",
      listener: (event: IpcMainInvokeEvent) => Promise<string | null>,
    ): void;
  }

  interface IpcRenderer extends NodeJS.EventEmitter {
    on(channel: "renderView", listener: (event: IpcRendererEvent, view: Types.View) => void): this;
    on(
      channel: "updateVisibleNewProjectBtn",
      listener: (event: IpcRendererEvent, visible: boolean) => void,
    ): this;
    on(
      channel: "setPanelScale",
      listener: (event: IpcRendererEvent, scale: number, height: number) => void,
    ): this;
    on(channel: "updateUiScale", listener: (event: IpcRendererEvent, scale: number) => void): this;
    on(channel: "closeAllTabs", listener: (event: IpcRendererEvent) => void): this;
    on(
      channel: "setTitle",
      listener: (event: IpcRendererEvent, data: { id: number; title: string }) => void,
    ): this;
    on(channel: "didTabAdd", listener: (event: IpcRendererEvent, data: Types.Tab) => void): this;
    on(
      channel: "themesLoaded",
      listener: (event: IpcRendererEvent, themes: Themes.Theme[]) => void,
    ): this;
    on(channel: "focusTab", listener: (event: IpcRendererEvent, tabId: number) => void): this;
    on(
      channel: "setUsingMicrophone",
      listener: (event: IpcRendererEvent, data: { id: number; isUsingMicrophone: boolean }) => void,
    ): this;
    on(
      channel: "setIsInVoiceCall",
      listener: (event: IpcRendererEvent, data: { id: number; isInVoiceCall: boolean }) => void,
    ): this;
    on(
      channel: "loadCreatorTheme",
      listener: (event: IpcRendererEvent, theme: Themes.Theme) => void,
    ): this;
    on(
      channel: "loadCurrentTheme",
      listener: (event: IpcRendererEvent, theme: Themes.Theme) => void,
    ): this;
    on(
      channel: "loadCreatorThemes",
      listener: (event: IpcRendererEvent, themes: Themes.Theme[]) => void,
    ): this;
    on(channel: "syncThemesStart", listener: (event: IpcRendererEvent) => void): this;
    on(channel: "syncThemesEnd", listener: (event: IpcRendererEvent) => void): this;
    on(channel: "windowDidMaximized", listener: (event: IpcRendererEvent) => void): this;
    on(channel: "windowDidRestored", listener: (event: IpcRendererEvent) => void): this;
    on(
      channel: "isMainMenuOpen",
      listener: (event: IpcRendererEvent, isOpen: boolean) => void,
    ): this;
    on(
      channel: "loadSettings",
      listener: (event: IpcRendererEvent, settings: Types.SettingsInterface) => void,
    ): this;

    send(channel: string, ...args: any[]): void;
    send(channel: "setTitle", data: { id: number; title: string }): this;
    send(channel: "setPluginMenuData", pluginMenu: Menu.MenuItem[]): this;
    send(channel: "updateActionState", state: MenuState.State): this;
    send(channel: "closeAllTab"): this;
    send(channel: "setFocusToMainTab"): this;
    send(channel: "updateFileKey", windowId: number, key: string): this;
    send(channel: "setTabFocus", id: number): this;
    send(channel: "closeTab", id: number): this;
    send(channel: "closeSettingsView", settings: Types.SettingsInterface): this;
    send(channel: "themeCreatorExportTheme", theme: Themes.Theme): this;
    send(channel: "themeCreatorAddTheme", theme: Themes.Theme): this;
    send(channel: "themeCreatorRemoveTheme", themeId: string): this;
    send(channel: "enableColorSpaceSrgbWasChanged", enabled: boolean): this;
    send(channel: "disableThemesChanged", enabled: boolean): this;
    send(channel: "updateFigmaUiScale", scale: number): this;
    send(channel: "log-debug", ...args: any[]): this;
    send(channel: "log-info", ...args: any[]): this;
    send(channel: "log-error", ...args: any[]): this;
    send(channel: "removeLocalFileExtension", id: number): this;
    send(channel: "openExtensionDirectory", id: number): this;
    send(channel: "openMainMenu"): this;
    send(channel: "openTabMenu", tabId: number): this;
    send(channel: "newProject"): this;
    send(channel: "appExit"): this;
    send(channel: "updateVisibleNewProjectBtn", visible: boolean): this;
    send(channel: "saveCreatorTheme", theme: Themes.Theme): this;
    send(channel: "syncThemes"): this;
    send(channel: "setClipboardData", data: WebApi.SetClipboardData): this;
    send(channel: "set-use-zenity", value: boolean): this;
    send(channel: "saveSettings", settings: Types.SettingsInterface): this;
    send(channel: "windowDidMaximized"): this;
    send(channed: "windowDidRestored"): this;
    send(channed: "changeTheme", theme: Themes.Theme): this;
    send(channed: "windowClose"): this;

    sendSync(channed: "getSettings"): Types.SettingsInterface;

    invoke(
      channel: "writeNewExtensionToDisk",
      data: WebApi.WriteNewExtensionToDiskArgs,
    ): Promise<number>;
    invoke(channel: "getAllLocalFileExtensionIds"): Promise<number[]>;
    invoke(channel: "getLocalFileExtensionManifest", id: number): Promise<number[]>;
    invoke(channel: "getLocalFileExtensionSource", id: number): Promise<Extensions.ExtensionSource>;
    invoke(
      channel: "createMultipleNewLocalFileExtensions",
      data: WebApi.CreateMultipleExtension,
    ): Promise<any>;
    invoke(channel: "themesIsDisabled"): Promise<boolean>;
    invoke(channel: "isDevToolsOpened"): Promise<boolean>;
    invoke(channel: "writeFiles", data: WebApi.WriteFiles): Promise<void>;
    invoke(channel: "getFonts"): Promise<FontsMap>;
    invoke(channel: "getFontFile", data: WebApi.GetFontFile): Promise<Buffer>;
    invoke(channel: "add-font-directories"): Promise<string[] | null>;
    invoke(channel: "selectExportDirectory"): Promise<string | null>;
    invoke(channel: "updatePanelScale", scale: number): this;
  }

  interface WebContents extends NodeJS.EventEmitter {
    send(channel: "renderView", view: Types.View): void;
    send(channel: "themesLoaded", themes: Themes.Theme[]): void;
    send(channel: "updateVisibleNewProjectBtn", visible: boolean): void;
    send(channel: "setPanelScale", scale: number, height: number): void;
    send(channel: "updateUiScale", scale: number): void;
    send(channel: "closeAllTab"): void;
    send(channel: "setTitle", data: { id: number; title: string }): void;
    send(channel: "didTabAdd", data: Types.Tab): this;
    send(channel: "handleUrl", url: string): this;
    send(channel: "focusTab", tabId: number): this;
    send(channel: "setUsingMicrophone", data: { id: number; isUsingMicrophone: boolean }): this;
    send(channel: "setIsInVoiceCall", data: { id: number; isInVoiceCall: boolean }): this;
    send(channel: "loadCreatorTheme", theme: Themes.Theme): this;
    send(channel: "loadCurrentTheme", theme: Themes.Theme): this;
    send(channel: "loadCreatorThemes", themes: Themes.Theme[]): this;
    send(channel: "syncThemesStart", theme: Themes.Theme): this;
    send(channel: "syncThemesEnd", theme: Themes.Theme): this;
    send(channel: "isMainMenuOpen", isOpen: boolean): this;
    send(channel: "loadSettings", settings: Types.SettingsInterface): this;

    destroy(): void;
  }

  interface RequestHeaders {
    [name: string]: string;
  }
}
