import { parse } from "url";

export const HOMEPAGE = "https://www.figma.com";
export const RECENT_FILES = "https://www.figma.com/files/recent";
export const PARSED_HOMEPAGE = parse("https://www.figma.com");

export const TOPPANELHEIGHT = 40;

export const PROTOCOL = "figma";

export const MANIFEST_FILE_NAME = "manifest.json";

export const CONFIGDIR = `${process.env.HOME}/.config/figma-linux`;
export const RESOURCESDIR = `${process.env.HOME}/.config/figma-linux/resources`;
export const REGEXP_APP_AUTH_GRANT = /^\/{0,2}app_auth\/[^\/]+\/grant/;

export const FIGMA_SESSION_COOKIE_NAME = "figma.st";

export const UserAgent = {
  Windows:
    "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Figma/93.1.0 Chrome/85.0.4183.121 Electron/10.2.0 Safari/537.36",
};
