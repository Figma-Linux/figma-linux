import { app, ipcMain, IpcMainEvent, ipcRenderer } from "electron";
import * as path from "path";
import * as fs from "fs";

import { DEFAULT_SETTINGS, accessSync } from "Utils/Main";

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
  };
  private readSync = (): Types.SettingsInterface => {
    const content = fs.readFileSync(this.filePath).toString();

    return JSON.parse(content);
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
