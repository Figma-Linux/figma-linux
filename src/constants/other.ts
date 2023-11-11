import { parse } from "url";

export const LOGLEVEL = process.env.FIGMA_LOGLEVEL as string | undefined;

export const HOMEPAGE = "https://www.figma.com";
export const LOGOUT_PAGE = `${HOMEPAGE}/logout`;
export const LOGIN_PAGE = `${HOMEPAGE}/login`;
export const RECENT_FILES = `${HOMEPAGE}/files/recent`;
export const NEW_PROJECT_TAB_URL = `${HOMEPAGE}/desktop_new_tab`;
export const COMMUNITY_TAB_URL = `${HOMEPAGE}/@figma_linux`;
export const PARSED_HOMEPAGE = parse("https://www.figma.com");

export const DOWNLOAD_ZIP_URI =
  "https://github.com/Figma-Linux/figma-linux-themes/archive/master.zip";
export const DOWNLOAD_ZIP_PATH = "/tmp/master.zip";

export const TOPPANELHEIGHT = 40;
export const MENU_WIDTH = 330;

export const PROTOCOL = "figma";

export const TEST_THEME_ID = "test-creator-theme";

export const MANIFEST_FILE_NAME = "manifest.json";
export const CHROME_GPU = "chrome://gpu";

export const CONFIGDIR = `${process.env.HOME}/.config/figma-linux`;
export const RESOURCESDIR = `${process.env.HOME}/.config/figma-linux/resources`;
export const REGEXP_APP_AUTH_GRANT = /^\/{0,2}app_auth\/[^/]+\/grant/;

export const FIGMA_SESSION_COOKIE_NAME = "figma.session";

export const FILE_WHITE_LIST = [".gitignore"];
export const FILE_EXTENSION_WHITE_LIST = [
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".ts",
  ".tsx",
];

export const NEW_FILE_TAB_TITLE = "New file";

export const LINKS = {
  HELP_PAGE: "https://help.figma.com",
  PLUGINS_DOCS: `${HOMEPAGE}/plugin-docs/intro`,
  FIGMA_COMMUNITY_FORUM: "https://spectrum.chat/figma",
  FIGMA_LINUX_COMMUNITY_FORUM: "https://spectrum.chat/figma-linux",
  FIGMA_LINUX_TELEGRAM: "https://t.me/figma_linux",
  VIDEO_TUTORIALS: "https://www.youtube.com/figmadesign",
  RELEASE_NOTES: "https://github.com/Figma-Linux/figma-linux/releases/latest",
  LEGAL_SUMMARY: `${HOMEPAGE}/summary-of-policy`,
  THEMES_REPO: "https://github.com/Figma-Linux/figma-linux-themes",
};
