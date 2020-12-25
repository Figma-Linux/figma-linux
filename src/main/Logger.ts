import * as Settings from "electron-settings";
import * as E from "electron";

import { LOGLEVEL } from "Const";
import { LogLevel } from "Enums";

export class Logger {
  private levels = ["DEBUG", "INFO", "ERROR"];
  private logLevel = 1;
  constructor() {
    if (LOGLEVEL) {
      this.logLevel = this.levels.indexOf(LOGLEVEL);
    } else {
      // TODO: to move in separate storage module
      this.logLevel = (Settings.getSync() as SettingsInterface).app.logLevel as LogLevel;
    }

    this.initLoggerEvent();
  }

  private initLoggerEvent = (): void => {
    E.ipcMain.on("log-debug", (sender, ...msg) => this.debug(`[From web content: ${sender.sender.id}]`, ...msg));
    E.ipcMain.on("log-info", (sender, ...msg) => this.info(`[From web content: ${sender.sender.id}]`, ...msg));
    E.ipcMain.on("log-error", (sender, ...msg) => this.error(`[From web content: ${sender.sender.id}]`, ...msg));
  };

  private getDateTime = (): string => {
    const currentDate = new Date();

    return currentDate.toLocaleString();
  };

  private print = (level: number, ...argv: ValidObject[]) => {
    if (level < this.logLevel) {
      return;
    }

    const dateTime = this.getDateTime();

    console.log(`[${dateTime}]:[${this.levels[level]}] -`, ...argv);
  };

  public debug = (...argv: ValidObject[]): void => {
    this.print(LogLevel.DEBUG, ...argv);
  };
  public info = (...argv: ValidObject[]): void => {
    this.print(LogLevel.INFO, ...argv);
  };
  public error = (...argv: ValidObject[]): void => {
    this.print(LogLevel.ERROR, ...argv);
  };
}

export const logger = new Logger();
