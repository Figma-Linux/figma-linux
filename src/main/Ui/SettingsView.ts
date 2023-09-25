import { app, ipcMain, BrowserView, Rectangle, IpcMainEvent } from "electron";
import { storage } from "Main/Storage";
import { isDev } from "Utils/Common";
import { settingsUrlProd, settingsUrlDev, toggleDetachedDevTools } from "Utils/Main";
import { dialogs } from "Main/Dialogs";

export default class SettingsView {
  private enableColorSpaceSrgbWasChanged = false;
  private disableThemesChanged = false;

  public view: BrowserView;

  constructor() {
    this.view = new BrowserView({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        experimentalFeatures: false,
        webviewTag: true,
      },
    });

    this.view.setAutoResize({
      width: true,
      height: true,
      horizontal: true,
      vertical: true,
    });

    this.view.webContents.loadURL(isDev ? settingsUrlDev : settingsUrlProd);

    this.registerEvents();
  }

  public closeDevTools() {
    if (this.view.webContents.isDevToolsOpened()) {
      this.view.webContents.closeDevTools();
    }
  }

  public postClose() {
    let id = 1;
    if (this.enableColorSpaceSrgbWasChanged) {
      id = dialogs.showMessageBoxSync({
        type: "question",
        title: "Figma",
        message: "Restart to Change Color Space?",
        detail: `Figma needs to be restarted to change the color space.`,
        textOkButton: "Restart",
        defaultFocusedButton: "Ok",
      });
    }
    if (this.disableThemesChanged) {
      let text = "Restart to disable themes?";
      const disableThemes = storage.settings.app.disableThemes;

      if (!disableThemes) {
        text = "Restart to enable themes?";
      }

      id = dialogs.showMessageBoxSync({
        type: "question",
        title: "Figma",
        message: text,
        detail: `Figma needs to be restarted to change use of themes.`,
        textOkButton: "Restart",
        defaultFocusedButton: "Ok",
      });
    }

    if (!id) {
      app.emit("relaunchApp");
    }
  }

  public updateProps(bounds: Rectangle) {
    this.enableColorSpaceSrgbWasChanged = false;
    this.view.setBounds({
      height: bounds.height,
      width: bounds.width,
      y: 0,
      x: 0,
    });
  }

  public toggleThemeCreatorPreviewMask() {
    this.view.webContents.send("toggleThemeCreatorPreviewMask");
  }

  private enableColorSpaceSrgbChange(_: IpcMainEvent, enabled: boolean) {
    const previousValue = storage.settings.app.enableColorSpaceSrgb;

    if (enabled === previousValue) {
      return;
    }

    this.enableColorSpaceSrgbWasChanged = true;
  }
  private disableThemesChange(_: IpcMainEvent, enabled: boolean) {
    const previousValue = storage.settings.app.disableThemes;

    if (enabled === previousValue) {
      return;
    }

    this.disableThemesChanged = true;
  }
  private syncThemesStart() {
    toggleDetachedDevTools(this.view.webContents);
  }
  private syncThemesEnd(themes: Themes.Theme[]) {
    this.view.webContents.send("themesLoaded", themes);
  }
  private loadCurrentTheme(theme: Themes.Theme) {
    this.view.webContents.send("loadCurrentTheme", theme);
  }
  private loadCreatorThemes(themes: Themes.Theme[]) {
    this.view.webContents.send("loadCreatorThemes", themes);
  }
  private changeTheme(_: IpcMainEvent, theme: Themes.Theme) {
    this.loadCurrentTheme(theme);

    storage.settings.theme.currentTheme = theme.id;
  }

  private loadSettings() {
    this.view.webContents.send("loadSettings", storage.settings);
  }
  private handleFrontReady() {
    this.loadSettings();
  }

  private registerEvents() {
    ipcMain.on("enableColorSpaceSrgbWasChanged", this.enableColorSpaceSrgbChange.bind(this));
    ipcMain.on("disableThemesChanged", this.disableThemesChange.bind(this));
    ipcMain.on("changeTheme", this.changeTheme.bind(this));
    ipcMain.on("frontReady", this.handleFrontReady.bind(this));

    app.on("syncThemesStart", this.syncThemesStart.bind(this));
    app.on("syncThemesEnd", this.syncThemesEnd.bind(this));
    app.on("loadCurrentTheme", this.loadCurrentTheme.bind(this));
    app.on("loadCreatorThemes", this.loadCreatorThemes.bind(this));
  }
}
