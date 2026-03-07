// Main process only constants (uses Node.js APIs)
import { parse } from "url";
import { HOMEPAGE } from "./other";

export const LOGLEVEL = process.env.FIGMA_LOGLEVEL as string | undefined;
export const PARSED_HOMEPAGE = parse(HOMEPAGE);
export const CONFIGDIR = `${process.env.HOME}/.config/figma-linux`;
export const RESOURCESDIR = `${process.env.HOME}/.config/figma-linux/resources`;
