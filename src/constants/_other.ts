import { parse } from "url";

export const HOMEPAGE = "https://www.figma.com";
export const PARSED_HOMEPAGE = parse("https://www.figma.com");

export const TOPPANELHEIGHT = 40;

export const PROTOCOL = "figma";

export const MANIFEST_FILE_NAME = "manifest.json";

export const CONFIGDIR = `${process.env.HOME}/.config/figma-linux`;
export const RESOURCESDIR = `${process.env.HOME}/.config/figma-linux/resources`;
export const REGEXP_APP_AUTH_GRANT = /^\/{0,2}app_auth\/[^\/]+\/grant/;
export const REGEXP_APP_AUTH_REDEEM = /^\/{0,2}app_auth\/redeem/;

export const FIGMA_SESSION_COOKIE_NAME = "figma.st";
