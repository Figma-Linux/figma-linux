import { v4 } from "uuid";
import { LogLevel } from "Types/enums";

export const DEFAULT_SETTINGS: Types.SettingsInterface = {
  clientId: v4(),
  userId: "",
  authedUserIDs: [],
  app: {
    logLevel: LogLevel.INFO,
    enableColorSpaceSrgb: false,
    visibleNewProjectBtn: true,
    useZenity: false,
    disableThemes: false,
    panelHeight: 40,
    saveLastOpenedTabs: true,
    hasOpenedCommunityTab: false,
    exportDir: `${process.env.HOME}/Pictures/Figma`,
    fontDirs: [
      "/usr/share/fonts",
      "/usr/local/share/fonts",
      "/run/host/fonts",
      "/run/host/user-fonts",
      `${process.env.HOME}/.local/share/fonts`,
    ],
    recentlyClosedTabs: [],
    windowsState: {},
    lastOpenedTabs: {},
    featureFlags: {},
    savedExtensions: [],
    themeDropdownOpen: true,
    creatorsThemesDropdownOpen: false,
    useOldPreviewer: false,
    dontShowTutorialCreator: false,
  },
  theme: {
    currentTheme: "0",
  },
  ui: {
    scalePanel: 1,
    scaleFigmaUI: 1,
  },
};
