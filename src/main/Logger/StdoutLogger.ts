import { Logger } from "./Logger";

export class StdoutLogger extends Logger {
  constructor() {
    super();
  }

  public log = (msg: string) => {
    console.log(msg);
  };
}
