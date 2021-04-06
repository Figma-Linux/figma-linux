import { v4 } from "uuid";
import { LogLevel } from "Enums";

export const DEFAULT_SETTINGS: SettingsInterface = {
  clientId: v4(),
  userId: "",
  authedUserIDs: [],
  app: {
    logLevel: LogLevel.INFO,
    enableColorSpaceSrgb: false,
    visibleNewProjectBtn: true,
    useZenity: false,
    panelHeight: 40,
    saveLastOpenedTabs: true,
    exportDir: `${process.env.HOME}/Pictures/Figma`,
    fontDirs: [
      "/usr/share/fonts",
      "/usr/local/share/fonts",
      "/run/host/fonts",
      "/run/host/user-fonts",
      `${process.env.HOME}/.local/share/fonts`,
    ],
    lastOpenedTabs: [],
    featureFlags: {},
    savedExtensions: [],
  },
  theme: {
    currentTheme: "0",
  },
  ui: {
    scalePanel: 1,
    scaleFigmaUI: 1,
  },
};
