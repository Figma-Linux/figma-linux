import * as E from "electron";
import { storage } from "Storage";
import { observable, action, toJS } from "mobx";

export class Settings {
  @observable settings?: SettingsInterface;
  @observable isSyncDisabled: boolean;

  private useZenityChanged = false;

  constructor() {
    this.settings = storage.get();

    this.isSyncDisabled = false;

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
  public enableColorSpaceSrgb = (enabled: boolean): void => {
    this.settings.app.enableColorSpaceSrgb = enabled;

    E.ipcRenderer.send("enableColorSpaceSrgbWasChanged", enabled);
  };

  @action
  public visibleNewProjectBtn = (visible: boolean): void => {
    this.settings.app.visibleNewProjectBtn = visible;
  };
  @action
  public changeUseZenity = (value: boolean): void => {
    this.settings.app.useZenity = value;

    this.useZenityChanged = true;
  };

  @action
  public selectExportDir = async (): Promise<void> => {
    const directory = await E.ipcRenderer.invoke("select-export-directory");

    if (!directory) {
      return;
    }

    this.settings.app.exportDir = directory;
  };
  @action
  public inputExportDir = (dir: string): void => {
    this.settings.app.exportDir = dir;
  };

  @action
  public addDir = async (): Promise<void> => {
    const directories = await E.ipcRenderer.invoke("add-font-directories");

    if (!directories) {
      return;
    }

    this.settings.app.fontDirs = [...this.settings.app.fontDirs, ...directories];
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

    E.ipcRenderer.send("updateVisibleNewProjectBtn", settings.app.visibleNewProjectBtn);

    if (this.useZenityChanged) {
      E.ipcRenderer.send("set-use-zenity", settings.app.useZenity);
    }
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
    E.ipcRenderer.on("updateVisibleNewProjectBtn", (sender, height) => {
      this.settings.app.visibleNewProjectBtn = height;
    });
    E.ipcRenderer.on("themes-change", (sender, theme) => {
      this.settings.theme.currentTheme = theme.id;
    });
    E.ipcRenderer.on("sync-themes-start", () => {
      this.isSyncDisabled = true;
    });
    E.ipcRenderer.on("sync-themes-end", () => {
      this.isSyncDisabled = false;
    });
  };
}

export const settings = new Settings();
