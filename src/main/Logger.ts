import * as Settings from "electron-settings";
import * as E from "electron";

import { LOGLEVEL } from "Const";
import { LogLevel } from "Enums";

export class Logger {
  private logLevel: LogLevel = LogLevel.INFO;
  constructor() {
    if (LOGLEVEL) {
      this.logLevel = LOGLEVEL;
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

  private print = (level: string, ...argv: ValidObject[]) => {
    const dateTime = this.getDateTime();

    console.log(`[${dateTime}]:[${level}] -`, ...argv);
  };

  public debug = (...argv: ValidObject[]): void => {
    if (this.logLevel === LogLevel.DEBUG) {
      this.print(LogLevel.DEBUG, ...argv);
    }
  };
  public info = (...argv: ValidObject[]): void => {
    if (this.logLevel !== LogLevel.ERROR) {
      this.print(LogLevel.INFO, ...argv);
    }
  };
  public error = (...argv: ValidObject[]): void => {
    this.print(LogLevel.ERROR, ...argv);
  };
}

export const logger = new Logger();
