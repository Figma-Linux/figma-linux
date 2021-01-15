import * as util from "util";
import * as cp from "child_process";

import { logger } from "./Logger";

export class Process {
  constructor() {}

  public exec = async (command: string): Promise<string> => {
    const exec = util.promisify(cp.exec);

    const result = await exec(command);

    if (result.stderr !== "") {
      logger.error(`Exec command: "${command}" fails with error: `, result.stderr);
      throw new Error(`Exec command: "${command}" fails with error: ${result.stderr}`);
    }

    return result.stdout;
  };

  public execSync = (command: string): string => {
    const result = cp.execSync(command);

    return result.toString();
  };
}

export const process = new Process();
