import * as E from "electron";
import { storage } from "Storage";
import { observable, action, toJS } from "mobx";

export class Settings {
  @observable settings?: SettingsInterface;

  constructor() {
    this.settings = storage.get();

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
  public saveLastOpenedTabs = (save: boolean): void => {
    this.settings.app.saveLastOpenedTabs = save;
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

    storage.set(settings);
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
  };
}

export const settings = new Settings();
