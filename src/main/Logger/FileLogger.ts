import { writeFile } from "fs/promises";
import { join } from "path";
import { app } from "electron";

import { storage } from "../Storage";
import { Logger } from "./Logger";

export class FileLogger extends Logger {
  private logFilePath: string;

  constructor() {
    super();

    this.logFilePath = join(app.getPath("userData"), "logfile.log");
    this.truncFile();
  }

  private truncFile() {
    const currentTimestamp = new Date().getTime();

    if (storage.settings.app.lastTimeClearLogFile === 0) {
      storage.settings.app.lastTimeClearLogFile = currentTimestamp;
      storage.save();
    }

    const cmprTimestamp = storage.settings.app.lastTimeClearLogFile + 8.64e7;

    if (cmprTimestamp <= currentTimestamp) {
      writeFile(this.logFilePath, "", { flag: "w" }).catch((error) => {
        this.error(`Cannot write log to file: ${this.logFilePath}, error: `, error);
      });

      storage.settings.app.lastTimeClearLogFile = currentTimestamp;
      storage.save();
    }
  }

  public log = (msg: string) => {
    writeFile(this.logFilePath, `${msg}\n`, { flag: "a" }).catch((error) => {
      this.error(`Cannot write log to file: ${this.logFilePath}, error: `, error);
    });
  };
}
