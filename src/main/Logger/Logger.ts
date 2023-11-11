import { LOGLEVEL } from "Const";
import { LogLevel } from "Types/enums";
import { storage } from "../Storage";

export class Logger {
  protected levels = ["DEBUG", "INFO", "WARN", "ERROR"];
  private logLevel = 1;
  constructor() {
    if (LOGLEVEL) {
      this.logLevel = this.levels.indexOf(LOGLEVEL);
    } else {
      this.logLevel = storage.settings.app.logLevel;
    }
  }

  protected getDateTime = (): string => {
    const currentDate = new Date();

    return currentDate.toLocaleString();
  };

  public log = (msg: string) => {
    const dateTime = this.getDateTime();

    console.log(`[${dateTime}]:[WARN] - Implement the 'log' method in child class.`);
  };
  protected format = (level: number, ...argv: unknown[]): string => {
    if (level < this.logLevel) {
      return;
    }

    const dateTime = this.getDateTime();

    return (
      `[${dateTime}]:[${this.levels[level]}] - ` +
      argv.map((msg) =>
        msg instanceof Error
          ? JSON.stringify({
              name: msg.name,
              message: msg.message,
              cause: msg.cause,
              stack: msg.stack,
            })
          : msg,
      )
    );
  };

  public debug = (...argv: unknown[]): void => {
    this.log(this.format(LogLevel.DEBUG, ...argv));
  };
  public info = (...argv: unknown[]): void => {
    this.log(this.format(LogLevel.INFO, ...argv));
  };
  public warn = (...argv: unknown[]): void => {
    this.log(this.format(LogLevel.WARN, ...argv));
  };
  public error = (...argv: unknown[]): void => {
    this.log(this.format(LogLevel.ERROR, ...argv));
  };
}
