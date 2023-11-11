import { randomUUID } from "crypto";
import { LogLevel } from "Types/enums";

export const DEFAULT_SETTINGS: Types.SettingsInterface = {
  clientId: randomUUID(),
  userId: "",
  authedUserIDs: [],
  app: {
    logLevel: LogLevel.INFO,
    lastTimeClearLogFile: 0,
    enableColorSpaceSrgb: false,
    visibleNewProjectBtn: true,
    useZenity: false,
    disableThemes: false,
    panelHeight: 40,
    saveLastOpenedTabs: true,
    exportDir: `${process.env.HOME}/Pictures/Figma`,
    commandSwitches: [
      { switch: "enable-gpu-rasterization" },
      // { switch: "enable-unsafe-webgpu" },
      // { switch: "enable-skia-graphite" },
      // { switch: "enable-accelerated-2d-canvas" },
      { switch: "enable-experimental-canvas-features" },
      { switch: "use-vulkan" },
    ],
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
