import * as E from "electron";

import { LOGLEVEL } from "Const";
import { LogLevel } from "Enums";
import { storage } from "./Storage";

export class Logger {
  private levels = ["DEBUG", "INFO", "ERROR"];
  private logLevel = 1;
  constructor() {
    if (LOGLEVEL) {
      this.logLevel = this.levels.indexOf(LOGLEVEL);
    } else {
      this.logLevel = storage.getLogLevel();
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

  private print = (level: number, ...argv: any[]) => {
    if (level < this.logLevel) {
      return;
    }

    const dateTime = this.getDateTime();

    console.log(`[${dateTime}]:[${this.levels[level]}] -`, ...argv);
  };

  public debug = (...argv: any[]): void => {
    this.print(LogLevel.DEBUG, ...argv);
  };
  public info = (...argv: any[]): void => {
    this.print(LogLevel.INFO, ...argv);
  };
  public error = (...argv: any[]): void => {
    this.print(LogLevel.ERROR, ...argv);
  };
}

export const logger = new Logger();
