import { parse } from "url";

export const LOGLEVEL = process.env.FIGMA_LOGLEVEL as string | undefined;

export const HOMEPAGE = "https://www.figma.com";
export const RECENT_FILES = "https://www.figma.com/files/recent";
export const PARSED_HOMEPAGE = parse("https://www.figma.com");

export const THEMES_REPO_URL = "https://github.com/Figma-Linux/figma-linux-themes/archive/master.zip";
export const DOWNLOAD_ZIP_PATH = "/tmp/master.zip";

export const TOPPANELHEIGHT = 40;
export const MENU_WIDTH = 330;

export const PROTOCOL = "figma";

export const TEST_THEME_ID = "test-creator-theme";

export const MANIFEST_FILE_NAME = "manifest.json";

export const CONFIGDIR = `${process.env.HOME}/.config/figma-linux`;
export const RESOURCESDIR = `${process.env.HOME}/.config/figma-linux/resources`;
export const REGEXP_APP_AUTH_GRANT = /^\/{0,2}app_auth\/[^\/]+\/grant/;

export const FIGMA_SESSION_COOKIE_NAME = "figma.st";

export const FILE_EXTENSION_WHITE_LIST = [".css", ".html", ".js", ".json", ".jsx", ".md", ".ts", ".tsx"];

export const LINKS = {
  HELP_PAGE: "https://help.figma.com",
  PLUGINS_DOCS: "https://www.figma.com/plugin-docs/intro",
  FIGMA_COMMUNITY_FORUM: "https://spectrum.chat/figma",
  FIGMA_LINUX_COMMUNITY_FORUM: "https://spectrum.chat/figma-linux",
  FIGMA_LINUX_TELEGRAM: "https://t.me/figma_linux",
  VIDEO_TUTORIALS: "https://www.youtube.com/figmadesign",
  RELEASE_NOTES: "https://github.com/Figma-Linux/figma-linux/releases/latest",
  LEGAL_SUMMARY: "https://www.figma.com/summary-of-policy",
};
