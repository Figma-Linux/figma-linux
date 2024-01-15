import { app, ipcMain, IpcMainEvent, ipcRenderer } from "electron";
import * as path from "path";
import * as fs from "fs";

import { DEFAULT_SETTINGS, accessSync } from "Utils/Main";
import { logger } from "./Logger";

/**
 * This class has dual initialization: in main process and renderer process
 * For change the settings from renderer process the class use Ipc communication
 */
export class Storage {
  private filePath: string;
  public settings: Types.SettingsInterface;

  constructor() {
    this.filePath = path.join(app.getPath("userData"), "settings.json");

    this.load();
    this.registerEvents();
  }

  private load = (): void => {
    const exist = accessSync(this.filePath);

    if (!exist) {
      const mergedSettings = {
        ...DEFAULT_SETTINGS,
        ...this.settings,
      };

      this.settings = mergedSettings;
      this.writeSync(mergedSettings);

      return;
    }

    this.settings = this.readSync();

    this.settings = {
      ...DEFAULT_SETTINGS,
      ...this.settings,
      app: {
        ...DEFAULT_SETTINGS.app,
        ...this.settings.app,
      },
    };

    this.writeSync(this.settings);
  };
  private readSync = (): Types.SettingsInterface => {
    const content = fs.readFileSync(this.filePath).toString();

    let settings: Types.SettingsInterface;
    try {
      settings = JSON.parse(content);
    } catch (error) {
      logger.error("Parse settings.json file error: ", error);
      logger.warn("Apply default settings instead file settings.");
      settings = DEFAULT_SETTINGS;
    }

    return settings;
  };
  private writeSync = (settings: Types.SettingsInterface): void => {
    fs.writeFileSync(this.filePath, JSON.stringify(settings, null, 2));
  };

  public save() {
    this.writeSync(this.settings);
  }

  public setFeatureFlags(_: IpcMainEvent, data: { featureFlags: Types.FeatureFlags }) {
    this.settings.app.featureFlags = {
      ...this.settings.app.featureFlags,
      ...data.featureFlags,
    };
  }
  public getSettings(event: IpcMainEvent) {
    event.returnValue = this.settings;
  }

  private registerEvents() {
    ipcMain.on("setFeatureFlags", this.setFeatureFlags.bind(this));
    ipcMain.on("getSettings", this.getSettings.bind(this));
  }
}

export const storage = new Storage();
