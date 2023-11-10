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
    on(event: "newWindow", listener: (sender: Electron.WebContents) => void): this;
    on(event: "reloadTab", listener: (tabId: number) => void): this;
    on(event: "closeTab", listener: (windowId: number, tabId: number) => void): this;
    on(event: "closeCurrentTab", listener: (windowId: number) => void): this;
    on(event: "reopenClosedTab", listener: (windowId: number) => void): this;
    on(event: "closeCurrentWindow", listener: (windowId: number) => void): this;
    on(event: "closeCommunityTab", listener: () => void): this;
    on(event: "closeAllTab", listener: () => void): this;
    on(event: "chromeGpu", listener: (windowId: number) => void): this;
    on(event: "openFileUrlClipboard", listener: (sender: Electron.WebContents) => void): this;
    on(event: "openFileBrowser", listener: (sender: Electron.WebContents) => void): this;
    on(
      event: "restoreClosedTab",
      listener: (windowId: number, title: string, uri: string) => void,
    ): this;
    on(event: "handle-page-command", listener: (item: any, window: BrowserWindow) => void): this;
    on(event: "log", listener: (data: any) => void): this;
    on(event: "signOut", listener: () => void): this;
    on(event: "themes-add-repository", listener: () => void): this;
    on(event: "themes-remove-repository", listener: () => void): this;
    on(event: "toggleSettingsDeveloperTools", listener: () => void): this;
    on(event: "toggleCurrentWindowDevTools", listener: () => void): this;
    on(event: "toggleCurrentTabDevTools", listener: (windowId: number) => void): this;
    on(
      event: "handlePluginMenuAction",
      listener: (windowId: number, pluginMenuAction: Menu.MenuAction) => void,
    ): this;
    on(event: "handlePluginManageAction", listener: () => void): this;
    on(event: "handleUrl", listener: (url: string) => void): this;
    on(event: "openUrlInNewTab", listener: (url: string) => void): this;
    on(event: "openUrlFromCommunity", listener: (url: string) => void): this;
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
    on(event: "focusLastWindow", listener: () => void): this;
    on(
      event: "needUpdateMenu",
      listener: (
        windowId: number,
        tabId?: number,
        actionCheckedState?: { [key: string]: boolean },
      ) => void,
    ): this;
    on(
      event: "handleCallbackForTab",
      listener: (tabId: number, callbackID: number, args: any) => void,
    ): this;
    on(event: "enableColorSpaceSrgbWasChanged", listener: (enable: boolean) => void): this;
    on(event: "chromiumFlagsChanged", listener: (enable: boolean) => void): this;
    on(event: "disableThemesChanged", listener: (enable: boolean) => void): this;

    emit(event: string, ...args: any[]): boolean;
    emit(event: "newFile", sender: Electron.WebContents): boolean;
    emit(event: "newWindow", sender: Electron.WebContents): boolean;
    emit(event: "reloadTab", tabId: number): boolean;
    emit(event: "closeCommunityTab"): boolean;
    emit(event: "closeTab", windowId: number, tabId: number): boolean;
    emit(event: "closeCurrentTab", windowId: number): boolean;
    emit(event: "reopenClosedTab", windowId: number): boolean;
    emit(event: "closeCurrentWindow", windowId: number): boolean;
    emit(event: "closeAllTab"): boolean;
    emit(event: "chromeGpu", windowId: number): boolean;
    emit(event: "openFileUrlClipboard", sender: Electron.WebContents): boolean;
    emit(event: "openFileBrowser", sender: Electron.WebContents): boolean;
    emit(event: "restoreClosedTab", windowId: number, title: string, uri: string): boolean;
    emit(event: "handle-page-command", item: any, window: BrowserWindow): boolean;
    emit(event: "log", data: any): boolean;
    emit(event: "signOut"): boolean;
    emit(event: "themes-add-repository"): boolean;
    emit(event: "themes-remove-repository"): boolean;
    emit(event: "toggleSettingsDeveloperTools"): boolean;
    emit(event: "toggleCurrentWindowDevTools"): boolean;
    emit(event: "toggleCurrentTabDevTools", windowId: number): boolean;
    emit(
      event: "handlePluginMenuAction",
      windowId: number,
      pluginMenuAction: Menu.MenuAction,
    ): boolean;
    emit(event: "handlePluginManageAction"): boolean;
    emit(event: "handleUrl", url: string): boolean;
    emit(event: "openUrlInNewTab", url: string): boolean;
    emit(event: "openUrlFromCommunity", url: string): boolean;
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
    emit(event: "focusLastWindow"): void;
    emit(
      event: "needUpdateMenu",
      windowId: number,
      tabId?: number,
      actionCheckedState?: { [key: string]: boolean },
    ): void;
    emit(event: "handleCallbackForTab", tabId: number, callbackID: number, args: any): void;
    emit(event: "enableColorSpaceSrgbWasChanged", enable: boolean): void;
    emit(event: "chromiumFlagsChanged", enable: boolean): void;
    emit(event: "disableThemesChanged", enable: boolean): void;
  }

  interface IpcMain extends NodeJS.EventEmitter {
    on(channel: string, listener: (event: IpcMainInvokeEvent, args: any) => void): this;
    on(channel: "setTitle", listener: (event: IpcMainInvokeEvent, title: string) => void): this;
    on(
      channel: "openCommunity",
      listener: (event: IpcMainInvokeEvent, args: WebApi.OpenCommunity) => void,
    ): this;
    on(channel: "openFile", listener: (event: IpcMainInvokeEvent, url: string) => void): this;
    on(channel: "closeAllTab", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "setFocusToMainTab", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "setFocusToCommunityTab", listener: (event: IpcMainInvokeEvent) => void): this;
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
    on(channel: "enabled", listener: (event: IpcMainInvokeEvent, enabled: boolean) => void): this;
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
      channel: "setInitialOptions",
      listener: (event: IpcMainInvokeEvent, data: WebApi.SetInitOptions) => void,
    ): this;
    on(
      channel: "finishAppAuth",
      listener: (event: IpcMainInvokeEvent, auth: { redirectURL: string }) => void,
    ): this;
    on(
      channel: "setAuthedUsers",
      listener: (event: IpcMainInvokeEvent, userIds: string[]) => void,
    ): this;
    on(channel: "setUser", listener: (event: IpcMainInvokeEvent, userId: string) => void): this;
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
    on(channel: "logDebug", listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): this;
    on(channel: "logInfo", listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): this;
    on(channel: "logError", listener: (event: IpcMainInvokeEvent, ...args: any[]) => void): this;
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
    on(channel: "openMainTabMenu", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "openCommunityTabMenu", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "openTabMenu", listener: (event: IpcMainInvokeEvent, tabId: number) => void): this;
    on(channel: "appExit", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "newProject", listener: (event: IpcMainInvokeEvent) => void): this;
    on(channel: "closeCommunityTab", listener: (event: IpcMainInvokeEvent) => void): this;
    on(
      channel: "updateVisibleNewProjectBtn",
      listener: (event: IpcMainInvokeEvent, visible: boolean) => void,
    ): this;
    on(
      channel: "updateFullscreenMenuState",
      listener: (event: IpcMainInvokeEvent, state: Menu.State) => void,
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
      channel: "updateFigmaUiScale",
      listener: (event: IpcMainInvokeEvent, theme: Themes.Theme) => void,
    ): this;
    on(
      channel: "windowClose",
      listener: (event: IpcMainInvokeEvent, tabs: Types.TabFront[]) => void,
    ): this;
    on(channel: "changeTheme", listener: (event: IpcMainEvent, theme: Themes.Theme) => void): this;
    on(channel: "toggleThemeCreatorPreviewMask", listener: (event: IpcMainEvent) => void): this;
    on(
      channel: "getSettings",
      listener: (event: IpcMainEvent, settings: Types.SettingsInterface) => void,
    ): this;
    on(channel: "requestMicrophonePermission", listener: (event: IpcMainEvent) => void): this;
    on(
      channel: "web-callback:registerManifestChangeObserver",
      listener: (event: IpcMainEvent, callbackID: number, args?: any) => void,
    ): this;
    on(
      channel: "web-callback:registerCodeChangeObserver",
      listener: (event: IpcMainEvent, callbackID: number, args?: any) => void,
    ): this;
    on(
      channel: "web-callback:registerUiChangeObserver",
      listener: (event: IpcMainEvent, callbackID: number, args?: any) => void,
    ): this;

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
      channel: "createFile",
      listener: (event: IpcMainInvokeEvent, data: WebApi.CreateFile) => Promise<void> | any,
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
      listener: (event: IpcMainInvokeEvent) => Promise<void> | Fonts.IFonts,
    ): void;
    handle(
      channel: "getFontFile",
      listener: (event: IpcMainInvokeEvent, data: WebApi.GetFontFile) => Promise<void> | Buffer,
    ): void;
    handle(
      channel: "selectExportDirectory",
      listener: (event: IpcMainInvokeEvent) => Promise<string | null>,
    ): void;
    handle(
      channel: "writeNewExtensionDirectoryToDisk",
      listener: (
        event: IpcMainInvokeEvent,
        data: WebApi.WriteNewExtensionDirectoryToDisk,
      ) => Promise<string | null>,
    ): void;
    handle(
      channel: "getLocalManifestFileExtensionIdsToCachedMetadataMap",
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
    on(channel: "toggleThemeCreatorPreviewMask", listener: (event: IpcRendererEvent) => void): this;
    on(channel: "focusTab", listener: (event: IpcRendererEvent, tabId: number) => void): this;
    on(
      channel: "newFileBtnVisible",
      listener: (event: IpcRendererEvent, visible: boolean) => void,
    ): this;
    on(channel: "tabWasClosed", listener: (event: IpcRendererEvent, tabId: number) => void): this;
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
    on(channel: "communityTabWasClose", listener: (event: IpcRendererEvent) => void): this;
    on(
      channel: "setLoading",
      listener: (event: IpcRendererEvent, tabId: number, loading: boolean) => void,
    ): this;
    on(
      channel: "loadSettings",
      listener: (event: IpcRendererEvent, settings: Types.SettingsInterface) => void,
    ): this;
    on(
      channel: "getThemeCreatorPalette",
      listener: (event: IpcRendererEvent, palette: Themes.Palette) => void,
    ): this;
    on(
      channel: "changeZoomFactor",
      listener: (event: IpcRendererEvent, zoom: number) => void,
    ): this;
    on(channel: "openCommunity", listener: (event: IpcRendererEvent) => void): this;

    send(channel: string, ...args: any[]): void;
    send(channel: "setTitle", data: { id: number; title: string }): this;
    send(channel: "openCommunity", args: WebApi.OpenCommunity): this;
    send(channel: "openFile", url: string): this;
    send(channel: "closeAllTab"): this;
    send(channel: "setFocusToMainTab"): this;
    send(channel: "setFocusToCommunityTab"): this;
    send(channel: "setTabFocus", id: number): this;
    send(channel: "closeTab", id: number): this;
    send(channel: "closeSettingsView", settings: Types.SettingsInterface): this;
    send(channel: "themeCreatorExportTheme", theme: Themes.Theme): this;
    send(channel: "themeCreatorAddTheme", theme: Themes.Theme): this;
    send(channel: "themeCreatorRemoveTheme", themeId: string): this;
    send(channel: "enabled", enabled: boolean): this;
    send(channel: "updateFigmaUiScale", scale: number): this;
    send(channel: "logDebug", ...args: any[]): this;
    send(channel: "logInfo", ...args: any[]): this;
    send(channel: "logError", ...args: any[]): this;
    send(channel: "removeLocalFileExtension", id: number): this;
    send(channel: "openExtensionDirectory", id: number): this;
    send(channel: "openMainMenu"): this;
    send(channel: "openMainTabMenu"): this;
    send(channel: "openCommunityTabMenu"): this;
    send(channel: "openTabMenu", tabId: number): this;
    send(channel: "newProject"): this;
    send(channel: "closeCommunityTab"): this;
    send(channel: "appExit"): this;
    send(channel: "updateVisibleNewProjectBtn", visible: boolean): this;
    send(channel: "updateFullscreenMenuState", state: Menu.State): this;
    send(channel: "saveCreatorTheme", theme: Themes.Theme): this;
    send(channel: "syncThemes"): this;
    send(channel: "setClipboardData", data: WebApi.SetClipboardData): this;
    send(channel: "set-use-zenity", value: boolean): this;
    send(channel: "windowDidMaximized"): this;
    send(channed: "windowDidRestored"): this;
    send(channed: "changeTheme", theme: Themes.Theme): this;
    send(channed: "windowClose", tabs: Types.TabFront[]): this;
    send(channed: "toggleThemeCreatorPreviewMask"): this;
    send(channed: "setInitialOptions", data: WebApi.SetInitOptions): this;
    send(channed: "setUser", userId: string): this;
    send(
      channed: "web-callback:registerManifestChangeObserver",
      callbackID: number,
      args?: any,
    ): this;
    send(channed: "web-callback:registerCodeChangeObserver", callbackID: number, args?: any): this;
    send(channed: "web-callback:registerUiChangeObserver", callbackID: number, args?: any): this;

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
    invoke(channel: "createFile", data: WebApi.CreateFile): Promise<any>;
    invoke(channel: "themesIsDisabled"): Promise<boolean>;
    invoke(channel: "isDevToolsOpened"): Promise<boolean>;
    invoke(channel: "writeFiles", data: WebApi.WriteFiles): Promise<void>;
    invoke(channel: "getFonts"): Promise<Fonts.IFonts>;
    invoke(channel: "getFontFile", data: WebApi.GetFontFile): Promise<Buffer>;
    invoke(channel: "selectExportDirectory"): Promise<string | null>;
    invoke(channel: "updatePanelScale", scale: number): this;
    invoke(channel: "requestMicrophonePermission"): this;
    invoke(
      channel: "writeNewExtensionDirectoryToDisk",
      data: WebApi.WriteNewExtensionDirectoryToDisk,
    ): this;
    invoke(channel: "getLocalManifestFileExtensionIdsToCachedMetadataMap"): this;
  }

  interface WebContents extends NodeJS.EventEmitter {
    send(channel: "renderView", view: Types.View): void;
    send(channel: "themesLoaded", themes: Themes.Theme[]): void;
    send(channel: "toggleThemeCreatorPreviewMask"): void;
    send(channel: "updateVisibleNewProjectBtn", visible: boolean): void;
    send(channel: "setPanelScale", scale: number, height: number): void;
    send(channel: "updateUiScale", scale: number): void;
    send(channel: "closeAllTab"): void;
    send(channel: "setTitle", data: { id: number; title: string }): void;
    send(channel: "didTabAdd", data: Types.Tab): this;
    send(channel: "handleUrl", url: string): this;
    send(channel: "focusTab", tabId: Types.TabIdType): this;
    send(channel: "newFileBtnVisible", visible: boolean): this;
    send(channel: "tabWasClosed", tabId: number): this;
    send(channel: "setUsingMicrophone", data: { id: number; isUsingMicrophone: boolean }): this;
    send(channel: "setIsInVoiceCall", data: { id: number; isInVoiceCall: boolean }): this;
    send(channel: "loadCreatorTheme", theme: Themes.Theme): this;
    send(channel: "loadCurrentTheme", theme: Themes.Theme): this;
    send(channel: "loadCreatorThemes", themes: Themes.Theme[]): this;
    send(channel: "syncThemesStart", theme: Themes.Theme): this;
    send(channel: "syncThemesEnd", theme: Themes.Theme): this;
    send(channel: "isMainMenuOpen", isOpen: boolean): this;
    send(channel: "communityTabWasClose", isOpen: boolean): this;
    send(channel: "loading", tabId: number, loading: boolean): this;
    send(channel: "loadSettings", settings: Types.SettingsInterface): this;
    send(channel: "getThemeCreatorPalette", palette: Themes.Palette): this;
    send(channel: "changeZoomFactor", zoom: number): this;
    send(channel: "openCommunity"): this;

    destroy(): void;
  }

  interface RequestHeaders {
    [name: string]: string;
  }
}
