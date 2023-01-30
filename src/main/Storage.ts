import { app, ipcMain, ipcRenderer } from "electron";
import * as path from "path";
import * as fs from "fs";
import * as _ from "lodash";

import * as Const from "Const";
import { DEFAULT_SETTINGS, accessSync } from "Utils/Main";

/**
 * This class has dual initialization: in main process and renderer process
 * For change the settings from renderer process the class use Ipc communication
 */
export class Storage {
  private filePath: string;
  private settings: SettingsInterface;

  constructor() {
    this.filePath = path.join(app.getPath("userData"), "settings.json");

    this.createIfNotExist();

    if (process.type === "browser") {
      this.initListeners();
    }
  }

  private initListeners = () => {
    ipcMain.on("set-settings", (_, settings) => {
      this.set(settings);
    });
  };
  private createIfNotExist = (): void => {
    const exist = accessSync(this.filePath);

    if (!exist) {
      const mergedSettings = _.merge(DEFAULT_SETTINGS, this.settings);

      this.settings = mergedSettings;
      this.writeSync(mergedSettings);

      return;
    }

    this.settings = this.readSync();
  };
  private readSync = (): SettingsInterface => {
    const content = fs.readFileSync(this.filePath).toString();

    return JSON.parse(content);
  };
  private writeSync = (settings: SettingsInterface): void => {
    fs.writeFileSync(this.filePath, JSON.stringify(settings, null, 2));
  };

  public get = (): SettingsInterface => {
    return this.readSync();
  };

  public set = (settings: SettingsInterface): void => {
    if (process.type === "renderer") {
      ipcRenderer.send("set-settings", settings);
    } else {
      this.settings = settings;
      this.writeSync(this.settings);
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
  public setUserIds = (ids: string[]): void => {
    this.settings.authedUserIDs = ids;

    this.set(this.settings);
  };
  public setUserId = (id: string): void => {
    this.settings.userId = id;

    this.set(this.settings);
  };
}

export const storage = new Storage();
