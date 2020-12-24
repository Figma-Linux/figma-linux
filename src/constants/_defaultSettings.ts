import { LogLevel } from "Enums";

export const DEFAULT_SETTINGS: SettingsInterface = {
  app: {
    logLevel: LogLevel.INFO,
    panelHeight: 40,
    showMainMenu: true,
    disabledMainMenu: false,
    saveLastOpenedTabs: true,
    windowFrame: false,
    disabledFonts: false,
    exportDir: `${process.env.HOME}/Pictures/Figma`,
    fontDirs: ["/usr/share/fonts", "/usr/local/share/fonts", `${process.env.HOME}/.local/share/fonts`],
    lastOpenedTabs: [],
    featureFlags: {},
  },
  theme: {
    currentTheme: "0",
  },
  ui: {
    scalePanel: 1,
    scaleFigmaUI: 1,
  },
};
