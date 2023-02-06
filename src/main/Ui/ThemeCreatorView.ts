import { app, ipcMain, BrowserView, IpcMainEvent, Rectangle } from "electron";
import { isDev } from "Utils/Common";
import { storage } from "Main/Storage";
import { themeCreatorUrlDev, themeCreatorUrlProd, toggleDetachedDevTools } from "Utils/Main";

export default class ThemeCreatorView {
  public view: BrowserView;
  public theme: Themes.Theme;

  constructor() {
    this.view = new BrowserView({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        experimentalFeatures: false,
      },
    });

    this.view.setAutoResize({
      width: true,
      height: true,
      horizontal: true,
      vertical: true,
    });

    this.view.webContents.loadURL(isDev ? themeCreatorUrlDev : themeCreatorUrlProd);

    this.registerEvents();
  }

  public updateProps(bounds: Rectangle) {
    this.view.setBounds({
      height: bounds.height,
      width: bounds.width,
      y: 0,
      x: 0,
    });
  }
  public closeDevTools() {
    if (this.view.webContents.isDevToolsOpened()) {
      this.view.webContents.closeDevTools();
    }
  }

  private toggleDevTools() {
    toggleDetachedDevTools(this.view.webContents);
  }
  private loadCreatorTheme(theme: Themes.Theme) {
    this.view.webContents.send("loadCreatorTheme", theme);
  }
  private loadCurrentTheme(theme: Themes.Theme) {
    this.view.webContents.send("loadCurrentTheme", theme);
  }
  private changeTheme(_: IpcMainEvent, theme: Themes.Theme) {
    this.loadCurrentTheme(theme);

    storage.settings.theme.currentTheme = theme.id;
  }

  private registerEvents() {
    ipcMain.on("changeTheme", this.changeTheme.bind(this));

    app.on("toggleCreatorDeveloperTools", this.toggleDevTools.bind(this));
    app.on("loadCreatorTheme", this.loadCreatorTheme.bind(this));
    app.on("loadCurrentTheme", this.loadCurrentTheme.bind(this));
  }
}
