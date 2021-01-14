import * as E from "electron";
import * as Settings from "electron-settings";
import * as _ from "lodash";

import * as Const from "Const";

/**
 * This class has dual initialization: in main process and renderer process
 * For change the settings from renderer process the class use Ipc communication
 */
export class Storage {
  private settings: SettingsInterface;

  constructor() {
    this.settings = Settings.getSync() as SettingsInterface;

    const mergedSettings = _.merge(Const.DEFAULT_SETTINGS, this.settings);

    this.settings = mergedSettings;
    Settings.setSync(mergedSettings);

    if (process.type === "browser") {
      this.initListeners();
    }
  }

  private initListeners = () => {
    E.ipcMain.on("set-settings", (event, settings) => {
      this.set(settings);
    });
  };

  public get = () => {
    return Settings.getSync() as SettingsInterface;
  };

  public set = (settings: SettingsInterface): void => {
    if (process.type === "renderer") {
      E.ipcRenderer.send("set-settings", settings);
    } else {
      this.settings = settings;
      Settings.setSync(this.settings);
    }
  };

  public getLogLevel = (): number => {
    return this.settings.app.logLevel;
  };
  public setOpenedTabs = (tabs: SavedTab[]): void => {
    if (tabs.length === 0) {
      return;
    }

    this.settings.app.lastOpenedTabs = tabs;

    this.set(this.settings);
  };
  public setFeatureFlags = (flags: FeatureFlags): void => {
    this.settings.app.featureFlags = _.merge(this.settings.app.featureFlags, flags);

    this.set(this.settings);
  };
  public setPanelHeight = (height: number): void => {
    this.settings.app.panelHeight = height;

    this.set(this.settings);
  };
  public saveExtension = (extensions: Extensions.ExtensionJson[]): void => {
    this.settings.app.savedExtensions = extensions;

    this.set(this.settings);
  };
  public clearLastOpenedTabs = (): void => {
    this.settings.app.lastOpenedTabs = [];

    this.set(this.settings);
  };
  public setLastPluginDirectory = (path: string): void => {
    this.settings.app.lastSavedPluginDir = path;

    this.set(this.settings);
  };
  public setExportDirectory = (path: string): void => {
    this.settings.app.lastExportDir = path;

    this.set(this.settings);
  };
  public setTheme = (id: string): void => {
    this.settings.theme.currentTheme = id;

    this.set(this.settings);
  };
}

export const storage = new Storage();
