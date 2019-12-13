import { commands } from "Utils/Main";

export default class Commander {
  private constructor() {}

  public static exec(id: string, ...args: any[]): void {
    commands().get(id)(...args);
  }
}
