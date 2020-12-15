import * as E from "electron";
import * as S from "electron-settings";
import { observable, action, toJS } from "mobx";

export class Settings {
  @observable settings?: SettingsInterface;

  constructor() {
    this.settings = S.getSync() as SettingsInterface;

    this.events();
  }

  @action
  public updateFigmaUiScale = (delta: number): void => {
    const d = +(delta / 100).toFixed(2);

    if (d) {
      this.settings.ui.scaleFigmaUI = d;
    } else {
      this.settings.ui.scaleFigmaUI = 1;
    }

    E.ipcRenderer.send("updateFigmaUiScale", d);
  };
  @action
  public updatePanelScale = (delta: number): void => {
    const d = +(delta / 100).toFixed(2);

    if (d) {
      this.settings.ui.scalePanel = d;
    } else {
      this.settings.ui.scalePanel = 1;
    }

    E.ipcRenderer.send("updatePanelScale", d);
  };

  @action
  public updateShowMainMenu = (show: boolean): void => {
    this.settings.app.showMainMenu = show;

    E.ipcRenderer.send("setVisibleMainMenu", show);
  };
  @action
  public updateDisableMainMenu = (disabled: boolean): void => {
    this.settings.app.disabledMainMenu = disabled;

    E.ipcRenderer.send("setDisableMainMenu", disabled);
  };
  @action
  public saveLastOpenedTabs = (save: boolean): void => {
    this.settings.app.saveLastOpenedTabs = save;
  };
  @action
  public updateWindowFrame = (show: boolean): void => {
    this.settings.app.windowFrame = show;
  };
  @action
  public updateDisabledFonts = (disabled: boolean): void => {
    this.settings.app.disabledFonts = disabled;

    // TODO: fix disabling read local fonts
    // E.ipcRenderer.send("set-disable-fonts", disabled);
  };

  @action
  public selectExportDir = (): void => {
    const dirs = E.remote.dialog.showOpenDialogSync({ properties: ["openDirectory"] });

    this.settings.app.exportDir = dirs[0];
  };
  @action
  public inputExportDir = (dir: string): void => {
    this.settings.app.exportDir = dir;
  };

  @action
  public addDir = (): void => {
    const dirs = E.remote.dialog.showOpenDialogSync({ properties: ["openDirectory", "multiSelections"] });

    this.settings.app.fontDirs = [...this.settings.app.fontDirs, ...dirs];
  };
  @action
  public removeDir = (index: number): void => {
    if (this.settings.app.fontDirs.length <= 1) {
      return;
    }

    this.settings.app.fontDirs = this.settings.app.fontDirs.filter((e, i) => i !== index);
  };

  @action
  public changeTheme = (id: string): void => {
    if (!this.settings.theme) {
      this.settings.theme = {
        currentTheme: "0",
      };
    }

    this.settings.theme.currentTheme = id;
  };

  public setSettings = () => {
    const settings = toJS(this.settings);

    S.set(settings);
  };

  private events = (): void => {
    E.ipcRenderer.on("updateUiScale", (sender, scale) => {
      this.settings.ui.scaleFigmaUI = scale;
    });
    E.ipcRenderer.on("updatePanelScale", (sender, scale) => {
      this.settings.ui.scalePanel = scale;
    });
    E.ipcRenderer.on("updatePanelHeight", (sender, height) => {
      this.settings.app.panelHeight = height;
    });
    E.ipcRenderer.on("updateMainMenuVisibility", (sender, show) => {
      this.settings.app.showMainMenu = show;
    });
  };
}

export const settings = new Settings();
