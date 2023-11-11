import { FileLogger } from "./FileLogger";
import { StdoutLogger } from "./StdoutLogger";
import { AppLogger } from "./AppLogger";

export const logger = new AppLogger([new FileLogger(), new StdoutLogger()]);
